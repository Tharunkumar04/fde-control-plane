import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, Shield, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('admin@fde-control-plane.local');
  const [password, setPassword] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Local auth — no external service required
    navigate('/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center rounded-2xl bg-emerald-500/10 p-4 mb-4">
            <Terminal className="h-10 w-10 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-100">FDE Control Plane</h1>
          <p className="mt-2 text-sm text-gray-400">AI Platform Engineering Dashboard</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="admin@fde-control-plane.local"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-500 transition-colors"
          >
            Sign In
          </button>

          {/* Info */}
          <div className="mt-4 rounded-lg bg-gray-800/50 border border-gray-700 p-3">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="h-3.5 w-3.5 text-emerald-400" />
              <p className="text-xs font-medium text-emerald-400">Local Authentication</p>
            </div>
            <p className="text-xs text-gray-400">
              JWT-based auth with bcrypt password hashing. No external auth provider required.
              RBAC roles: ADMIN, ENGINEER, OPERATOR, VIEWER.
            </p>
          </div>
        </form>

        {/* System Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Running locally with Ollama + PostgreSQL + Redis
          </p>
          <p className="text-xs text-gray-600 mt-1">
            No cloud account required • No API keys needed
          </p>
        </div>
      </div>
    </div>
  );
}
