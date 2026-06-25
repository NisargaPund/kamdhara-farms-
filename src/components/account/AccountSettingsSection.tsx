import { useState } from 'react';
import { Bell, Shield, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../lib/auth';
import { supabase } from '../../lib/supabase';
import type { NotificationPreferences } from '../../types';
import Button from '../ui/Button';

interface AccountSettingsSectionProps {
  preferences: NotificationPreferences;
  onPreferencesUpdate: (prefs: NotificationPreferences) => void;
  onSignOut: () => void;
}

export default function AccountSettingsSection({
  preferences,
  onPreferencesUpdate,
  onSignOut,
}: AccountSettingsSectionProps) {
  const { user } = useAuth();
  const [prefs, setPrefs] = useState(preferences);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSavePrefs = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          email_notifications: prefs.email_notifications,
          whatsapp_notifications: prefs.whatsapp_notifications,
        })
        .eq('id', user.id);
      if (error) throw error;
      onPreferencesUpdate(prefs);
      toast.success('Notification preferences saved');
    } catch {
      toast.error('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success('Password updated successfully');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update password';
      toast.error(message);
    } finally {
      setChangingPassword(false);
    }
  };

  const inputClass =
    'w-full p-3 border border-medium-brown/30 rounded-lg focus:outline-none focus:border-gold text-sm max-w-md';

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl font-bold text-dark-brown">Account Settings</h2>
        <p className="text-sm text-medium-brown mt-1">Manage notifications and security</p>
      </div>

      <section className="bg-cream/50 rounded-xl p-6 border border-medium-brown/10">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-gold" />
          <h3 className="font-semibold text-dark-brown">Order Notifications</h3>
        </div>
        <p className="text-sm text-medium-brown mb-4">
          Get notified when you place an order or when your order status changes.
        </p>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={prefs.email_notifications}
              onChange={(e) => setPrefs({ ...prefs, email_notifications: e.target.checked })}
              className="rounded border-medium-brown/30 text-gold focus:ring-gold w-4 h-4"
            />
            <span className="text-sm text-dark-brown">Email notifications</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={prefs.whatsapp_notifications}
              onChange={(e) => setPrefs({ ...prefs, whatsapp_notifications: e.target.checked })}
              className="rounded border-medium-brown/30 text-gold focus:ring-gold w-4 h-4"
            />
            <span className="text-sm text-dark-brown">WhatsApp notifications</span>
          </label>
        </div>
        <Button variant="gold" size="sm" onClick={handleSavePrefs} isLoading={saving} className="mt-4">
          Save Preferences
        </Button>
      </section>

      <section className="bg-cream/50 rounded-xl p-6 border border-medium-brown/10">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-gold" />
          <h3 className="font-semibold text-dark-brown">Change Password</h3>
        </div>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-medium text-dark-brown mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputClass}
              placeholder="At least 6 characters"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-dark-brown mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputClass}
            />
          </div>
          <Button variant="secondary" size="sm" onClick={handlePasswordChange} isLoading={changingPassword}>
            Update Password
          </Button>
        </div>
      </section>

      <div className="pt-4 border-t border-medium-brown/10">
        <Button
          variant="ghost"
          onClick={onSignOut}
          className="text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
