
"use client";
import { useEffect } from "react";
import { useInteractiveEffects } from "@/contexts/InteractiveEffectsContext";
import { useIsMobile } from "@/hooks/use-mobile";
import fluidCursor from "@/hooks/use-fluidCursor";

const FluidCursor = () => {
  const { isVisible } = useInteractiveEffects();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Don't initialize fluid cursor on mobile devices or small screens
    if (isMobile || window.innerWidth < 768) {
      return;
    }

    // Check if the device has limited processing power
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
      return;
    }

    try {
      fluidCursor();
    } catch (error) {
      console.warn("FluidCursor failed to initialize:", error);
    }
  }, [isMobile]);

  // Don't render the canvas on mobile devices or small screens
  if (isMobile || window.innerWidth < 768) {
    return null;
  }

  return (
    <div className={`fixed top-0 left-0 z-0 transition-opacity duration-300 ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}>
      <canvas 
        id="fluid" 
        className="h-screen w-screen pointer-events-none"
        style={{ 
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          perspective: '1000px'
        }}
      />
    </div>
  );
};

export default FluidCursor;
