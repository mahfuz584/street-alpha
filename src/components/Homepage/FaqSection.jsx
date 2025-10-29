"use client";
import { faqs } from "@/pageData/faqData";
import React, { useState } from "react";

const FaqSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  return (
    <section className="pt-[55px] md:pt-[80px] xl:pt-[100px] pb-[100px]">
      <div className="sa-container">
        <div className="flex flex-col justify-center items-center xl:mb-[80px] md:mb-[65px] mb-[40px]">
          <h2 className="xl:text-4xl md:text-3xl text-[26px] font-semibold text-center xl:mb-[30px] md:mb-[22px] mb-[18px] text-[#070707] leading-[normal] tracking-normal xl:tracking-[-2.16px]">
            Frequently Asked Questions
          </h2>
          <div className="w-full max-w-[637px] text-[16px] tracking-normal xl:tracking-[-0.48px] leading-relaxed text-[#555] text-center">
            New to Street Alpha or looking to supercharge your current stack?
            We'll help you learn more about the platform and its features.
          </div>
        </div>
        <div className="w-full xl:max-w-[820px] md:max-w-[620px] max-w-full mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className={`pb-4 w-full`}>
              <button
                className="w-full rounded-[6px] bg-[#F1F2F4] flex justify-between items-center md:px-5 md:py-[18px] py-[14px] px-4 text-left text-[#070707] focus:outline-none text-[14px] sm:text-[16px] tracking-normal xl:tracking-[-0.48px] leading-relaxed"
                onClick={() => toggleFAQ(index)}
              >
                {faq.question}
                <span
                  className={`transform transition-transform duration-300 ${
                    activeIndex === index ? "rotate-180" : ""
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle cx="12" cy="12" r="12" fill="#F1F4F2" />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M7.19102 9.20277C7.4457 8.93241 7.85864 8.93241 8.11333 9.20277L12 13.3286L15.8867 9.20277C16.1414 8.93241 16.5543 8.93241 16.809 9.20277C17.0637 9.47313 17.0637 9.91148 16.809 10.1818L12.4611 14.7972C12.3389 14.9271 12.173 15 12 15C11.8271 15 11.6611 14.9271 11.5389 14.7972L7.19102 10.1818C6.93633 9.91148 6.93633 9.47313 7.19102 9.20277Z"
                      fill="#070707"
                    />
                  </svg>
                </span>
              </button>
              {activeIndex === index && (
                <div className="py-3  md:px-5 px-4 text-[14px] sm:text-[16px] text-[#555] tracking-normal xl:tracking-[-0.48px] leading-relaxed ">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
          <div className="w-full mt-[10px] flex justify-between items-center xl:py-[24px] sm:py-[20px] py-[16px]  xl:px-[33px] sm:px-[25px] px-[20px] bg-[#F1F4F2] rounded-[6px]">
            <div>
              <div className="md:text-xl text-[18px] font-medium text-[#070707] tracking-normal xl:tracking-[-0.8px] leading- sm:mb-[10px] mb-[8px]">
                Need answers for more questions ?
              </div>
              <div className="sm:text-[16px] text-[14px] text-[#070707] tracking-normal xl:tracking-[-0.16px] leading-relaxed">
                More questions? Book a demo or chat with us for answers.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
