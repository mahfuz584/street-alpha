"use client";
import { useFollowingData } from "@/app/hooks/useFollowing";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

const SideNav = ({ toggleSidebar, collapsed }) => {
  const { matchedSymbols } = useFollowingData();
  const pathName = usePathname();
  const isSpecialPage = pathName.includes("/dashboard/add-company-list");
  if (isSpecialPage) {
    return (
      <div
        className="fixed top-0 bottom-0 left-0 z-[999] bg-[#F1F4F2] border-[0.75px] border-[#DFDFE4] transition-[width] duration-500 ease-in-out    
             w-[80px]"
      >
        <div className="w-full max-w-[46px] pt-[20px]">
          <Link className="w-full max-w-[45px]" href="/dashboard">
            <img
              alt="logo"
              src="/assets/images/logo-light.png"
              className="w-full h-full object-cover object-center"
            />
          </Link>
        </div>
      </div>
    );
  }
  return (
    <>
      <div
        className={`fixed top-0 bottom-0 left-0 z-[999] bg-[#F1F4F2] border-[0.75px] border-[#DFDFE4] transition-[width] duration-500 ease-in-out ${
          collapsed
            ? "w-[80px]"
            : "dashboard-wrapper border-r bottom-[0.75px] border-[#DFDFE4]"
        }`}
      >
        <div className="w-full h-full py-6 ">
          <div className="flex justify-between w-full items-center mb-[35px] lg:mb-[72px] px-[25px]">
            {!collapsed && (
              <Link className="w-full max-w-[45px]" href="/">
                <img
                  alt="logo"
                  src="/assets/images/logo-light.png"
                  className="w-full h-full object-cover object-center"
                />
              </Link>
            )}

            <button
              onClick={toggleSidebar}
              className={`p-0 border-0 inline-flex justify-center ${
                collapsed && "rotate-[180deg]"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="19"
                height="20"
                viewBox="0 0 19 20"
                fill="none"
              >
                <path
                  d="M3.06383 0.893677H16.7234C17.9789 0.893677 19 1.91473 19 3.17027V16.8298C19 18.0854 17.9789 19.1064 16.7234 19.1064H3.06383C1.80829 19.1064 0.787233 18.0854 0.787233 16.8298V3.17027C0.787233 1.91473 1.80829 0.893677 3.06383 0.893677ZM17.4823 16.8298V3.17027C17.4823 2.75176 17.1419 2.41141 16.7234 2.41141H13.6879V17.5887H16.7234C17.1419 17.5887 17.4823 17.2484 17.4823 16.8298ZM2.30496 16.8298C2.30496 17.2484 2.64532 17.5887 3.06383 17.5887H12.1702V2.41141H3.06383C2.64532 2.41141 2.30496 2.75176 2.30496 3.17027V16.8298Z"
                  fill="#555555"
                />
              </svg>
            </button>
          </div>
          <div className="block overflow-y-auto overflow-x-hidden px-[20px]">
            <ul>
              {menuItem.map((menu, index) => {
                const isDisabled = matchedSymbols.length <= 5 && index !== 0;
                const isActive =
                  pathName === menu.path ||
                  (pathName.startsWith(menu.path) &&
                    menu.path !== "/dashboard");

                return (
                  <li key={index} className="mb-[10px]">
                    <Link
                      href={menu.path}
                      className={`grid grid-cols-[14px_auto] items-center gap-[18px] py-[13px] px-[12px] rounded
              ${isActive ? "bg-[#fff]" : "bg-transparent hover:bg-[#fff]"}
            `}
                    >
                      <span className="inline-flex items-center w-full max-w-[14px]">
                        <img src={menu.picture} alt="icon" />
                      </span>
                      <span
                        className={`inline-flex items-center text-[14px] text-[#070707] tracking-normal xl:tracking-[ -0.42px;] ${
                          collapsed
                            ? "hidden opacity-0 invisible"
                            : "inline-flex"
                        }`}
                      >
                        {menu.label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideNav;

const menuItem = [
  {
    label: "Dashboard",
    picture: "/assets/images/dashboard-icons/dasboard.svg",
    path: "/dashboard",
  },
  {
    label: "Analytics",
    picture: "/assets/images/dashboard-icons/analytics.svg",
    path: "/dashboard/analytics",
  },
  {
    label: "Chart",
    picture: "/assets/images/dashboard-icons/chart.svg",
    path: "/dashboard/chart",
  },
  {
    label: "Wishlist",
    picture: "/assets/images/dashboard-icons/wishlist.svg",
    path: "/dashboard/wishlist",
  },
];
