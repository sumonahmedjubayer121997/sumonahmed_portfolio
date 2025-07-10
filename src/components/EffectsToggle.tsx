
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
      <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50">
        {/* Expanded Panel */}
        {isExpanded && (
          <div className="absolute bottom-16 md:bottom-20 right-0 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-4 mb-2 min-w-[200px] animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2 duration-200">
            <div className="flex flex-col gap-3">
              {/* Hide Interactive Background */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleEffectsToggle}
                    className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gray-50/80 hover:bg-gray-100 flex items-center justify-center transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    aria-label="Hide Interactive Background"
                  >
                    <EyeOff className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="left" className="bg-gray-900 text-white text-sm font-medium px-3 py-2">
                  Hide Interactive Background
                </TooltipContent>
              </Tooltip>

              {/* Change Theme */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleThemeToggle}
                    className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gray-50/80 hover:bg-gray-100 flex items-center justify-center transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    aria-label="Change Theme"
                  >
                    {isDarkTheme ? (
                      <Moon className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
                    ) : (
                      <Sun className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="left" className="bg-gray-900 text-white text-sm font-medium px-3 py-2">
                  Change Theme
                </TooltipContent>
              </Tooltip>

              {/* Ask Me */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleAskMe}
                    className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gray-50/80 hover:bg-gray-100 flex items-center justify-center transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    aria-label="Ask Me"
                  >
                    <Search className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="left" className="bg-gray-900 text-white text-sm font-medium px-3 py-2">
                  Ask Me
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        )}

        {/* Main Toggle Button */}
        <button
          onClick={toggleExpansion}
          className="w-14 h-14 md:w-16 md:h-16 bg-white/90 hover:bg-white backdrop-blur-sm border border-gray-200/50 rounded-full shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary/20"
          aria-label={isExpanded ? "Close options panel" : "Open options panel"}
        >
          {isExpanded ? (
            <X className="w-6 h-6 md:w-7 md:h-7 text-gray-700 transition-transform duration-200" />
          ) : (
            <Info className="w-6 h-6 md:w-7 md:h-7 text-gray-700 transition-transform duration-200" />
          )}
        </button>
      </div>
    </TooltipProvider>
  );
};

export default EffectsToggle;
