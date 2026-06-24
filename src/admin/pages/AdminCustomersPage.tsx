import { useEffect, useState } from 'react';
import { User, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAdminCustomers } from '../../lib/admin';
import type { Profile } from '../../types';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getAdminCustomers();
        setCustomers(data.filter((c) => !c.is_admin));
      } catch {
        toast.error('Failed to load customers');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-dark-brown">Customers</h1>
        <p className="text-medium-brown mt-1">Registered customer accounts</p>
      </div>

      {loading ? (
        <p className="text-medium-brown">Loading customers...</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-medium-brown border-b bg-gray-50">
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Phone</th>
                <th className="px-6 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gold" />
                      </div>
                      <span className="font-medium text-dark-brown">
                        {customer.full_name || 'No name'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-medium-brown">{customer.email}</td>
                  <td className="px-6 py-4 text-medium-brown">{customer.phone || '—'}</td>
                  <td className="px-6 py-4 text-sm text-medium-brown">
                    {customer.created_at
                      ? new Date(customer.created_at).toLocaleDateString('en-IN')
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {customers.length === 0 && (
            <p className="text-center py-12 text-medium-brown">No customers registered yet</p>
          )}
        </div>
      )}

      <div className="mt-8 bg-gold/10 border border-gold/30 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <Shield className="w-6 h-6 text-gold mt-0.5" />
          <div>
            <h3 className="font-semibold text-dark-brown mb-1">Grant Admin Access</h3>
            <p className="text-sm text-medium-brown">
              To make a user an admin, run this SQL in your Supabase dashboard:
            </p>
            <code className="block mt-2 p-3 bg-white rounded-lg text-xs text-dark-brown overflow-x-auto">
              UPDATE profiles SET is_admin = true WHERE email = 'admin@example.com';
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
