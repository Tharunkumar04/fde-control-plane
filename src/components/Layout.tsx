import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  GitBranch,
  FileText,
  Wrench,
  BarChart3,
  Activity,
  ClipboardList,
  AlertTriangle,
  Shield,
  ChevronLeft,
  ChevronRight,
  Terminal,
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Tenants', href: '/tenants', icon: Building2 },
  { name: 'Workflows', href: '/workflows', icon: GitBranch },
  { name: 'Knowledge', href: '/knowledge', icon: FileText },
  { name: 'Tools', href: '/tools', icon: Wrench },
  { name: 'Evaluations', href: '/evaluations', icon: BarChart3 },
  { name: 'Observability', href: '/observability', icon: Activity },
  { name: 'Audit Log', href: '/audit', icon: ClipboardList },
  { name: 'Incidents', href: '/incidents', icon: AlertTriangle },
];

export default function Layout({ children }: LayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          collapsed ? 'w-16' : 'w-64'
        } flex flex-col border-r border-gray-800 bg-gray-900 transition-all duration-200`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-gray-800 px-4">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <Terminal className="h-6 w-6 text-emerald-400" />
              <span className="font-bold text-sm tracking-tight">FDE Control Plane</span>
            </div>
          )}
          {collapsed && <Terminal className="h-6 w-6 text-emerald-400 mx-auto" />}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-4">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                    }`}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {!collapsed && <span>{item.name}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Collapse button */}
        <div className="border-t border-gray-800 p-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex w-full items-center justify-center rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-gray-200"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* User info */}
        {!collapsed && (
          <div className="border-t border-gray-800 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <Shield className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-200">Admin</p>
                <p className="text-xs text-gray-500">ADMIN role</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
