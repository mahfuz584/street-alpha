import { cardData } from "@/pageData/actionData";
import React from "react";

const ActionCard = () => {
  return (
    <section className="py-[55px] md:py-[80px] xl:py-[100px]">
      <div className="sa-container">
        {/*
         ******top text block *****
         */}
        <div className="flex flex-col justify-center items-center xl:mb-[80px] md:mb-[65px] mb-[40px]">
          <h2 className="xl:text-[38px] md:text-3xl text-[26px] font-semibold text-center xl:mb-[30px] md:mb-[22px] mb-[18px] text-[#070707] leading-[normal] tracking-normal xl:tracking-[-2.16px]">
            AI-Powered Insights, Built for Real-Time Action
          </h2>
          <div className="text-[16px] tracking-normal xl:tracking-[-0.48px] leading-relaxed text-[#555] text-center">
            Cutting-edge quant strategies and real-time market scans made
            intuitive for everyone
          </div>
        </div>
        <div className="grid md:grid-cols-[1fr_1fr] sm:grid-cols-[1fr] auto-rows-fr gap-[20px]">
          {cardData.map((item) => {
            return (
              <div
                key={item.id}
                className={`flex flex-col justify-between items-center w-full h-full xl:px-6 md:px-4 px-5 xl:pt-12 md:pt-10 pt-8  rounded-[20px] pb-5 ${
                  item.id === 1 || item.id === 2
                    ? "bg-[#F1F4F2]"
                    : "bg-[#F1F2F4]"
                } `}
              >
                <div className="md:mb-[30px] xl:mb-[50px] mb-[20px]  m-auto text-center w-full h-full flex flex-col justify-center   xl:max-w-[380px] max-w-[320px]">
                  <img
                    className="w-full h-full object-cover object-center  max-h-[200px]"
                    src={item.picture}
                    alt="picture"
                  />
                </div>

                <div className="flex flex-col h-full sm:mt-0 mt-[10px]">
                  <div className="xl:xl-[24px]  md:text-[21px] text-[20px] font-medium text-[#070707]  mb-[12px] tracking-normal xl:tracking-[-1.04px] leading-snug">
                    {item.title}
                  </div>
                  <div className=" text-[14px] tracking-normal xl:tracking-[ -0.48px;] leading-relaxed	text-[#555]">
                    {item.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ActionCard;
