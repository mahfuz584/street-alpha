import React from "react";

const TitleComponent = ({ icon, title, color }) => {
  return (
    <div className="grid grid-cols-[14px_1fr] gap-[8px] items-center mb-[12px]">
      <span className="inline-flex items-center justify-center">{icon}</span>
      <span
        className={`text-[14px] font-medium xl:tracking-[-0.42px] tracking-[0] ${color}`}
      >
        {title}
      </span>
    </div>
  );
};

export default TitleComponent;
