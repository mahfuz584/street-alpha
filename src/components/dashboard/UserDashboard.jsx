"use client";
import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import TabContent from "./TabContent";
import CompanyFollowWrapper from "./CompanyFollowWrapper";

const UserDashboard = ({ tickers }) => {
  const { data: session } = useSession();
  const user = session?.user;

  const [showTab, setShowTab] = useState(false);
  const [matchedSymbolsLength, setMatchedSymbolsLength] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  // console.log("session", session);
  const handleUnlock = (count) => {
    setMatchedSymbolsLength(count);
  };

  const handleShowTab = () => {
    setShowTab(true);
    localStorage.setItem("tabUnlocked", "true");
  };

  useEffect(() => {
    const unlocked = localStorage.getItem("tabUnlocked");

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Update showTab when conditions change
  useEffect(() => {
    if (isLoading) return;

    const unlocked = localStorage.getItem("tabUnlocked");

    if (unlocked === "true" && matchedSymbolsLength >= 5) {
      setShowTab(true);
    } else {
      setShowTab(false);
    }
  }, [matchedSymbolsLength, isLoading]);

  // Show loader initially
  if (isLoading) {
    return (
      <>
        <h1 className="text-[#070707] text-[22px] xl:text-[26px] font-medium leading-[1.4] tracking-normal xl:tracking-[-1.04px] mb-[10px] xl:mb-[14px]">
          Welcome {user?.name ? user.name : "Vini"}
        </h1>

        {/* Loading spinner */}
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#070707]"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className="text-[#070707] text-[22px] xl:text-[26px] font-medium leading-[1.4] tracking-normal xl:tracking-[-1.04px] mb-[10px] xl:mb-[14px]">
        Welcome {user?.name ? user.name : "Vini"}
      </h1>

      {showTab ? (
        <TabContent />
      ) : (
        <>
          <CompanyFollowWrapper tickers={tickers} onUnlock={handleUnlock} />
          <div className="mt-[35px] flex justify-end fixed right-[5%] bottom-[2%]">
            <button
              onClick={handleShowTab}
              disabled={matchedSymbolsLength < 5}
              className={`w-full max-w-[180px] btn rounded-[4px] grid grid-cols-[auto_8px] gap-[5px] items-center px-[20px] py-[0]
                ${
                  matchedSymbolsLength < 5
                    ? "!bg-gray-400 !text-gray-500 cursor-not-allowed"
                    : "bg-[#070707] text-[#F1F4F2] hover:bg-[#2a2a2a] transition-colors"
                }`}
            >
              <span className="text-[14px] text-[#F1F4F2] tracking-normal xl:tracking-[-0.42px]">
                Get Started
              </span>
              <span className="w-full inline-flex items-center"></span>
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default UserDashboard;
