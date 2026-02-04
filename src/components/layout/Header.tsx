import { useAuthStore } from "@/contexts/AuthContext";


export function Header() {
  const { user, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-slate-200 bg-white/80 px-6 backdrop-blur-md transition-all">
      <div className="flex h-full items-center justify-between">
        <h1 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
          Admin Dashboard
        </h1>

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium text-slate-900">
              {user?.full_name}
            </span>
            <span className="text-xs text-slate-500 capitalize">
              {user?.role}
            </span>
          </div>
          <button
            onClick={logout}
            className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200 hover:text-slate-900 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
