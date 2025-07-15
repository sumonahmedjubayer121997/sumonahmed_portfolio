
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface InteractiveEffectsContextType {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
}

const InteractiveEffectsContext = createContext<InteractiveEffectsContextType | undefined>(undefined);

export const useInteractiveEffects = () => {
  const context = useContext(InteractiveEffectsContext);
  if (context === undefined) {
    throw new Error('useInteractiveEffects must be used within an InteractiveEffectsProvider');
  }
  return context;
};

interface InteractiveEffectsProviderProps {
  children: ReactNode;
}

export const InteractiveEffectsProvider: React.FC<InteractiveEffectsProviderProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <InteractiveEffectsContext.Provider value={{ isVisible, setIsVisible }}>
      {children}
    </InteractiveEffectsContext.Provider>
  );
};
