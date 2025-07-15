
import FluidCursor from "@/components/FluidCursor";
import Layout from "../components/Layout";
import ProfileSection from "../components/ProfileSection";
import { useState } from "react";

const Index = () => {
  const [highlightedItem, setHighlightedItem] = useState<string | null>(null);

  return (
    <Layout>
      <div className="pt-16 lg:pt-0" style={{ position: "relative", zIndex: 10 }}>
        <ProfileSection />
      </div>
    </Layout>
  );
};

export default Index;
