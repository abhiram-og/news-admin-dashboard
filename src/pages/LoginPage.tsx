import { useState } from 'react';
import { useAuthStore } from '@/contexts/AuthContext';
import { Button, Input, Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui';
import { Lock } from 'lucide-react';

export function LoginPage() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch(
        'http://127.0.0.1:8000/api/v1/auth/login/',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!res.ok) throw new Error('Invalid credentials');

      const data = await res.json();

      setAuth(
        data.data.user,
        data.data.access,
        data.data.refresh
      );
    } catch {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-900 via-slate-900 to-black p-4">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>

      <Card className="w-full max-w-md relative z-10 border-slate-700/50 bg-white/95 backdrop-blur-xl shadow-2xl ring-1 ring-white/20">
        <CardHeader className="space-y-1 text-center pb-8 pt-10">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600 shadow-inner">
            <Lock className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
            Welcome back
          </CardTitle>
          <CardDescription className="text-slate-500">
            Enter your credentials to access the admin panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-4">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={isLoading}
                required
              />
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={isLoading}
                required
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100 animate-fade-in">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isLoading}
            >
              Sign in
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="absolute bottom-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} News Admin Dashboard. All rights reserved.
      </div>
    </div>
  );
}
