import { useState } from 'react';
import { Edit, Save } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { supabase } from '../../lib/supabase';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

interface PersonalInfoSectionProps {
  fullName: string;
  phone: string;
  onUpdate: (data: { full_name: string; phone: string }) => void;
}

export default function PersonalInfoSection({
  fullName,
  phone,
  onUpdate,
}: PersonalInfoSectionProps) {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ full_name: fullName, phone });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: form.full_name, phone: form.phone })
        .eq('id', user.id);
      if (error) throw error;
      onUpdate(form);
      toast.success('Profile updated!');
      setEditing(false);
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-serif text-2xl font-bold text-dark-brown">Personal Information</h2>
          <p className="text-sm text-medium-brown mt-1">Manage your name and contact details</p>
        </div>
        <button
          onClick={() => {
            if (editing) {
              setForm({ full_name: fullName, phone });
              setEditing(false);
            } else {
              setForm({ full_name: fullName, phone });
              setEditing(true);
            }
          }}
          className="p-2 text-gold hover:bg-gold/10 rounded-lg transition-colors"
        >
          {editing ? <Save className="w-5 h-5" /> : <Edit className="w-5 h-5" />}
        </button>
      </div>

      {editing ? (
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-dark-brown mb-1">Full Name</label>
            <input
              type="text"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              className="w-full p-3 border border-medium-brown/30 rounded-lg focus:outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-brown mb-1">Email</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full p-3 border border-medium-brown/30 rounded-lg bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-brown mb-1">Phone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full p-3 border border-medium-brown/30 rounded-lg focus:outline-none focus:border-gold"
              placeholder="+91 87667 03485"
            />
          </div>
          <Button variant="gold" onClick={handleSave} isLoading={saving}>
            Save Changes
          </Button>
        </div>
      ) : (
        <dl className="space-y-4 max-w-md">
          <div>
            <dt className="text-xs uppercase tracking-wide text-medium-brown">Full Name</dt>
            <dd className="text-dark-brown font-medium mt-1">{fullName || 'Not set'}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-medium-brown">Email</dt>
            <dd className="text-dark-brown font-medium mt-1">{user?.email}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-medium-brown">Phone</dt>
            <dd className="text-dark-brown font-medium mt-1">{phone || 'Not set'}</dd>
          </div>
        </dl>
      )}
    </div>
  );
}
