import React from "react";
import { Button } from "@/components/ui/button";

interface SettingsNoDataFoundProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  onButtonClick: () => void;
}

const SettingsNoDataFound: React.FC<SettingsNoDataFoundProps> = ({
  icon,
  title,
  description,
  buttonText,
  onButtonClick,
}) => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-500 text-center mb-8 max-w-md">{description}</p>
    {buttonText && (
      <Button
        onClick={onButtonClick}
        className="bg-formality-primary hover:bg-formality-primary/90"
      >
        {buttonText}
      </Button>
    )}
  </div>
);

export default SettingsNoDataFound;
