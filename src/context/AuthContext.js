"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext(null);

export function AuthProvider({
  children,
}) {
  const [user, setUser] =
    useState(null);

  const [token, setToken] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  /*
   * Restore authentication when
   * application loads.
   */
  useEffect(() => {
    try {
      const storedUser =
        localStorage.getItem("gbpUser");

      const storedToken =
        localStorage.getItem("gbpToken");

      if (storedUser) {
        setUser(
          JSON.parse(storedUser)
        );
      }

      if (storedToken) {
        setToken(storedToken);
      }
    } catch (error) {
      console.error(
        "Failed to restore authentication:",
        error
      );

      localStorage.removeItem(
        "gbpUser"
      );

      localStorage.removeItem(
        "gbpToken"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  /*
   * Login/register authentication.
   */
  const login = (
    userData,
    authToken
  ) => {
    setUser(userData);

    localStorage.setItem(
      "gbpUser",
      JSON.stringify(userData)
    );

    if (authToken) {
      setToken(authToken);

      localStorage.setItem(
        "gbpToken",
        authToken
      );
    }
  };

  /*
   * Logout.
   */
  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem(
      "gbpUser"
    );

    localStorage.removeItem(
      "gbpToken"
    );
  };

  const isAuthenticated =
    Boolean(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}