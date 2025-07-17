
"use client";
import { useEffect } from "react";
import { useInteractiveEffects } from "@/contexts/InteractiveEffectsContext";

import fluidCursor from "@/hooks/use-fluidCursor";

const FluidCursor = () => {
  const { isVisible } = useInteractiveEffects();

  useEffect(() => {
    fluidCursor();
  }, []);

  return (
    <div className={`fixed top-0 left-0 z-0 transition-opacity duration-300 ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}>
      <canvas id="fluid" className="h-screen w-screen" />
    </div>
  );
};
export default FluidCursor;
