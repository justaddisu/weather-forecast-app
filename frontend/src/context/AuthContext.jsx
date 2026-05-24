import { createContext, useEffect, useState } from "react";
import { authService } from "../services/authService";
import { getStoredToken, removeStoredToken, setStoredToken } from "../utils/storage";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredToken());
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(getStoredToken()));

  useEffect(() => {
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    authService
      .getProfile(token)
      .then(({ user: profile }) => {
        if (isMounted) {
          setUser(profile);
        }
      })
      .catch(() => {
        removeStoredToken();
        setToken(null);
        setUser(null);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  async function login(credentials) {
    const response = await authService.login(credentials);
    setStoredToken(response.token);
    setToken(response.token);
    setUser(response.user);
    return response;
  }

  async function register(payload) {
    const response = await authService.register(payload);
    setStoredToken(response.token);
    setToken(response.token);
    setUser(response.user);
    return response;
  }

  function logout() {
    removeStoredToken();
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: Boolean(user && token),
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
