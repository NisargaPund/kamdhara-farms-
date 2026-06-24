import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Shield } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { checkIsAdmin } from '../../lib/admin';
import { supabase } from '../../lib/supabase';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || '/admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) throw error;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Login failed');

      const isAdmin = await checkIsAdmin(user.id);
      if (!isAdmin) {
        await supabase.auth.signOut();
        throw new Error('This account does not have admin access');
      }

      toast.success('Welcome to Admin Panel');
      navigate(from, { replace: true });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Login failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-brown flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gold/20 rounded-full mb-4">
            <Leaf className="w-8 h-8 text-gold" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-cream">Admin Login</h1>
          <p className="text-cream/60 mt-2">Kamdhara Farms Management</p>
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-8">
          <div className="flex items-center space-x-2 bg-gold/10 rounded-lg p-3 mb-6">
            <Shield className="w-5 h-5 text-gold" />
            <p className="text-sm text-dark-brown">Admin credentials required</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-brown mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-medium-brown/30 rounded-lg focus:outline-none focus:border-gold"
                placeholder="admin@kamdhara.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-brown mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-medium-brown/30 rounded-lg focus:outline-none focus:border-gold"
                placeholder="Enter password"
                minLength={6}
              />
            </div>
            <Button type="submit" variant="gold" size="lg" className="w-full" isLoading={loading}>
              Sign In to Admin
            </Button>
          </form>

          <p className="text-center text-sm text-medium-brown mt-6">
            <a href="/" className="text-gold hover:underline">
              Back to Store
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
