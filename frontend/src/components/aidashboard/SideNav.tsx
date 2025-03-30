
// export default SideNav;

"use client";
import { FileClock, Home, Settings } from 'lucide-react';
// import Image from 'next/image';
// import { usePathname } from 'next/navigation';
// import { useResolvedPath } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

const SideNav = () => {
  const [isClient, setIsClient] = useState(false);
  const [path, setPath] = useState("");

  const MenuList = [
    {
      name: 'Home',
      icon: Home,
      path: '/dashboard',
    },
    {
      name: 'History',
      icon: FileClock,
      path: '/dashboard/history',
    },
    {
      name: 'Setting',
      icon: Settings,
      path: '/dashboard/setting',
    },
  ];

  // Ensure code runs only on the client side by using useEffect
 

  return (
    <div className="h-screen p-5 shadow-sm border">
      <div className="flex justify-center">
        
      </div>
     
      <div className="mt-3">
        {MenuList.map((menu, index) => (
          <div
            className={`flex gap-2 mt-5 mb-2 p-3 hover:bg-primary hover:text-white rounded-lg cursor-pointer
            ${path === menu.path && 'bg-primary text-white'}`}
            key={index}
          >
            <menu.icon />
            <h2>{menu.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideNav;
