
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChange, signOutAdmin } from "@/integrations/firebase/auth";
import { User } from "firebase/auth";

export const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminId, setAdminId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      if (user) {
        setIsAuthenticated(true);
        setAdminId(user.uid);
        setUser(user);
      } else {
        setIsAuthenticated(false);
        setAdminId(null);
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOutAdmin();
      setIsAuthenticated(false);
      setAdminId(null);
      setUser(null);
      navigate('/myportadmin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const checkAuth = () => {
    // Firebase handles auth state automatically
    return isAuthenticated;
  };

  return {
    isAuthenticated,
    isLoading,
    adminId,
    user,
    logout,
    checkAuth
  };
};
