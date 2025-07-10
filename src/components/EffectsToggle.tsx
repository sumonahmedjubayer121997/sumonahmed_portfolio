import React, { useState, useEffect } from 'react';
import { Info, EyeOff, Eye, Sun, Moon, Search, X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface EffectsToggleProps {
  onToggle: (enabled: boolean) => void;
}

const EffectsToggle: React.FC<EffectsToggleProps> = ({ onToggle }) => {
  const [effectsEnabled, setEffectsEnabled] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  const handleEffectsToggle = () => {
    const newState = !effectsEnabled;
    setEffectsEnabled(newState);
    onToggle(newState);
  };

  const handleThemeToggle = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const handleAskMe = () => {
    console.log('Ask me clicked');
  };

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <TooltipProvider>
      <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50">
        {isExpanded && (
          <div className="absolute bottom-16 md:bottom-20 right-0 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-1.5 mb-2">
            <div className="flex flex-col items-center gap-1.5">

              {/* Hide Interactive Background */}
              <div className="flex flex-col items-center">
                {isMobile ? (
                  <>
                    <button
                      onClick={handleEffectsToggle}
                      className="w-10 h-10 rounded-full bg-gray-50/80 hover:bg-gray-100 flex items-center justify-center transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      aria-label="Hide Interactive Background"
                    >
                      {effectsEnabled ? (
                        <Eye className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
                      ) : (
                        <EyeOff className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
                      )}
                    </button>
                    <span className="text-xs text-gray-600 mt-1">Hide BG</span>
                  </>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={handleEffectsToggle}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-50/80 hover:bg-gray-100 flex items-center justify-center transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        {effectsEnabled ? (
                          <Eye className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
                        ) : (
                          <EyeOff className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="bg-gray-900 text-white text-sm font-medium px-3 py-2">
                      Hide Interactive Background
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>

              {/* Change Theme */}
              <div className="flex flex-col items-center">
                {isMobile ? (
                  <>
                    <button
                      onClick={handleThemeToggle}
                      className="w-10 h-10 rounded-full bg-gray-50/80 hover:bg-gray-100 flex items-center justify-center transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      aria-label="Change Theme"
                    >
                      {isDarkTheme ? (
                        <Moon className="w-4 h-4 text-gray-700" />
                      ) : (
                        <Sun className="w-4 h-4 text-gray-700" />
                      )}
                    </button>
                    <span className="text-xs text-gray-600 mt-1">Theme</span>
                  </>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={handleThemeToggle}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-50/80 hover:bg-gray-100 flex items-center justify-center transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        {isDarkTheme ? (
                          <Moon className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
                        ) : (
                          <Sun className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="bg-gray-900 text-white text-sm font-medium px-3 py-2">
                      Change Theme
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>

              {/* Ask Me */}
              <div className="flex flex-col items-center">
                {isMobile ? (
                  <>
                    <button
                      onClick={handleAskMe}
                      className="w-10 h-10 rounded-full bg-gray-50/80 hover:bg-gray-100 flex items-center justify-center transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      aria-label="Ask Me"
                    >
                      <Search className="w-4 h-4 text-gray-700" />
                    </button>
                    <span className="text-xs text-gray-600 mt-1">Ask Me</span>
                  </>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={handleAskMe}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-50/80 hover:bg-gray-100 flex items-center justify-center transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <Search className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="bg-gray-900 text-white text-sm font-medium px-3 py-2">
                      Ask Me
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main Toggle Button */}
        <button
          onClick={toggleExpansion}
          className="w-10 h-10 md:w-12 md:h-12 bg-white/90 hover:bg-white backdrop-blur-sm border border-gray-200/50 rounded-full shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary/20"
          aria-label={isExpanded ? 'Close options panel' : 'Open options panel'}
        >
          {isExpanded ? (
            <X className="w-5 h-5 md:w-6 md:h-6 text-gray-700 transition-transform duration-200" />
          ) : (
            <Info className="w-5 h-5 md:w-6 md:h-6 text-gray-700 transition-transform duration-200" />
          )}
        </button>
      </div>
    </TooltipProvider>
  );
};

export default EffectsToggle;
