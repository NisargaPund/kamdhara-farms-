import { useEffect, useState } from 'react';
import { MapPin, Plus, Pencil, Trash2, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../lib/auth';
import {
  getUserAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  emptyAddressForm,
} from '../../lib/addresses';
import type { SavedAddress } from '../../types';
import Button from '../ui/Button';

export default function SavedAddressesSection() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyAddressForm());
  const [saving, setSaving] = useState(false);

  const reloadAddresses = async () => {
    if (!user) return;
    setAddresses(await getUserAddresses(user.id));
  };

  useEffect(() => {
    if (!user) return;
    void (async () => {
      try {
        setAddresses(await getUserAddresses(user.id));
      } catch {
        toast.error('Failed to load addresses');
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyAddressForm());
    setShowForm(true);
  };

  const openEdit = (addr: SavedAddress) => {
    setEditingId(addr.id);
    setForm({
      label: addr.label,
      full_name: addr.full_name,
      phone: addr.phone,
      address_line1: addr.address_line1,
      address_line2: addr.address_line2,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      is_default: addr.is_default,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!user) return;
    if (!form.full_name || !form.phone || !form.address_line1 || !form.city || !form.state || !form.pincode) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await updateAddress(editingId, form);
        toast.success('Address updated');
      } else {
        await createAddress(user.id, form);
        toast.success('Address saved');
      }
      setShowForm(false);
      await reloadAddresses();
    } catch {
      toast.error('Failed to save address');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this address?')) return;
    try {
      await deleteAddress(id);
      toast.success('Address removed');
      await reloadAddresses();
    } catch {
      toast.error('Failed to delete address');
    }
  };

  const handleSetDefault = async (addr: SavedAddress) => {
    try {
      await updateAddress(addr.id, { is_default: true });
      toast.success('Default address updated');
      await reloadAddresses();
    } catch {
      toast.error('Failed to update default address');
    }
  };

  const inputClass =
    'w-full p-3 border border-medium-brown/30 rounded-lg focus:outline-none focus:border-gold text-sm';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-serif text-2xl font-bold text-dark-brown">Saved Addresses</h2>
          <p className="text-sm text-medium-brown mt-1">Manage your delivery addresses for faster checkout</p>
        </div>
        {!showForm && (
          <Button variant="gold" size="sm" onClick={openCreate}>
            <Plus className="w-4 h-4 mr-1" />
            Add Address
          </Button>
        )}
      </div>

      {showForm && (
        <div className="bg-cream/50 rounded-xl p-6 mb-6 border border-medium-brown/10">
          <h3 className="font-semibold text-dark-brown mb-4">
            {editingId ? 'Edit Address' : 'New Address'}
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-dark-brown mb-1">Label</label>
              <select
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
                className={inputClass}
              >
                <option value="Home">Home</option>
                <option value="Work">Work</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-brown mb-1">Full Name *</label>
              <input
                type="text"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-brown mb-1">Phone *</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={inputClass}
                placeholder="+91 87667 03485"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-brown mb-1">Pincode *</label>
              <input
                type="text"
                value={form.pincode}
                onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                className={inputClass}
                maxLength={6}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-dark-brown mb-1">Address Line 1 *</label>
              <input
                type="text"
                value={form.address_line1}
                onChange={(e) => setForm({ ...form, address_line1: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-dark-brown mb-1">Address Line 2</label>
              <input
                type="text"
                value={form.address_line2}
                onChange={(e) => setForm({ ...form, address_line2: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-brown mb-1">City *</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-brown mb-1">State *</label>
              <input
                type="text"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>
          <label className="flex items-center gap-2 mt-4 text-sm text-dark-brown">
            <input
              type="checkbox"
              checked={form.is_default}
              onChange={(e) => setForm({ ...form, is_default: e.target.checked })}
              className="rounded border-medium-brown/30 text-gold focus:ring-gold"
            />
            Set as default address
          </label>
          <div className="flex gap-3 mt-6">
            <Button variant="gold" onClick={handleSave} isLoading={saving}>
              Save Address
            </Button>
            <Button variant="secondary" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-medium-brown">Loading addresses...</p>
      ) : addresses.length === 0 ? (
        <div className="text-center py-12 bg-cream/50 rounded-xl">
          <MapPin className="w-12 h-12 mx-auto text-medium-brown mb-3" />
          <p className="text-medium-brown">No saved addresses yet</p>
          {!showForm && (
            <Button variant="gold" size="sm" onClick={openCreate} className="mt-4">
              Add Your First Address
            </Button>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`bg-cream/50 rounded-xl p-5 border ${
                addr.is_default ? 'border-gold/50 ring-1 ring-gold/20' : 'border-medium-brown/10'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-gold">
                    {addr.label}
                  </span>
                  {addr.is_default && (
                    <span className="text-xs bg-gold/20 text-dark-brown px-2 py-0.5 rounded-full">
                      Default
                    </span>
                  )}
                </div>
                <div className="flex gap-1">
                  {!addr.is_default && (
                    <button
                      onClick={() => handleSetDefault(addr)}
                      className="p-1.5 text-medium-brown hover:text-gold transition-colors"
                      title="Set as default"
                    >
                      <Star className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => openEdit(addr)}
                    className="p-1.5 text-medium-brown hover:text-gold transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="p-1.5 text-medium-brown hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-dark-brown font-medium">{addr.full_name}</p>
              <p className="text-sm text-medium-brown mt-1 leading-relaxed">
                {addr.address_line1}
                {addr.address_line2 && <>, {addr.address_line2}</>}
                <br />
                {addr.city}, {addr.state} - {addr.pincode}
                <br />
                {addr.phone}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
