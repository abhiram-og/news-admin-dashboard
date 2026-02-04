import { NavLink } from "react-router-dom";

export function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r">
      <div className="p-6 text-xl font-bold">News Admin</div>

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

function NavItem({ to, children }: any) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block rounded px-3 py-2 ${
          isActive
            ? "bg-blue-100 text-blue-700"
            : "text-gray-700 hover:bg-gray-100"
        }`
      }
    >
      {children}
    </NavLink>
  );
}
