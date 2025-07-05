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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ShortcutsModal from "./ShortcutsModal";

const roles = [
  "Software Engineer",
  "Full Stack Developer",
  "DevOps Enthusiast",
];

const Sidebar = () => {
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);

  const [index, setIndex] = useState(0);

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

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const savedFocusMode = localStorage.getItem("focusMode");

    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }

    if (savedFocusMode === "true") {
      setIsFocusMode(true);
      document.body.classList.add("focus-mode");
    }
  }, []);

  // Handle keyboard shortcuts with updated logic
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      if (key === "q") {
        event.preventDefault();
        if (isShortcutsOpen) {
          setIsShortcutsOpen(false); // Close if open
        } else {
          setIsShortcutsOpen(true); // Open if closed
        }
      }
      // D works globally now (not just when Quick Access is open)
      else if (key === "d") {
        event.preventDefault();
        toggleDarkMode();
      }
      // F only works when Quick Access is open
      else if (isShortcutsOpen && key === "f") {
        event.preventDefault();
        toggleFocusMode();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isShortcutsOpen]);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);

    if (newDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const toggleFocusMode = () => {
    const newFocusMode = !isFocusMode;
    setIsFocusMode(newFocusMode);

    if (newFocusMode) {
      document.body.classList.add("focus-mode");
      localStorage.setItem("focusMode", "true");
    } else {
      document.body.classList.remove("focus-mode");
      localStorage.setItem("focusMode", "false");
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 h-full w-56 z-40">
        <div className="h-full w-full glass">
          <div className="p-6 flex flex-col h-full">
            {/* Profile Section */}
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 mx-auto mb-3 flex items-center justify-center backdrop-blur-sm">
                {/* <span className="text-foreground font-semibold">S</span> */}
                <img src="../../public/logo.png" />
              </div>
              <h2 className="text-lg font-semibold text-foreground mb-1">
                {" "}
                Sumon
              </h2>
              <p className="text-xs text-muted-foreground">{roles[index]}</p>
            </div>

            {/* Shortcuts Button */}
            <div className="mb-4">
              <Button
                variant="outline"
                onClick={() => setIsShortcutsOpen(true)}
                className="w-full justify-start gap-2 text-left hover:bg-accent/50 border-border/50 backdrop-blur-sm bg-background/50 text-foreground text-sm py-2"
              >
                <Keyboard className="w-4 h-4" />
                <span className="text-sm">Shortcuts</span>
                <kbd className="ml-auto px-1.5 py-0.5 text-xs bg-muted/50 rounded border border-border/50">
                  Q
                </kbd>
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
                        `flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group backdrop-blur-sm text-sm ${
                          isActive
                            ? "bg-primary text-primary-foreground shadow-lg"
                            : "text-foreground hover:bg-accent/50 hover:text-accent-foreground"
                        }`
                      }
                    >
                      <item.icon className="w-4 h-4 mr-3" />
                      <span className="font-medium">{item.name}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Connect Section */}
            <div className="mt-6 pt-4 border-t border-border/50">
              <h3 className="text-sm font-semibold text-foreground mb-2">
                Connect
              </h3>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-3 py-2 text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground rounded-lg transition-colors duration-200 backdrop-blur-sm"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span className="text-xs">X (Twitter)</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50">
        <div className="glass">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center backdrop-blur-sm">
                <span className="text-foreground font-semibold text-sm">S</span>
              </div>
              <span className="ml-3 font-semibold text-foreground">Sumon</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsShortcutsOpen(true)}
                className="hover:bg-accent/50 text-foreground"
              >
                <Keyboard className="w-4 h-4" />
              </Button>
              <nav className="flex space-x-1">
                {navItems.slice(0, 4).map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    end={item.path === "/"}
                    className={({ isActive }) =>
                      `p-2 rounded-lg transition-colors duration-200 backdrop-blur-sm ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                      }`
                    }
                  >
                    <item.icon className="w-4 h-4" />
                  </NavLink>
                ))}
              </nav>
            </div>
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

export default Sidebar;
