
import React, { useState, useEffect } from 'react';
import { Info, EyeOff, Eye, MessageCircle, X, Sun, Moon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTheme } from '@/contexts/ThemeContext';
import AiChat from './AiChat';

interface EffectsToggleProps {
  onToggle: (enabled: boolean) => void;
}

const EffectsToggle: React.FC<EffectsToggleProps> = ({ onToggle }) => {
  const [effectsEnabled, setEffectsEnabled] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isNearFooter, setIsNearFooter] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [showAiChat, setShowAiChat] = useState(false);
  const { theme, setTheme } = useTheme(); 

  useEffect(() => {
    const updateScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setHasScrolled(scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsNearFooter(entry.isIntersecting && hasScrolled);
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    observer.observe(footer);

    return () => {
      observer.disconnect();
    };
  }, [hasScrolled]);

  const handleEffectsToggle = () => {
    const newState = !effectsEnabled;
    setEffectsEnabled(newState);
    onToggle(newState);
  };

  const handleAskMe = () => {
    setShowAiChat(true);
    setIsExpanded(false);
  };

  const handleThemeToggle = () => {
    const themes = ['light', 'dark'] as const;
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return Sun;
      case 'dark':
        return Moon;
      default:
        return Sun;
    }
  };

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const getButtonPosition = () => {
    if (isNearFooter) {
      if (isSmallScreen) return 'bottom-20';
      return 'bottom-20';
    }
    return 'bottom-4';
  };

  const getExpandedPanelPosition = () => {
    if (isNearFooter) {
      if (isSmallScreen) return 'bottom-20';
      return 'bottom-20';
    }
    return 'bottom-16';
  };

  return (
    <>
      <TooltipProvider>
        <div className={`fixed ${getButtonPosition()} right-4 md:right-6 z-50 transition-all duration-300 ease-in-out`}>
          {isExpanded && (
            <div className={`absolute ${getExpandedPanelPosition()} right-0 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-1.5 mb-2 transition-all duration-300 ease-in-out`}>
              <div className="flex flex-col items-center gap-1.5">

                {/* Theme Toggle */}
                <div className="flex flex-col items-center">
                  {isSmallScreen ? (
                    <>
                      <button
                        onClick={handleThemeToggle}
                        className="w-10 h-10 rounded-full bg-gray-50/80 hover:bg-gray-100 flex items-center justify-center transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/20"
                        aria-label="Toggle Theme"
                      >
                        {React.createElement(getThemeIcon(), { className: "w-4 h-4 text-gray-700" })}
                      </button>
                    </>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={handleThemeToggle}
                          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-50/80 hover:bg-gray-100 flex items-center justify-center transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                          {React.createElement(getThemeIcon(), { className: "w-4 h-4 md:w-5 md:h-5 text-gray-700" })}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="left" className="bg-gray-900 text-white text-sm font-medium px-3 py-2">
                        Toggle Theme ({theme})
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>

                {/* Hide Interactive Background */}
                <div className="flex flex-col items-center">
                  {isSmallScreen ? (
                    <>
                      <button
                        onClick={handleEffectsToggle}
                        className="w-10 h-10 rounded-full bg-gray-50/80 hover:bg-gray-100 flex items-center justify-center transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/20"
                        aria-label="Hide Interactive Background"
                      >
                        {effectsEnabled ? (
                          <Eye className="w-4 h-4 text-gray-700" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-gray-700" />
                        )}
                      </button>
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

                {/* AI Chat */}
                <div className="flex flex-col items-center">
                  {isSmallScreen ? (
                    <>
                      <button
                        onClick={handleAskMe}
                        className="w-10 h-10 rounded-full bg-gray-50/80 hover:bg-gray-100 flex items-center justify-center transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/20"
                        aria-label="Chat with AI"
                      >
                        <MessageCircle className="w-4 h-4 text-gray-700" />
                      </button>
                    </>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={handleAskMe}
                          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-50/80 hover:bg-gray-100 flex items-center justify-center transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                          <MessageCircle className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="left" className="bg-gray-900 text-white text-sm font-medium px-3 py-2">
                        Chat with AI
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
            className="w-10 h-10 md:w-12 md:h-12 bg-white/90 hover:bg-white backdrop-blur-sm border border-gray-200/50 rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary/20"
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

      {/* AI Chat Component */}
      {showAiChat && <AiChat />}
    </>
  );
};

export default EffectsToggle;
