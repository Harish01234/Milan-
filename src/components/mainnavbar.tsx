"use client";
import React from "react";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { IconHome, IconMessage, IconSettings, IconUser } from "@tabler/icons-react";
export function FloatingNavDemo() {
  const navItems = [
    {
      name: "Home",
      link: "/home",
      icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Profile",
      link: "/dashboard",
      icon: <IconUser className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    
    {
      name: "setting",
      link: "/setting",
      icon: (
        <IconSettings className="h-4 w-4 text-neutral-500 dark:text-white" />
      ),
    },
  ];
  return (
    <div className="relative  w-full">
      <FloatingNav navItems={navItems}  />
     
    </div>
  );
}
