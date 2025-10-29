"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import { sliderData } from "@/pageData/companySliderData";

const LogoSliderSection = () => {
  return (
    <section className="xl:pt-[50px] pt-[40px]  xl:pb-[100px] md:pb-[85px] pb-[65px]">
      <Swiper
        spaceBetween={25}
        slidesPerView="auto"
        allowTouchMove={false}
        centeredSlides={true}
        loop={true}
        autoplay={{
          delay: 1,
          disableOnInteraction: false,
        }}
        speed={4000}
        modules={[Autoplay]}
        breakpoints={{
          768: {
            spaceBetween: 60,
          },
        }}
        className="slide-auto"
      >
        {sliderData.map((item) => (
          <SwiperSlide key={item.id}>
            <div className="img-container">
              <img src={item.path} alt="logo" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default LogoSliderSection;
