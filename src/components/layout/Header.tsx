import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, User, Heart, LogOut } from 'lucide-react';
import { useCartStore } from '../../store/cart';
import { useAuth } from '../../lib/auth';
import { SITE_LOGO } from '../../lib/imagePaths';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const itemCount = useCartStore((state) => state.getItemCount());
  const { user, signOut } = useAuth();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'FAQ', href: '/faq' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-cream/95 backdrop-blur-sm shadow-sm">
      <nav className="max-w-7xl mx-auto w-full min-w-0 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center justify-between h-14 md:h-20">
          <Link to="/" className="flex min-w-0 shrink items-center max-w-[42%] sm:max-w-none">
            <img
              src={SITE_LOGO}
              alt="Kamdhara Farms"
              className="h-9 sm:h-10 md:h-14 w-auto max-w-full object-contain"
            />
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={'font-medium transition-colors ' + (
                  isActive(item.href)
                    ? 'text-gold'
                    : 'text-dark-brown hover:text-gold'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex shrink-0 items-center space-x-1.5 sm:space-x-3 md:space-x-4">
            <Link to="/wishlist" className="p-1.5 md:p-2 text-dark-brown hover:text-gold transition-colors">
              <Heart className="w-4 h-4 md:w-5 md:h-5" />
            </Link>
            <Link to="/cart" className="relative p-1.5 md:p-2 text-dark-brown hover:text-gold transition-colors">
              <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 md:-top-1 md:-right-1 bg-gold text-dark-brown text-[10px] md:text-xs font-bold rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-1 p-1.5 md:p-2 text-dark-brown hover:text-gold transition-colors">
                  <User className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="hidden lg:inline text-sm">{user.email?.split('@')[0]}</span>
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link
                    to="/account"
                    className="block px-4 py-2 text-dark-brown hover:bg-cream rounded-t-lg"
                  >
                    My Account
                  </Link>
                  <button
                    onClick={signOut}
                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-cream rounded-b-lg flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="p-1.5 md:p-2 text-dark-brown hover:text-gold transition-colors">
                <User className="w-4 h-4 md:w-5 md:h-5" />
              </Link>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-1.5 text-dark-brown"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-3 border-t border-medium-brown/20">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={'block py-2 font-medium ' + (
                  isActive(item.href)
                    ? 'text-gold'
                    : 'text-dark-brown hover:text-gold'
                )}
              >
                {item.name}
              </Link>
            ))}
            {user && (
              <>
                <Link
                  to="/account"
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-2 font-medium text-dark-brown hover:text-gold"
                >
                  My Account
                </Link>
                <button
                  onClick={() => { signOut(); setIsMenuOpen(false); }}
                  className="block w-full text-left py-2 font-medium text-red-500"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
