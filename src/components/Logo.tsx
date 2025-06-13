
import React from "react";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className, showText = true }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="h-10 w-10 bg-formality-primary rounded-md flex items-center justify-center shadow-sm">
        <span className="text-white font-bold text-lg">X</span>
      </div>
      {showText && (
        <span className="ml-2 text-xl font-medium text-gray-800">Formality</span>
      )}
    </div>
  );
};

export default Logo;
