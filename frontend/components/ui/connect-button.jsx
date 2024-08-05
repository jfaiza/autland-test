import React, { useState } from "react";

const ConnectButton = ({ clickFunction, title }) => {
  const [strokeColor, setStrokeColor] = useState('currentColor');

  return (
    <button
      className="flex items-center px-3 py-1 rounded-md hover:text-[#1fc7d4]"
      onClick={clickFunction}
      onMouseEnter={() => setStrokeColor('#1fc7d4')}
      onMouseLeave={() => setStrokeColor('currentColor')}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="21"
        height="21"
        viewBox="0 0 22 22"
        fill="none"
        stroke={strokeColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-wallet"
      >
        <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
        <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
      </svg>
      <span className="ml-2">{title}</span>
    </button>
  );
};

export default ConnectButton;
