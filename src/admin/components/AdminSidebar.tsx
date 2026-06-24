import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  LogOut,
  ExternalLink,
  Leaf,
} from 'lucide-react';
import { useAuth } from '../../lib/auth';

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Customers', href: '/admin/customers', icon: Users },
];

export default function AdminSidebar() {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const isActive = (href: string) => {
    if (href === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-dark-brown text-cream min-h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-medium-brown/30">
        <div className="flex items-center space-x-2">
          <Leaf className="w-7 h-7 text-gold" />
          <div>
            <p className="font-serif text-lg font-bold">Kamdhara</p>
            <p className="text-xs text-cream/60">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              isActive(item.href)
                ? 'bg-gold text-dark-brown font-medium'
                : 'text-cream/80 hover:bg-medium-brown/30 hover:text-cream'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-medium-brown/30 space-y-2">
        <Link
          to="/"
          className="flex items-center space-x-3 px-4 py-2 text-cream/70 hover:text-gold transition-colors text-sm"
        >
          <ExternalLink className="w-4 h-4" />
          <span>View Storefront</span>
        </Link>
        <div className="px-4 py-2">
          <p className="text-xs text-cream/50 truncate">{user?.email}</p>
        </div>
        <button
          onClick={signOut}
          className="flex items-center space-x-3 px-4 py-2 w-full text-red-300 hover:text-red-200 transition-colors text-sm"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
