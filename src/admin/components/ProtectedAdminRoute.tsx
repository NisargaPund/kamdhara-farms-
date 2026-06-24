import { Navigate } from 'react-router-dom';
import { useAdmin } from '../../lib/useAdmin';

export default function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin, loading, user } = useAdmin();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-medium-brown">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <h1 className="font-serif text-2xl font-bold text-dark-brown mb-2">Access Denied</h1>
          <p className="text-medium-brown mb-6">
            You do not have admin privileges. Contact the store owner to get access.
          </p>
          <a href="/" className="text-gold hover:underline">
            Back to Store
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
