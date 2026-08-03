import { google } from "googleapis";
import { getSetting, setSetting } from "./db.js";

const SCOPES = [
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/gmail.readonly",
];

function getOAuthConfig() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI ||
    "http://localhost:4000/api/auth/gmail/callback";
  if (!clientId || !clientSecret) {
    throw new Error(
      "Missing GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET. Set them in cold-email/server/.env"
    );
  }
  return { clientId, clientSecret, redirectUri };
}

function newOAuthClient() {
  const { clientId, clientSecret, redirectUri } = getOAuthConfig();
  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

export function getAuthUrl() {
  const client = newOAuthClient();
  return client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
  });
}

export async function handleOAuthCallback(code) {
  const client = newOAuthClient();
  const { tokens } = await client.getToken(code);
  if (!tokens.refresh_token) {
    throw new Error(
      "Google did not return a refresh token. Revoke prior access at https://myaccount.google.com/permissions and try connecting again."
    );
  }
  client.setCredentials(tokens);

  const gmail = google.gmail({ version: "v1", auth: client });
  const profile = await gmail.users.getProfile({ userId: "me" });

  setSetting("gmail_refresh_token", tokens.refresh_token);
  setSetting("gmail_email", profile.data.emailAddress);
  return profile.data.emailAddress;
}

export function isGmailConnected() {
  return Boolean(getSetting("gmail_refresh_token"));
}

export function getConnectedEmail() {
  return getSetting("gmail_email") || null;
}

export function disconnectGmail() {
  setSetting("gmail_refresh_token", "");
  setSetting("gmail_email", "");
}

function getAuthorizedClient() {
  const refreshToken = getSetting("gmail_refresh_token");
  if (!refreshToken) {
    throw new Error("Gmail is not connected yet. Connect it from Settings.");
  }
  const client = newOAuthClient();
  client.setCredentials({ refresh_token: refreshToken });
  return client;
}

function getGmailApi() {
  return google.gmail({ version: "v1", auth: getAuthorizedClient() });
}

function base64url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function buildMimeMessage({ to, from, subject, body }) {
  const headers = [
    `To: ${to}`,
    `From: ${from}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    'Content-Type: text/plain; charset="UTF-8"',
  ];
  return `${headers.join("\r\n")}\r\n\r\n${body}`;
}

export async function sendMail({ to, subject, body }) {
  const gmail = getGmailApi();
  const fromEmail = getConnectedEmail();
  const fromName = getSetting("from_name") || "";
  const from = fromName ? `${fromName} <${fromEmail}>` : fromEmail;

  const raw = base64url(buildMimeMessage({ to, from, subject, body }));
  const res = await gmail.users.messages.send({
    userId: "me",
    requestBody: { raw },
  });
  return { messageId: res.data.id, threadId: res.data.threadId };
}

function decodeHeader(headers, name) {
  const h = headers.find((h) => h.name.toLowerCase() === name.toLowerCase());
  return h ? h.value : "";
}

export async function checkThreadForReply({ threadId, leadEmail }) {
  const gmail = getGmailApi();
  const res = await gmail.users.threads.get({
    userId: "me",
    id: threadId,
    format: "metadata",
    metadataHeaders: ["From", "Date"],
  });

  const messages = res.data.messages || [];
  if (messages.length <= 1) return { replied: false };

  const replyMsg = messages.find((m) => {
    const from = decodeHeader(m.payload.headers, "From").toLowerCase();
    return from.includes(leadEmail.toLowerCase());
  });

  if (!replyMsg) return { replied: false };

  return {
    replied: true,
    snippet: replyMsg.snippet || "",
    repliedAt: new Date(Number(replyMsg.internalDate)).toISOString(),
  };
}
