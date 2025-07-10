
import React, { useState } from 'react';
import { Info, EyeOff, Sun, Moon, Search, X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface EffectsToggleProps {
  onToggle: (enabled: boolean) => void;
}

const EffectsToggle: React.FC<EffectsToggleProps> = ({ onToggle }) => {
  const [effectsEnabled, setEffectsEnabled] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const handleEffectsToggle = () => {
    const newState = !effectsEnabled;
    setEffectsEnabled(newState);
    onToggle(newState);
  };

  const handleThemeToggle = () => {
    setIsDarkTheme(!isDarkTheme);
    // Theme toggle logic can be implemented here
  };

  const handleAskMe = () => {
    // Ask me functionality can be implemented here
    console.log('Ask me clicked');
  };

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <TooltipProvider>
      <div className="fixed bottom-4 right-4 z-50">
        {/* Expanded Panel */}
        {isExpanded && (
          <div className="absolute bottom-16 right-0 bg-white rounded-2xl shadow-xl border border-gray-200 p-4 mb-2 animate-fade-in">
            <div className="flex flex-col gap-3">
              {/* Hide Interactive Background */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleEffectsToggle}
                    className="w-12 h-12 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors"
                    aria-label="Hide Interactive Background"
                  >
                    <EyeOff className="w-5 h-5 text-gray-600" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="left" className="bg-gray-900 text-white text-sm">
                  Hide Interactive Background
                </TooltipContent>
              </Tooltip>

              {/* Change Theme */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleThemeToggle}
                    className="w-12 h-12 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors"
                    aria-label="Change Theme"
                  >
                    {isDarkTheme ? (
                      <Moon className="w-5 h-5 text-gray-600" />
                    ) : (
                      <Sun className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="left" className="bg-gray-900 text-white text-sm">
                  Change Theme
                </TooltipContent>
              </Tooltip>

              {/* Ask Me */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleAskMe}
                    className="w-12 h-12 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors"
                    aria-label="Ask Me"
                  >
                    <Search className="w-5 h-5 text-gray-600" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="left" className="bg-gray-900 text-white text-sm">
                  Ask Me
                </TooltipContent>
              </Tooltip>

              {/* Close Button */}
              <button
                onClick={toggleExpansion}
                className="w-12 h-12 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors mt-2 border-t border-gray-200 pt-3"
                aria-label="Close panel"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        )}

        {/* Main Info Button */}
        <button
          onClick={toggleExpansion}
          className="w-14 h-14 bg-white/90 hover:bg-white backdrop-blur-sm border border-gray-200 rounded-full shadow-lg transition-all duration-200 hover:scale-105 flex items-center justify-center"
          aria-label={isExpanded ? "Close options" : "Open options"}
        >
          <Info className="w-6 h-6 text-gray-600" />
        </button>
      </div>
    </TooltipProvider>
  );
};

export default EffectsToggle;
