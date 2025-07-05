
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface AdminSession {
  token: string;
  admin_id: string;
  expires_at: string;
}

export const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminId, setAdminId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      const sessionData = localStorage.getItem('admin_session');
      if (!sessionData) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      const session: AdminSession = JSON.parse(sessionData);
      const now = new Date();
      const expiresAt = new Date(session.expires_at);

      if (now >= expiresAt) {
        logout();
        return;
      }

      setIsAuthenticated(true);
      setAdminId(session.admin_id);
    } catch (error) {
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_session');
    setIsAuthenticated(false);
    setAdminId(null);
    navigate('/myportadmin/login');
  };

  return {
    isAuthenticated,
    isLoading,
    adminId,
    logout,
    checkAuth
  };
};
