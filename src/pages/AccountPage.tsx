import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Package, MapPin, LogOut, Edit, Save } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

interface Profile {
  full_name: string;
  phone: string;
}

export default function AccountPage() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile>({ full_name: '', phone: '' });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('profiles')
      .select('full_name, phone')
      .eq('id', user.id)
      .single();

    if (data) {
      setProfile(data);
    } else {
      // Create profile if it doesn't exist
      const fullName = user.user_metadata?.full_name || '';
      await supabase.from('profiles').insert({
        id: user.id,
        email: user.email,
        full_name: fullName,
      });
      setProfile({ full_name: fullName, phone: '' });
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          phone: profile.phone,
        })
        .eq('id', user.id);

      if (error) throw error;
      toast.success('Profile updated!');
      setEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
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
          <h1 className="font-serif text-3xl font-bold text-dark-brown mb-4">
            My Account
          </h1>
          <p className="text-medium-brown mb-8">
            Please sign in to access your account.
          </p>
          <Link to="/login">
            <Button variant="gold">Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-cream min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-serif text-3xl font-bold text-dark-brown mb-8">
            My Account
          </h1>

          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <User className="w-6 h-6 text-gold" />
                <h2 className="font-semibold text-dark-brown text-lg">Profile</h2>
              </div>
              <button
                onClick={() => editing ? setEditing(false) : setEditing(true)}
                className="p-2 text-gold hover:bg-gold/10 rounded-lg transition-colors"
              >
                {editing ? <Save className="w-5 h-5" /> : <Edit className="w-5 h-5" />}
              </button>
            </div>

            {editing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-brown mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profile.full_name}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    className="w-full p-3 border border-medium-brown/30 rounded-lg focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-brown mb-1">Email</label>
                  <input
                    type="email"
                    value={user.email || ''}
                    disabled
                    className="w-full p-3 border border-medium-brown/30 rounded-lg bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-brown mb-1">Phone</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full p-3 border border-medium-brown/30 rounded-lg focus:outline-none focus:border-gold"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <Button variant="gold" onClick={handleSaveProfile} isLoading={saving}>
                  Save Changes
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-dark-brown"><strong>Name:</strong> {profile.full_name || 'Not set'}</p>
                <p className="text-dark-brown"><strong>Email:</strong> {user.email}</p>
                <p className="text-dark-brown"><strong>Phone:</strong> {profile.phone || 'Not set'}</p>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <Link to="#" className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <Package className="w-8 h-8 text-gold mb-4" />
              <h3 className="font-semibold text-dark-brown mb-2">Order History</h3>
              <p className="text-sm text-medium-brown">View your past orders</p>
            </Link>

            <Link to="#" className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <MapPin className="w-8 h-8 text-gold mb-4" />
              <h3 className="font-semibold text-dark-brown mb-2">Addresses</h3>
              <p className="text-sm text-medium-brown">Manage delivery addresses</p>
            </Link>
          </div>

          <div className="text-center">
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
