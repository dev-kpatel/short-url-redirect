import React, { createContext, useContext, useEffect, useState } from "react";

export type User = {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  provider: "google" | "github";
  accessToken: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  loginSimulated: (provider: "google" | "github", mockEmail?: string) => Promise<void>;
  logout: () => void;
  isMockMode: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // For visual demo, we operate in mockMode by default (no credentials required)
  const isMockMode = !import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    const savedUser = localStorage.getItem("auth_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse saved auth user", e);
      }
    }
    setLoading(false);
  }, []);

  const loginSimulated = async (provider: "google" | "github", mockEmail?: string) => {
    setLoading(true);
    // Simulate API round-trip
    await new Promise((resolve) => setTimeout(resolve, 800));

    const email = mockEmail || (provider === "google" ? "demo.developer@gmail.com" : "git-wizard@github.com");
    const name = provider === "google" ? "Demo Developer" : "Git Wizard";
    const avatar = provider === "google" 
      ? "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80"
      : "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&h=150&q=80";

    const newUser: User = {
      uid: `${provider}_${Math.random().toString(36).substr(2, 9)}`,
      email,
      displayName: name,
      photoURL: avatar,
      provider,
      accessToken: `mock_token_${Math.random().toString(36).substr(2, 24)}`
    };

    setUser(newUser);
    localStorage.setItem("auth_user", JSON.stringify(newUser));
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginSimulated, logout, isMockMode }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
