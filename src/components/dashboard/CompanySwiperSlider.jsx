"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useRef, useState } from "react";

const CompanySwiperSlider = ({ simplifiedData, activeTab, setActiveTab }) => {
  const swiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const handleSlideChange = (swiper) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  const goPrev = () => {
    if (swiperRef.current) swiperRef.current.slidePrev();
  };

  const goNext = () => {
    if (swiperRef.current) swiperRef.current.slideNext();
  };

  return (
    <div className="relative w-full">
      {!isBeginning && simplifiedData.length > 0 && (
        <button
          type="button"
          onClick={goPrev}
          className="absolute left-0 top-1/2 z-10 -translate-y-1/2 p-[5px] bg-[#070707] rounded-full border border-solid border-[#ffffff] "
        >
          <svg
            fill="#fff"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.5 19L8.5 12L15.5 5"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </button>
      )}

      {/* Swiper */}
      <Swiper
        className="max-w-full w-full"
        spaceBetween={14}
        slidesPerView="auto"
        freeMode={true}
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={handleSlideChange}
      >
        {simplifiedData.map((company, index) => (
          <SwiperSlide key={index} style={{ width: "auto" }}>
            <button
              onClick={() => setActiveTab(company.companyName)}
              className={`flex items-center gap-[14px] bg-[#F1F2F4] rounded-[33px] py-[4px] px-[12px] text-[14px] font-medium tracking-normal xl:tracking-[-0.42px] transition-all duration-200
                ${
                  activeTab === company.companyName
                    ? "border border-[#070707]"
                    : ""
                }
              `}
              aria-label={company.companyName}
            >
              <div className="w-[35px] h-[35px] rounded-full overflow-hidden">
                <img
                  src={company.image}
                  alt={company.companyName}
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <span className="text-[#070707]">{company.companyName}</span>
            </button>
          </SwiperSlide>
        ))}
      </Swiper>

      {!isEnd && simplifiedData.length > 0 && (
        <button
          type="button"
          onClick={goNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 p-[5px] z-10 bg-[#070707] rounded-full border border-solid border-[#fff] "
        >
          <svg
            fill="#fff"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.5 5L15.5 12L8.5 19"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </button>
      )}
    </div>
  );
};

export default CompanySwiperSlider;
