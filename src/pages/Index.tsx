import FluidCursor from "@/components/FluidCursor";
import Layout from "../components/Layout";
import ProfileSection from "../components/ProfileSection";
import { useState, useEffect } from "react";

const Index = () => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });
  const [highlightedItem, setHighlightedItem] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();

    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const gridAlpha = isMobile ? 0.02 : 0.05;

  return (
    <Layout>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          backgroundColor: "#f8fafc",
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,${gridAlpha}) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,${gridAlpha}) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 60%, transparent 100%)",
          pointerEvents: "none",
        }}
      />
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
