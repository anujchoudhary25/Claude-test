import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, FileText, Send, Settings } from "lucide-react";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/leads", label: "Leads", icon: Users },
  { to: "/templates", label: "Templates", icon: FileText },
  { to: "/send", label: "Send", icon: Send },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="w-56 shrink-0 border-r border-white/10 h-screen sticky top-0 flex flex-col p-4">
      <div className="font-display text-lg font-extrabold mb-8 px-2">
        Cold<span className="text-lime">Track</span>
      </div>
      <nav className="flex flex-col gap-1">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-lime text-ink"
                  : "text-bone/70 hover:bg-card hover:text-white"
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
