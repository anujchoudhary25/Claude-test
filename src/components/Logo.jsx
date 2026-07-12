export default function Logo({ className = "h-10 w-10" }) {
  return (
    <img
      src="/logo.svg"
      alt="DigiYouth Media logo"
      className={`${className} rounded-full`}
    />
  );
}
