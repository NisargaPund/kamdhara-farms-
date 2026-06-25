import {
  User,
  MapPin,
  Truck,
  Heart,
  Settings,
  History,
} from 'lucide-react';

export type AccountTab =
  | 'profile'
  | 'addresses'
  | 'current-orders'
  | 'order-history'
  | 'wishlist'
  | 'settings';

interface AccountSidebarProps {
  activeTab: AccountTab;
  onTabChange: (tab: AccountTab) => void;
  userName?: string;
}

const tabs: { id: AccountTab; label: string; icon: typeof User }[] = [
  { id: 'profile', label: 'Personal Information', icon: User },
  { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
  { id: 'current-orders', label: 'Current Orders', icon: Truck },
  { id: 'order-history', label: 'Order History', icon: History },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'settings', label: 'Account Settings', icon: Settings },
];

export default function AccountSidebar({
  activeTab,
  onTabChange,
  userName,
}: AccountSidebarProps) {
  return (
    <nav className="bg-white rounded-xl shadow-sm p-4 lg:p-6">
      {userName && (
        <div className="mb-6 pb-4 border-b border-medium-brown/10">
          <p className="text-xs text-medium-brown uppercase tracking-wide">Welcome back</p>
          <p className="font-serif text-lg font-semibold text-dark-brown truncate">{userName}</p>
        </div>
      )}
      <ul className="space-y-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <li key={id}>
            <button
              onClick={() => onTabChange(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sm transition-all ${
                activeTab === id
                  ? 'bg-gold/15 text-dark-brown font-semibold border-l-2 border-gold'
                  : 'text-medium-brown hover:bg-cream hover:text-dark-brown'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${activeTab === id ? 'text-gold' : ''}`} />
              {label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
