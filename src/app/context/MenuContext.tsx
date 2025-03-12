"use client";
import React, { createContext, useContext } from "react";
import { Home, User, Settings, Cpu, FileText, AppWindow, BarChart, UserCog } from "lucide-react";

export type MenuItem = {
  icon: React.ComponentType<any>;
  label: string;
  href: string;
  isNew?: boolean;
};

const mainNavItems: MenuItem[] = [
  { icon: Home, label: "Dashboard", href: "/admin" },

  { icon: Settings, label: "SiteSettings", href: "/admin/admin-sitesettings" },
  { icon: UserCog, label: "Sub Admin", href: "/admin/subadmin" },
  { icon: UserCog, label: "Clients", href: "/admin/client" },
  { icon: FileText, label: "CMS managment", href: "/cms" },
  { icon: AppWindow, label: "Blog management", href: "/apps" },
];

const MenuContext = createContext<{ menuItems: MenuItem[] }>({ menuItems: mainNavItems });

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <MenuContext.Provider value={{ menuItems: mainNavItems }}>{children}</MenuContext.Provider>;
};

export const useMenu = () => useContext(MenuContext);