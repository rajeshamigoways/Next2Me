"use client"
import React, { createContext, useContext, useEffect, useState } from "react";

interface UserContextType {
  username: string | null;
  avatar: string | null;
  updateUsername: (newUsername: string) => void;
  updateAvatar: (newAvatar: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);  // Track if the component has mounted

  useEffect(() => {
    // Check if we're on the client side
    if (typeof window !== "undefined") {
      const storedUsername = localStorage.getItem("username");
      const storedAvatar = localStorage.getItem("avatar");

      if (storedUsername) setUsername(storedUsername);
      if (storedAvatar) setAvatar(storedAvatar);

      setIsMounted(true); // Component has mounted, safe to update state
    }
  }, []); // Empty dependency array to run only once after the component mounts

  const updateUsername = (newUsername: string) => {
    setUsername(newUsername);
    if (typeof window !== "undefined") {
      localStorage.setItem("username", newUsername);
    }
  };

  const updateAvatar = (newAvatar: string) => {
    setAvatar(newAvatar);
    if (typeof window !== "undefined") {
      localStorage.setItem("avatar", newAvatar);
    }
  };

  if (!isMounted) {
    return <div>Loading...</div>; // Return a loading state until the component is mounted
  }

  return (
    <UserContext.Provider value={{ username, avatar, updateUsername, updateAvatar }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
