import React, { useState, useEffect } from 'react';
import { Sun, Moon, ShieldPlusIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth'; // adjust the import path to where your hook is

const Footer = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { isAuthenticated, isLoading } = useAdminAuth();

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
    <footer className="bg-white border-t border-gray-200 py-4 px-6" ref={footerRef}>
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
        
        {/* Left - Reach out or Dashboard button */}
        <div className="flex items-center">
          {!isLoading && isAuthenticated ? (
             <Link
              to="/myportadmin/dashboard"
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 inline-flex items-center"
              aria-label="Go to Dashboard"
            >
              <ShieldPlusIcon className="w-4 h-4 text-gray-600" />
            </Link>
          ) : (
            <a 
              href="/contact"
              className="text-gray-700 hover:text-gray-900 sm:text-xs font-medium transition-colors duration-200 inline-flex items-center group"
            >
              Reach out
              <span className="ml-1 transition-transform duration-200 group-hover:translate-x-1">→</span>
            </a>
          )}
        </div>

        {/* Center - Made by text */}
        <div className="text-center flex-1">
          <p className="text-gray-600 text-xs">
            Made by Sumon | © {currentYear}
          </p>
        </div>

        {/* Right - Time display and theme toggle */}
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-xs text-gray-500">
              Local: {formatTime(currentTime, Intl.DateTimeFormat().resolvedOptions().timeZone)}
            </div>
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
