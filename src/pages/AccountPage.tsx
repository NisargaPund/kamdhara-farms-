import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import Button from '../components/ui/Button';
import AccountSidebar, { type AccountTab } from '../components/account/AccountSidebar';
import PersonalInfoSection from '../components/account/PersonalInfoSection';
import SavedAddressesSection from '../components/account/SavedAddressesSection';
import OrdersListSection from '../components/account/OrdersListSection';
import WishlistSection from '../components/account/WishlistSection';
import AccountSettingsSection from '../components/account/AccountSettingsSection';
import type { NotificationPreferences } from '../types';

const VALID_TABS: AccountTab[] = [
  'profile',
  'addresses',
  'current-orders',
  'order-history',
  'wishlist',
  'settings',
];

function parseTab(value: string | null): AccountTab {
  if (value && VALID_TABS.includes(value as AccountTab)) {
    return value as AccountTab;
  }
  return 'profile';
}

export default function AccountPage() {
  const { user, signOut } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = parseTab(searchParams.get('tab'));
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email_notifications: true,
    whatsapp_notifications: true,
  });
  const [loading, setLoading] = useState(true);

  const highlightOrder = searchParams.get('order');

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        let data: {
          full_name?: string | null;
          phone?: string | null;
          email_notifications?: boolean | null;
          whatsapp_notifications?: boolean | null;
        } | null = null;

        const profileRes = await supabase
          .from('profiles')
          .select('full_name, phone, email_notifications, whatsapp_notifications')
          .eq('id', user.id)
          .maybeSingle();

        if (profileRes.error?.code === '42703' || profileRes.error?.code === 'PGRST204') {
          const fallback = await supabase
            .from('profiles')
            .select('full_name, phone')
            .eq('id', user.id)
            .maybeSingle();
          if (fallback.error) throw fallback.error;
          data = fallback.data;
        } else if (profileRes.error) {
          throw profileRes.error;
        } else {
          data = profileRes.data;
        }

        if (cancelled) return;

        if (data) {
          setFullName(data.full_name || '');
          setPhone(data.phone || '');
          setPreferences({
            email_notifications: data.email_notifications !== false,
            whatsapp_notifications: data.whatsapp_notifications !== false,
          });
        } else {
          const defaultName = user.user_metadata?.full_name || '';
          await supabase.from('profiles').insert({
            id: user.id,
            email: user.email,
            full_name: defaultName,
          });
          if (!cancelled) {
            setFullName(defaultName);
          }
        }
      } catch {
        if (!cancelled) toast.error('Failed to load profile');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const handleTabChange = (tab: AccountTab) => {
    const next = new URLSearchParams(searchParams);
    next.set('tab', tab);
    if (tab !== 'current-orders') next.delete('order');
    setSearchParams(next, { replace: true });
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
  };

  if (!user) {
    return (
      <div className="pt-24 pb-20 bg-cream min-h-screen">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <User className="w-16 h-16 mx-auto text-medium-brown mb-4" />
          <h1 className="font-serif text-3xl font-bold text-dark-brown mb-4">My Account</h1>
          <p className="text-medium-brown mb-8">Please sign in to access your account.</p>
          <Link to="/login">
            <Button variant="gold">Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  const renderSection = () => {
    if (loading) {
      return <p className="text-medium-brown">Loading...</p>;
    }

    switch (activeTab) {
      case 'profile':
        return (
          <PersonalInfoSection
            fullName={fullName}
            phone={phone}
            onUpdate={({ full_name, phone: p }) => {
              setFullName(full_name);
              setPhone(p);
            }}
          />
        );
      case 'addresses':
        return <SavedAddressesSection />;
      case 'current-orders':
        return (
          <OrdersListSection mode="current" highlightOrderNumber={highlightOrder} />
        );
      case 'order-history':
        return <OrdersListSection mode="history" />;
      case 'wishlist':
        return <WishlistSection />;
      case 'settings':
        return (
          <AccountSettingsSection
            preferences={preferences}
            onPreferencesUpdate={setPreferences}
            onSignOut={handleSignOut}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="pt-24 pb-20 bg-cream min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <h1 className="font-serif text-3xl font-bold text-dark-brown">My Account</h1>
            {activeTab !== 'settings' && (
              <Button
                variant="ghost"
                onClick={handleSignOut}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 self-start sm:self-auto"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            )}
          </div>

          <div className="grid lg:grid-cols-[260px_1fr] gap-6">
            <AccountSidebar
              activeTab={activeTab}
              onTabChange={handleTabChange}
              userName={fullName || user.email?.split('@')[0]}
            />

            <div className="bg-white rounded-xl shadow-sm p-6 lg:p-8 min-h-[400px]">
              {renderSection()}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
