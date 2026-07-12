import {
  Share2,
  UserCircle2,
  Camera,
  Compass,
  Megaphone,
  Search,
} from "lucide-react";

export const NAV_LINKS = [
  { label: "Who We Are", href: "#who-we-are" },
  { label: "What We Do", href: "#what-we-do" },
  { label: "Trusted By", href: "#trusted-by" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

export const HERO_SERVICES = [
  "Social Media",
  "Personal Branding",
  "Content Creation",
  "Strategy",
  "Paid Ads",
  "SEO",
];

export const SERVICES = [
  {
    icon: Share2,
    title: "Social Media Management",
    description:
      "Platform strategy, content calendars and consistent growth.",
  },
  {
    icon: UserCircle2,
    title: "Personal Branding",
    description: "Positioning and visual identity that builds trust.",
  },
  {
    icon: Camera,
    title: "Content Creation",
    description: "Shoots, edits and campaign assets that stop the scroll.",
  },
  {
    icon: Compass,
    title: "Strategy",
    description: "Roadmaps that connect goals to what gets posted.",
  },
  {
    icon: Megaphone,
    title: "Paid Ads",
    description: "Meta, Google and YouTube campaigns built for performance.",
  },
  {
    icon: Search,
    title: "SEO",
    description: "On-page and technical SEO so brands get found.",
  },
];

export const CLIENTS = [
  { name: "OPPO Delhi", tag: "Content Creation · Influencer Marketing" },
  { name: "Hollyland", tag: "Content Creation · Influencer Marketing" },
  { name: "Uber Indore", tag: "Content Creation · Influencer Marketing" },
  { name: "Astrotalk", tag: "Content Creation · Influencer Marketing" },
  { name: "Filmora", tag: "Content Creation · Influencer Marketing" },
  { name: "InDrive", tag: "Content Creation · Influencer Marketing" },
];

export const PRICING_TIERS = [
  {
    name: "Starter",
    price: "₹50,000",
    period: "/mo",
    popular: false,
    features: [
      "Strategy & planning",
      "Monthly content calendar",
      "Branding guidance",
      "Content editing",
      "15 content pieces/month",
      "Posting & scheduling",
    ],
  },
  {
    name: "Growth",
    price: "₹1,00,000",
    period: "/mo",
    popular: true,
    features: [
      "Everything in Starter",
      "20–25 content pieces/month",
      "On-ground shoot support (in-city clients)",
      "Priority strategy calls",
    ],
  },
  {
    name: "Premium",
    price: "₹2,00,000",
    period: "/mo",
    popular: false,
    features: [
      "End-to-end production (high-quality shoots to growth)",
      "Everything in Growth",
      "Paid ads strategy & execution",
      "Ad spend billed separately (client-funded)",
    ],
  },
];

export const CONTACT_INFO = {
  email: "digiyouthmedia@gmail.com",
  phone: "+91 98730 55222",
  handle: "@digiyouthmedia",
};
