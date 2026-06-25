import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../lib/auth';
import { formatAuthError } from '../lib/supabase';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const { signUp, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
        toast.success('Welcome back!');
        navigate(from, { replace: true });
      } else {
        const { error, session } = await signUp(email, password, name);
        if (error) throw error;
        if (session) {
          toast.success('Welcome to Kamdhara Farms!');
          navigate(from, { replace: true });
        } else {
          toast.success('Account created! Check your email to verify, then sign in.');
          setIsLogin(true);
        }
      }
    } catch (error: unknown) {
      toast.error(formatAuthError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-20 bg-cream min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md px-4"
      >
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl font-bold text-dark-brown">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-medium-brown mt-2">
              {isLogin ? 'Sign in to your account' : 'Join Kamdhara Farms family'}
            </p>
          </div>

          <div className="flex bg-cream rounded-lg p-1 mb-6">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={'flex-1 py-2 rounded-md font-medium transition-colors ' + (
                isLogin ? 'bg-white text-dark-brown shadow-sm' : 'text-medium-brown'
              )}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={'flex-1 py-2 rounded-md font-medium transition-colors ' + (
                !isLogin ? 'bg-white text-dark-brown shadow-sm' : 'text-medium-brown'
              )}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-dark-brown mb-1">Full Name</label>
                <input
                  type="text"
                  required={!isLogin}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 border border-medium-brown/30 rounded-lg focus:outline-none focus:border-gold"
                  placeholder="Enter your name"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-dark-brown mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-medium-brown/30 rounded-lg focus:outline-none focus:border-gold"
                placeholder="your@email.com"
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
                placeholder="Enter your password"
                minLength={6}
              />
            </div>

            {isLogin && (
              <div className="text-right">
                <Link to="#" className="text-sm text-gold hover:text-gold-dark">
                  Forgot password?
                </Link>
              </div>
            )}

            <Button type="submit" variant="gold" size="lg" className="w-full" isLoading={loading}>
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
