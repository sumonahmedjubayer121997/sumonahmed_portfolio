
import React, { useState, useEffect } from 'react';
import { Sun, Moon, Monitor, ShieldPlusIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useTheme } from '@/contexts/ThemeContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const Footer = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { isAuthenticated, isLoading } = useAdminAuth();
  const { theme, setTheme } = useTheme();

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

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="w-4 h-4" />;
      case 'dark':
        return <Moon className="w-4 h-4" />;
      case 'system':
        return <Monitor className="w-4 h-4" />;
    }
  };

  return (
    <footer className="bg-background border-t border-border py-4 px-6">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
        
        {/* Left - Reach out or Dashboard button */}
        <div className="flex items-center">
          {!isLoading && isAuthenticated ? (
             <Link
              to="/myportadmin/dashboard"
              className="p-2 rounded-full hover:bg-accent transition-colors duration-200 inline-flex items-center"
              aria-label="Go to Dashboard"
            >
              <ShieldPlusIcon className="w-4 h-4 text-muted-foreground" />
            </Link>
          ) : (
            <a 
              href="/contact"
              className="text-foreground hover:text-primary sm:text-xs font-medium transition-colors duration-200 inline-flex items-center group"
            >
              Reach out
              <span className="ml-1 transition-transform duration-200 group-hover:translate-x-1">→</span>
            </a>
          )}
        </div>

        {/* Center - Made by text */}
        <div className="text-center flex-1">
          <p className="text-muted-foreground text-xs">
            Made by Sumon | © {currentYear}
          </p>
        </div>

        {/* Right - Time display and theme toggle */}
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-xs text-muted-foreground">
              Local: {formatTime(currentTime, Intl.DateTimeFormat().resolvedOptions().timeZone)}
            </div>
            <div className="text-xs text-muted-foreground">UK: {formatTime(currentTime, 'Europe/London')}</div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="p-2 rounded-full hover:bg-accent transition-colors duration-200"
                aria-label="Toggle theme"
              >
                {getThemeIcon()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover border border-border">
              <DropdownMenuItem onClick={() => setTheme('light')} className="cursor-pointer">
                <Sun className="w-4 h-4 mr-2" />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')} className="cursor-pointer">
                <Moon className="w-4 h-4 mr-2" />
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')} className="cursor-pointer">
                <Monitor className="w-4 h-4 mr-2" />
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
