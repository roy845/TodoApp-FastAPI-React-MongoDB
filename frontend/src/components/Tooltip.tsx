import React, { useState, ReactNode, MouseEventHandler } from "react";

interface TooltipProps {
  text: string | undefined;
  children: ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter: MouseEventHandler<HTMLDivElement> = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave: MouseEventHandler<HTMLDivElement> = () => {
    setShowTooltip(false);
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {showTooltip && (
        <div className="absolute z-10 bg-gray-800 text-white p-2 rounded-md text-sm mt-2 text-center left-1/2 transform -translate-x-1/2">
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
