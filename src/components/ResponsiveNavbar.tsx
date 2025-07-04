
import { NavLink } from "react-router-dom";
import { Home, Briefcase, Smartphone, FolderOpen, BookOpen, User, Mail, Wrench, Keyboard } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ShortcutsModal from "./ShortcutsModal";

const ResponsiveNavbar = () => {
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Experience", path: "/experience", icon: Briefcase },
    { name: "Apps", path: "/apps", icon: Smartphone },  
    { name: "Projects", path: "/projects", icon: FolderOpen },
    { name: "Blogs", path: "/blogs", icon: BookOpen },
    { name: "About", path: "/about", icon: User },
    { name: "Contact", path: "/contact", icon: Mail },
    { name: "Tools", path: "/tools", icon: Wrench },
  ];

  // Check if device is mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Initialize focus mode from localStorage
  useEffect(() => {
    const savedFocusMode = localStorage.getItem('focusMode');
    if (savedFocusMode === 'true') {
      setIsFocusMode(true);
      document.body.classList.add('focus-mode');
    }
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      
      if (key === 'q') {
        event.preventDefault();
        setIsShortcutsOpen(prev => !prev);
      } else if (isShortcutsOpen && key === 'escape') {
        event.preventDefault();
        setIsShortcutsOpen(false);
      } else if (isShortcutsOpen && key === 'f') {
        event.preventDefault();
        toggleFocusMode();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isShortcutsOpen]);

  const toggleFocusMode = () => {
    const newFocusMode = !isFocusMode;
    setIsFocusMode(newFocusMode);
    
    if (newFocusMode) {
      document.body.classList.add('focus-mode');
      localStorage.setItem('focusMode', 'true');
    } else {
      document.body.classList.remove('focus-mode');
      localStorage.setItem('focusMode', 'false');
    }
  };

  const handleLogoClick = () => {
    if (isMobile) {
      setIsExpanded(prev => !prev);
    }
  };

  // Determine navbar width and show labels
  const shouldShowLabels = () => {
    if (isMobile) {
      return isExpanded;
    } else {
      return !isFocusMode;
    }
  };

  const getNavbarWidth = () => {
    if (isMobile) {
      return isExpanded ? "w-56" : "w-16";
    } else {
      return isFocusMode ? "w-16" : "w-56";
    }
  };

  return (
    <>
      {/* Vertical Navbar */}
      <div className={`fixed left-0 top-0 h-full ${getNavbarWidth()} z-40 navbar-transition`}>
        <div className="h-full w-full bg-sidebar-background border-r border-sidebar-border shadow-sm">
          <div className="p-4 flex flex-col h-full">
            {/* Logo/Profile Section */}
            <div 
              className="text-center mb-6 cursor-pointer transition-all duration-200 hover:bg-sidebar-accent rounded-lg p-2"
              onClick={handleLogoClick}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 mx-auto mb-2 flex items-center justify-center">
                <span className="text-foreground font-semibold text-sm">A</span>
              </div>
              {shouldShowLabels() && (
                <>
                  <h2 className="text-sm font-semibold text-foreground mb-1">Aman</h2>
                  <p className="text-xs text-muted-foreground">Pro | AI Product Engineer</p>
                </>
              )}
            </div>

            {/* Shortcuts Button */}
            <div className="mb-4">
              <Button
                variant="outline"
                onClick={() => setIsShortcutsOpen(true)}
                className={`w-full justify-start gap-2 hover:bg-sidebar-accent border-sidebar-border bg-sidebar-background text-foreground text-sm py-2 ${
                  !shouldShowLabels() ? 'px-2' : ''
                }`}
              >
                <Keyboard className="w-4 h-4 shrink-0" />
                {shouldShowLabels() && (
                  <>
                    <span className="text-sm">Shortcuts</span>
                    <kbd className="ml-auto px-1.5 py-0.5 text-xs bg-muted/50 rounded border border-border/50">Q</kbd>
                  </>
                )}
              </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1">
              <ul className="space-y-1">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <NavLink
                      to={item.path}
                      end={item.path === "/"}
                      className={({ isActive }) =>
                        `flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group text-sm ${
                          isActive
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        } ${!shouldShowLabels() ? 'justify-center' : ''}`
                      }
                    >
                      <item.icon className={`w-4 h-4 shrink-0 ${shouldShowLabels() ? 'mr-3' : ''}`} />
                      {shouldShowLabels() && <span className="font-medium">{item.name}</span>}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Connect Section */}
            {shouldShowLabels() && (
              <div className="mt-6 pt-4 border-t border-sidebar-border">
                <h3 className="text-sm font-semibold text-foreground mb-2">Connect</h3>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-3 py-2 text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg transition-colors duration-200"
                >
                  <svg
                    className="w-4 h-4 mr-2 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <span className="text-xs">X (Twitter)</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Shortcuts Modal */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
        isFocusMode={isFocusMode}
        onToggleFocusMode={toggleFocusMode}
      />
    </>
  );
};

export default ResponsiveNavbar;
