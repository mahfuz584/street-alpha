"use client";
import "../globals.css";
import DashboardMenu from "@/components/Shared/DashboardMenu";
import SideNav from "@/components/Shared/SideNav";
import React, { useEffect, useState } from "react";
import { useFollowingData } from "../hooks/useFollowing";
import { usePathname } from "next/navigation";

const DashboardLayout = ({ children }) => {
  const { matchedSymbols } = useFollowingData();
  const [collapsed, setCollapsed] = useState(false);
  const pathName = usePathname();
  const isSpecialPage = pathName.includes("/dashboard/add-company-list");
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };
  useEffect(() => {
    if (matchedSymbols.length < 5 || isSpecialPage) {
      setCollapsed(true);
    }
    setCollapsed(false);
  }, [isSpecialPage]);
  return (
    <div>
      <SideNav toggleSidebar={toggleSidebar} collapsed={collapsed} />
      <DashboardMenu collapsed={collapsed} isSpecialPage={isSpecialPage} />
      <div
        className={`dashboard-layout min-h-screen px-[30px] xl:px-[40px]  2xl:px-[90px] py-[25px] xl:pt-[30px] xL:pb-[40px] 2xl:pt-[50px] 2xl:pb-[60px] bg-[#FBFCF9] transition-all duration-500 ease-in-out ${
          collapsed || isSpecialPage
            ? "dashboard-collapsed"
            : "dashboard-container"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
