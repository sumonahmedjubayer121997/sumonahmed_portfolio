
import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

const Footer = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date, timezone: string) => {
    return date.toLocaleTimeString('en-US', {
      timeZone: timezone,
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 py-4 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
        {/* Left - Reach out link */}
        <div className="flex-1 order-1 md:order-1">
          <a 
            href="/contact"
            className="text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200 inline-flex items-center group"
          >
            Reach out
            <span className="ml-1 transition-transform duration-200 group-hover:translate-x-1">→</span>
          </a>
        </div>

        {/* Center - Made by text */}
        <div className="flex-1 text-center order-3 md:order-2">
          <p className="text-gray-600 text-sm">
            Made by Sumon | © {currentYear}
          </p>
        </div>

        {/* Right - Time display and theme toggle */}
        <div className="flex-1 flex items-center justify-center md:justify-end space-x-4 order-2 md:order-3">
          <div className="text-center md:text-right">
            <div className="text-xs text-gray-500 mb-1">Local: {formatTime(currentTime, Intl.DateTimeFormat().resolvedOptions().timeZone)}</div>
            <div className="text-xs text-gray-500">UK: {formatTime(currentTime, 'Europe/London')}</div>
          </div>
          
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-gray-600" />
            ) : (
              <Moon className="w-4 h-4 text-gray-600" />
            )}
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
