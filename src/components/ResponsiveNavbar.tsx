import { NavLink } from "react-router-dom";
import {
  Home,
  Briefcase,
  Smartphone,
  FolderOpen,
  BookOpen,
  User,
  Mail,
  Wrench,
  Keyboard,
  Menu,
  X,
  Sun,
  Moon,
  MoreVertical,
  MoreHorizontal,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import ShortcutsModal from "./ShortcutsModal";

const roles = [
  "Software Engineer",
  "Full Stack Developer", 
  "DevOps Enthusiast",
];

const ResponsiveNavbar = () => {
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const [isFocusMode, setIsFocusMode] = useState(() => {
    return localStorage.getItem("focusMode") === "true";
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVerticalNavExpanded, setIsVerticalNavExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [navbarType, setNavbarType] = useState<'horizontal' | 'vertical'>('horizontal');
  const [index, setIndex] = useState(0);
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const verticalNavRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % roles.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

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
      setIsMobile(window.innerWidth <= 1024); // Changed to lg breakpoint for better tablet handling
      if (window.innerWidth > 1024) {
        setIsExpanded(false);
        setIsVerticalNavExpanded(false);
        setNavbarType('horizontal');
      }
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    document.body.classList.toggle("focus-mode", isFocusMode);
  }, [isDarkMode, isFocusMode]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      if (key === "q") {
        event.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
      } else if (key === "escape" && (isShortcutsOpen || isExpanded || isVerticalNavExpanded)) {
        event.preventDefault();
        setIsShortcutsOpen(false);
        setIsExpanded(false);
        setIsVerticalNavExpanded(false);
      } else if (key === "d") {
        event.preventDefault();
        toggleDarkMode();
      } else if (isShortcutsOpen && key === "f") {
        event.preventDefault();
        toggleFocusMode();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isShortcutsOpen, isExpanded, isVerticalNavExpanded]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile) {
        if (
          isExpanded &&
          mobileNavRef.current &&
          !mobileNavRef.current.contains(event.target as Node)
        ) {
          setIsExpanded(false);
        }
        if (
          isVerticalNavExpanded &&
          verticalNavRef.current &&
          !verticalNavRef.current.contains(event.target as Node)
        ) {
          setIsVerticalNavExpanded(false);
        }
      }
    };

    if (isExpanded || isVerticalNavExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded, isVerticalNavExpanded, isMobile]);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem("theme", newDarkMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newDarkMode);
  };

  const toggleFocusMode = () => {
    const newFocusMode = !isFocusMode;
    setIsFocusMode(newFocusMode);
    localStorage.setItem("focusMode", newFocusMode.toString());
    document.body.classList.toggle("focus-mode", newFocusMode);
  };

  const handleLogoClick = () => {
    if (isMobile && navbarType === 'vertical') {
      setIsVerticalNavExpanded((prev) => !prev);
    }
  };

  const handleNavItemClick = () => {
    if (isMobile) {
      setIsExpanded(false);
      setIsVerticalNavExpanded(false);
    }
  };

  const toggleNavbarType = () => {
    setNavbarType(prev => prev === 'horizontal' ? 'vertical' : 'horizontal');
    setIsExpanded(false);
    setIsVerticalNavExpanded(false);
  };

  const shouldShowLabels = () => {
    if (isMobile) {
      return isVerticalNavExpanded;
    } else {
      return !isFocusMode;
    }
  };

  const getNavbarWidth = () => {
    if (isMobile) {
      return isVerticalNavExpanded ? "w-56" : "w-16";
    } else {
      return isFocusMode ? "w-16" : "w-56";
    }
  };

  if (isMobile) {
    return (
      <>
        {/* Mobile Horizontal Top Bar */}
        {navbarType === 'horizontal' && (
          <div className="fixed top-0 left-0 right-0 h-16 z-50 bg-sidebar-background/80 backdrop-blur-md border-b border-sidebar-border shadow-sm">
            <div className="flex items-center justify-between h-full px-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {}}
                  className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors duration-200"
                >
                  <img src="/logo.png" className="w-6 h-6 object-contain" alt="Logo" />
                </button>
                {!isExpanded && (
                  <div>
                    <h2 className="text-sm font-semibold text-foreground">Sumon</h2>
                    <p className="text-xs text-muted-foreground">{roles[index]}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleDarkMode}
                  className="hover:bg-sidebar-accent text-foreground"
                >
                  {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleNavbarType}
                  className="hover:bg-sidebar-accent text-foreground"
                  title="Switch to vertical navbar"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="hover:bg-sidebar-accent text-foreground"
                >
                  {isExpanded ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Vertical Sidebar - Fixed overlay positioning */}
        {navbarType === 'vertical' && (
          <div
            ref={verticalNavRef}
            className={`fixed left-0 top-0 bottom-0 ${getNavbarWidth()} z-50 bg-sidebar-background/95 backdrop-blur-md border-r border-sidebar-border shadow-lg transform transition-all duration-300 ease-in-out`}
          >
            <div className="p-2 flex flex-col h-full">
              <div className="text-center mb-4 p-2">
                <button
                  onClick={handleLogoClick}
                  className="w-10 h-10 rounded-full bg-primary/10 mx-auto flex items-center justify-center hover:bg-primary/20 transition-colors duration-200"
                >
                  <img src="/logo.png" className="w-6 h-6 object-contain" alt="Logo" />
                </button>
                {shouldShowLabels() && (
                  <div className="mt-2">
                    <h2 className="text-sm font-semibold text-foreground mb-1">Sumon</h2>
                    <p className="text-xs text-muted-foreground">{roles[index]}</p>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <Button
                  variant="outline"
                  onClick={toggleNavbarType}
                  className={`w-full justify-center gap-2 hover:bg-sidebar-accent border-sidebar-border bg-sidebar-background text-foreground ${
                    !shouldShowLabels() ? "px-2" : ""
                  }`}
                  title="Switch to horizontal navbar"
                >
                  <MoreHorizontal className="w-4 h-4 shrink-0" />
                  {shouldShowLabels() && <span className="text-sm">Horizontal</span>}
                </Button>
              </div>

              <nav className="flex-1">
                <ul className="space-y-1">
                  {navItems.map((item) => (
                    <li key={item.name}>
                      <NavLink
                        to={item.path}
                        end={item.path === "/"}
                        onClick={handleNavItemClick}
                        className={({ isActive }) =>
                          `flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 ${
                            isActive
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "text-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                          } ${!shouldShowLabels() ? "justify-center" : ""}`
                        }
                      >
                        <item.icon className={`w-4 h-4 shrink-0 ${shouldShowLabels() ? "mr-3" : ""}`} />
                        {shouldShowLabels() && <span className="font-medium">{item.name}</span>}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>

              {shouldShowLabels() && (
                <div className="pt-4 mt-4 border-t border-sidebar-border">
                  <Button
                    variant="outline"
                    onClick={() => setIsVerticalNavExpanded(false)}
                    className="w-full justify-center gap-2 hover:bg-sidebar-accent border-sidebar-border bg-sidebar-background text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mobile Horizontal Expanded Menu - Fixed width and positioning */}
        {navbarType === 'horizontal' && (
          <div
            ref={mobileNavRef}
            className={`fixed top-16 right-0 z-40 bg-sidebar-background/95 backdrop-blur-md border-l border-sidebar-border shadow-lg transform transition-all duration-300 ease-in-out w-[70%] ${
              isExpanded
                ? "translate-x-0 opacity-100"
                : "translate-x-full opacity-0 pointer-events-none"
            }`}
            style={{ height: 'calc(100vh - 4rem)' }}
          >
            <div className="p-4 space-y-2 h-full overflow-y-auto">
              <div className="text-center mb-4 p-3 bg-sidebar-accent/50 rounded-lg">
                <h2 className="text-sm font-semibold text-foreground mb-1">Sumon</h2>
                <p className="text-xs text-muted-foreground">{roles[index]}</p>
              </div>

              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.path === "/"}
                  onClick={handleNavItemClick}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    }`
                  }
                >
                  <item.icon className="w-5 h-5 mr-3 shrink-0" />
                  <span className="font-medium">{item.name}</span>
                </NavLink>
              ))}

              <div className="pt-4 mt-4 border-t border-sidebar-border space-y-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsShortcutsOpen(true);
                    setIsExpanded(false);
                  }}
                  className="w-full justify-start gap-3 hover:bg-sidebar-accent border-sidebar-border bg-sidebar-background text-foreground"
                >
                  <Keyboard className="w-4 h-4" />
                  <span>Shortcuts</span>
                  <kbd className="ml-auto px-1.5 py-0.5 text-xs bg-muted/50 rounded border border-border/50">
                    Q
                  </kbd>
                </Button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Desktop Vertical Navbar - unchanged
  return (
    <>
      <div className={`fixed left-0 top-0 h-full ${getNavbarWidth()} z-40 navbar-transition bg-sidebar-background/95 backdrop-blur-md border-r border-sidebar-border shadow-sm`}>
        <div className="h-full w-full">
          <div className="p-2 flex flex-col h-full">
            {/* Logo/Profile Section */}
            <div className="text-center mb-6 transition-all duration-200 hover:bg-sidebar-accent rounded-lg p-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 mx-auto mb-2 flex items-center justify-center">
                <img src="/logo.png" className="w-6 h-6 object-contain" alt="Logo" />
              </div>

              {shouldShowLabels() && (
                <>
                  <h2 className="text-sm font-semibold text-foreground mb-1">Sumon</h2>
                  <p className="text-xs text-muted-foreground">{roles[index]}</p>
                </>
              )}
            </div>

            {/* Theme Toggle & Shortcuts */}
            <div className="mb-4 space-y-2">
              <Button
                variant="outline"
                onClick={toggleDarkMode}
                className={`w-full justify-start gap-2 hover:bg-sidebar-accent border-sidebar-border bg-sidebar-background text-foreground text-sm py-2 ${
                  !shouldShowLabels() ? "px-2 justify-center" : ""
                }`}
              >
                {isDarkMode ? <Sun className="w-4 h-4 shrink-0" /> : <Moon className="w-4 h-4 shrink-0" />}
                {shouldShowLabels() && (
                  <>
                    <span className="text-sm">{isDarkMode ? "Light" : "Dark"} mode</span>
                    <kbd className="ml-auto px-1.5 py-0.5 text-xs bg-muted/50 rounded border border-border/50">
                      D
                    </kbd>
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={() => setIsShortcutsOpen(true)}
                className={`w-full justify-start gap-2 hover:bg-sidebar-accent border-sidebar-border bg-sidebar-background text-foreground text-sm py-2 ${
                  !shouldShowLabels() ? "px-2 justify-center" : ""
                }`}
              >
                <Keyboard className="w-4 h-4 shrink-0" />
                {shouldShowLabels() && (
                  <>
                    <span className="text-sm">Shortcuts</span>
                    <kbd className="ml-auto px-1.5 py-0.5 text-xs bg-muted/50 rounded border border-border/50">
                      Q
                    </kbd>
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
                        } ${!shouldShowLabels() ? "justify-center" : ""}`
                      }
                    >
                      <item.icon className={`w-4 h-4 shrink-0 ${shouldShowLabels() ? "mr-3" : ""}`} />
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
                  <svg className="w-4 h-4 mr-2 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <span className="text-xs">X (Twitter)</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        isFocusMode={isFocusMode}
        onToggleFocusMode={toggleFocusMode}
      />
    </>
  );
};

export default ResponsiveNavbar;
