import React from "react";

const CommonInput = ({ inputType, inputPlaceHolder }) => {
  return (
    <>
      <input
        type={inputType}
        placeholder={inputPlaceHolder}
        className="w-full px-[10px] xl:py-[10px] py-[7px] border-[0.5px] border-[#DFDFE4] bg-white rounded-[4px] focus-visible:outline-none  placeholder:text-[12px] placeholder:text-[#A1A1A1] lg:placeholder:tracking-[-0.72px] placeholder:tracking-normal"
      />
    </>
  );
};

export default CommonInput;
