import { useEffect, useState } from 'react';
import { useAuth } from './auth';
import { checkIsAdmin } from './admin';

export function useAdmin() {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verify() {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      const admin = await checkIsAdmin(user.id);
      setIsAdmin(admin);
      setLoading(false);
    }

    if (!authLoading) {
      verify();
    }
  }, [user, authLoading]);

  return { isAdmin, loading: authLoading || loading, user };
}
