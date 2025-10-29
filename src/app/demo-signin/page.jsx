"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { signIn } from "next-auth/react";
import DemoEmailSignIn from "@/components/DemoEmailSignIn";

const DemoSignin = () => {
  const [isSignIn, setIsSignIn] = useState(true);

  const handleSocialLogin = (provider) => {
    window.location.href = `/backend/auth/redirect/${provider}`;
  };

  return (
    <section
      className="w-full overflow-y-hidden flex items-center justify-center bg-[url('/assets/images/pexels-pixabay-529621.jpg')] bg-cover bg-center"
      style={{ minHeight: "calc(100vh - 78px)" }}
    >
      <div className="sa-container">
        <div className="py-[20px]">
          <div className="2xl:px-[45px] 2xl:py-[35px] xl:px-[40px] xl:py-[25px] py-[18px] px-[25px] w-full max-w-[506px] mx-auto rounded-[24px] bg-[#fff] shadow-[0px_24px_39px_0px_rgba(50,50,50,0.25)]">
            <div className="2xl:mb-[25px] mb-[18px]">
              <h1 className="text-[#000] text-center 2xl:text-[26px] xl:text-[22px] text-[20px] font-medium leading-[1.4] tracking-normal xl:tracking-[-1.56px] 2xl:mb-[15px] mb-[10px]">
                Welcome to Street Alphas
              </h1>
              <p className="text-[#555] mb-0 text-center max-w-[375px] mx-auto text-[12px] leading-normal tracking-normal xl:tracking-[-0.36px]">
                Unlock enterprise-ready AI intelligence and automation without
                building from the ground up.
              </p>
            </div>

            {/* Social login buttons */}
            <div className="flex flex-col w-full xl:gap-[10px] gap-[7px]">
              <button
                type="button"
                onClick={() => handleSocialLogin("google")}
                className="w-full grid grid-cols-[1fr] justify-center gap-[auto] items-center px-[20px] xl:py-[10px] py-[7px] rounded-[35px] bg-[#fff] border-[0.5px] border-[#DFDFE4] text-center"
              >
                <span className="md:text-[16px] text-[14px] leading-normal text-[#070707] tracking-normal xl:tracking-[-0.96px]">
                  Sign in with Google
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoSignin;
