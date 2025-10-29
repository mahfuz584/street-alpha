import React from "react";

const ListItemComponent = ({ iconColor, text }) => {
  return (
    <li className="grid grid-cols-[8px_1fr] gap-[14px] items-center">
      <span className="inline-flex items-center justify-center">
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
          <circle cx="4" cy="4" r="4" fill={iconColor} />
        </svg>
      </span>
      <span className="text-[#555] text-[14px] leading-[1.5]">{text}</span>
    </li>
  );
};

export default ListItemComponent;
