import FluidCursor from "@/components/FluidCursor";
import Layout from "../components/Layout";
import ProfileSection from "../components/ProfileSection";
import { useState, useEffect } from "react";

const Index = () => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });
  const [highlightedItem, setHighlightedItem] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Layout>
      <div
        className={theme === "dark" ? "dark pt-16 lg:pt-0" : "pt-16 lg:pt-0"}
      >
        <ProfileSection />
      </div>
    </Layout>
  );
};

export default Index;
