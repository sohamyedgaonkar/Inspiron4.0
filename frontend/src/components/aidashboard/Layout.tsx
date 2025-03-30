import React from "react";
import SideNav from "@/components/aidashboard/SideNav.tsx";
import Header from "@/components/aidashboard/Header.tsx";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <div className="md:w-64 hidden md:block fixed">
        <SideNav />
      </div>
      <div className="md:ml-64">
       
        {children}
      </div>
    </div>
  );
};

export default Layout;
