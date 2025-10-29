"use client";
import EmailSignIn from "@/components/Shared/EmailSignIn";
import SocialSignIn from "@/components/Shared/SocialSignIn";
import { useState } from "react";
const SignIn = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  return (
    <section
      className=" w-full overflow-y-hidden flex items-center justify-center bg-[url('/assets/images/pexels-pixabay-529621.jpg')] bg-cover bg-center"
      style={{ minHeight: "calc(100vh - 78px)" }}
    >
      <div className="sa-container">
        <div className="py-[20px]">
          <div className="2xl:px-[45px] 2xl:py-[35px] xl:px-[40px] xl:py-[25px] py-[18px] px-[25px]   w-full max-w-[506px] mx-auto rounded-[24px] bg-[#fff] shadow-[0px_24px_39px_0px_rgba(50,50,50,0.25)]">
            <div className="2xl:mb-[25px] mb-[18px]">
              <h1 className="text-[#000] text-center 2xl:text-[26px] xl:text-[22px]  text-[20px] font-medium leading-[1.4] tracking-normal xl:tracking-[-1.56px] 2xl:mb-[15px] mb-[10px]">
                Welcome to Street Alphas
              </h1>
              <p className="text-[#555] mb-0 text-center max-w-[375px] mx-auto text-[12px] leading-normal tracking-normal xl:tracking-[-0.36px] ">
                Unlock enterprise ready AI intelligence and automation without
                building from the ground up.
              </p>
            </div>
            <SocialSignIn isSignIn={isSignIn} />
            <div className="relative flex items-center justify-center 2xl:my-[20px] my-[14px] text-[#555] text-[12px] leading-normal tracking-normal xl:tracking-[-0.36px]">
              <span className="before:content-['']  before:h-px before:w-[155px] before:bg-[#DFDFE4] after:content-['']  after:h-px after:w-[155px] after:bg-[#DFDFE4] flex items-center gap-[25px]">
                or
              </span>
            </div>
            <EmailSignIn isSignIn={isSignIn} setIsSignIn={setIsSignIn} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignIn;
