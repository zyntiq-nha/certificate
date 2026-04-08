import { createContext, useContext, useMemo, useState } from "react";
import { adminApi } from "../api/adminApi";
import { adminStorage, tokenStorage } from "../utils/storage";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => tokenStorage.get());
  const [admin, setAdmin] = useState(() => adminStorage.get());
  const [loading, setLoading] = useState(false);

  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const { data } = await adminApi.login({ email, password });
      tokenStorage.set(data.token);
      adminStorage.set(data.admin);
      setToken(data.token);
      setAdmin(data.admin);
      return { ok: true };
    } catch (error) {
      const message = error?.response?.data?.message || "Login failed";
      return { ok: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    tokenStorage.clear();
    adminStorage.clear();
    setToken(null);
    setAdmin(null);
  };

  const value = useMemo(
    () => ({
      token,
      admin,
      loading,
      isAuthenticated: Boolean(token),
      login,
      logout
    }),
    [token, admin, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
