
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface EffectsToggleProps {
  onToggle: (enabled: boolean) => void;
}

const EffectsToggle: React.FC<EffectsToggleProps> = ({ onToggle }) => {
  const [isEnabled, setIsEnabled] = useState(true);

  const handleToggle = () => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    onToggle(newState);
  };

  return (
    <button
      onClick={handleToggle}
      className="fixed bottom-4 right-4 z-50 p-3 bg-white/80 hover:bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
      aria-label={isEnabled ? "Hide visual effects" : "Show visual effects"}
    >
      {isEnabled ? (
        <Eye className="w-5 h-5 text-gray-600" />
      ) : (
        <EyeOff className="w-5 h-5 text-gray-600" />
      )}
    </button>
  );
};

export default EffectsToggle;
