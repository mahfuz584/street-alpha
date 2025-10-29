import { aboutData } from "@/pageData/aboutData";
import React from "react";

const AboutCard = () => {
  return (
    <section className="py-[55px] md:py-[80px] xl:py-[100px]">
      <div className="sa-container">
        <div className="flex flex-col justify-center items-center xl:mb-[80px] md:mb-[65px] mb-[40px]">
          <h2 className="xl:text-4xl md:text-3xl text-[26px] font-semibold text-center xl:mb-[30px] md:mb-[22px] mb-[18px] text-[#070707] leading-[normal] tracking-normal xl:tracking-[-2.16px]">
            What’s Inside Streets Alpha
          </h2>
          <div className="text-[16px] tracking-normal xl:tracking-[-0.48px] leading-relaxed text-[#555] text-center">
            Cutting-edge quant strategies and real-time market scans made
            intuitive for everyone
          </div>
        </div>
        <div className="about-card-container w-full grid grid-cols-3 justify-center items-center gap-[20px] ">
          {aboutData.map((item) => {
            return (
              <div
                key={item.id}
                className="relative group w-full h-full flex flex-col items-center rounded-[16px] bg-[#fff] border-[0.75px] border-[#DFDFE4] px-[15px] md:px-[20px] pt-[15px] md:pt-[22px] pb-[20px] md:pb-[26px] overflow-hidden"
              >
                <div className="absolute inset-0 transition-[background] duration-100 pointer-events-none group-hover:[background:radial-gradient(700px_at_492px_413.813px,rgba(0,0,0,0.1),rgba(50,50,50,0.03),rgba(255,223,219,0),rgba(255,207,207,0))]"></div>

                {item.isLabel && (
                  <div className="text-[#070707] text-[12px] leading-normal tracking-normal xl:tracking-[-0.36px] rounded-[51px] bg-[#B4FFCB] px-[10px] py-[4px] absolute top-[15px] right-[16px] z-10">
                    Upcoming
                  </div>
                )}

                <div className="w-full max-w-[35px] xl:max-w-[48px] mr-auto xl:mb-[47px] md:mb-[30px] mb-[25px] relative z-10">
                  <img src={item.picture} alt="picture" />
                </div>

                <div className="flex flex-col relative z-10">
                  <div className="xl:text-[20px] text-[18px] font-medium text-[#070707] md:mb-[15px] mb-[12px] tracking-normal xl:tracking-[-0.8px] leading-snug">
                    {item.title}
                  </div>
                  <div className="sm:text-[16px] text-[14px] tracking-normal xl:tracking-[-0.48px] leading-relaxed text-[#555]">
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

export default AboutCard;
