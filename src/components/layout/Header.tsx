import { useAuthStore } from "@/contexts/AuthContext";

export function Header() {
  const { user, logout } = useAuthStore();

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold">Admin Dashboard</h1>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          {user?.full_name} ({user?.role})
        </span>
        <button
          onClick={logout}
          className="px-3 py-1 rounded bg-red-500 text-white"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
