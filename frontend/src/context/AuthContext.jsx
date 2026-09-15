import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { setUnauthorizedHandler } from "../api/axios";

const AuthContext = createContext();

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const ROLE_KEY = "user_role";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
    setToken(null);
    setRole("student");
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    const storedRole = localStorage.getItem(ROLE_KEY);
    if (storedToken) {
      setToken(storedToken);
    }
    if (storedRole === "admin" || storedRole === "student") {
      setRole(storedRole);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(logout);
    return () => setUnauthorizedHandler(null);
  }, [logout]);

  const login = (accessToken, refreshToken, nextRole = "student") => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
    const resolvedRole = nextRole === "admin" ? "admin" : "student";
    localStorage.setItem(ROLE_KEY, resolvedRole);
    setToken(accessToken);
    setRole(resolvedRole);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{ token, role, login, logout, loading, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
