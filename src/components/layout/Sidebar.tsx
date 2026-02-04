import { NavLink } from "react-router-dom";
import { cn } from "@/utils/cn";

export function Sidebar() {
  return (
    <aside className="w-64 border-r border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 h-screen overflow-y-auto">
      <div className="p-6">
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
          News Admin
        </h1>
      </div>

      <nav className="space-y-1 px-3">
        <NavItem to="/dashboard">Dashboard</NavItem>
        <NavItem to="/articles">Articles</NavItem>
        <NavItem to="/categories">Categories</NavItem>
        <NavItem to="/users">Users</NavItem>
        <NavItem to="/profile">Profile</NavItem>
      </nav>
    </aside>
  );
}

function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "block rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
          isActive
            ? "bg-primary-50 text-primary-700 shadow-sm ring-1 ring-primary-200"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        )
      }
    >
      {children}
    </NavLink>
  );
}
