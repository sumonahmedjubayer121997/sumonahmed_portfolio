
import FluidCursor from "@/components/FluidCursor";
import Layout from "../components/Layout";
import ProfileSection from "../components/ProfileSection";
import { useState, useEffect } from "react";

const Index = () => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });
  const [highlightedItem, setHighlightedItem] = useState<string | null>(null);
  const [isContentLoaded, setIsContentLoaded] = useState(false);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
    
    // Simulate content loading
    const timer = setTimeout(() => {
      setIsContentLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  if (!isContentLoaded) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <Layout>
      <div
        className={theme === "dark" ? "dark pt-16 lg:pt-0" : "pt-16 lg:pt-0"}
        style={{ position: "relative", zIndex: 10 }}
      >
        <ProfileSection />
      </div>
    </Layout>
  );
};

export default Index;
