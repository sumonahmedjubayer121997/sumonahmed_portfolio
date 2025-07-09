import React, { useState, useEffect } from 'react';
import { Code, Terminal } from 'lucide-react';

interface PreloaderProps {
  onComplete?: () => void;
  duration?: number;
}

const Preloader: React.FC<PreloaderProps> = ({ onComplete, duration = 3000 }) => {
  const [progress, setProgress] = useState(0);
  const [currentText, setCurrentText] = useState('Initializing...');
  const [isVisible, setIsVisible] = useState(true);

  const loadingTexts = [
    'Initializing...',
    'Loading dependencies...',
    'Compiling code...',
    'Deploying to cloud...',
    'Ready!'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (duration / 50));
        const textIndex = Math.floor((newProgress / 100) * (loadingTexts.length - 1));
        setCurrentText(loadingTexts[Math.min(textIndex, loadingTexts.length - 1)]);
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsVisible(false);
            onComplete?.();
          }, 300);
          return 100;
        }
        return newProgress;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [duration, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50 transition-opacity duration-300 px-4">
      <div className="text-center space-y-4 sm:space-y-6 w-full max-w-xs sm:max-w-sm px-4 mx-auto">

        {/* Logo/Icon */}
        <div className="relative">
          <div className="flex items-center justify-center space-x-2 sm:space-x-3">
            {/* <div className="relative">
              <Code 
                className="w-6 h-6 sm:w-8 sm:h-8 text-primary animate-pulse"
                style={{ animationDuration: '2s' }}
              />
              <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse" />
            </div> */}
            {/* <div className="text-lg sm:text-2xl font-mono text-foreground font-medium tracking-normal sm:tracking-wider">
              {`{  Sumon Ahmed }`}
            </div> */}
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-4">
          <div className="text-muted-foreground font-mono text-[11px] sm:text-sm tracking-normal sm:tracking-wide">
            {currentText}
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
  <div
    className="h-full rounded-full transition-all duration-300 ease-out relative"
    style={{
      width: `${progress}%`,
      backgroundColor: `rgba(107, 114, 128, ${(0.2 + (progress / 100) * 0.8).toFixed(2)})`, // dynamic opacity from 0.2 → 1.0
    }}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
  </div>
</div>

            <div className="flex justify-between items-center text-[9px] sm:text-xs font-mono text-muted-foreground">
              <Terminal className="w-3 h-3" />
              <span>{Math.round(progress)}%</span>
            </div>
          </div>
        </div>

        {/* Loading Dots */}
        <div className="flex justify-center space-x-1">
  {[...Array(3)].map((_, i) => {
    // Dynamically calculate opacity from progress (e.g., 0.2 to 1)
    const opacity = 0.2 + (progress / 100) * 0.8;

    // Replace this with your Tailwind primary color RGB (e.g., blue-500: 59, 130, 246)
   
    const primaryRGB = '107, 114, 128';

    return (
      <div
        key={i}
        className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-bounce"
        style={{
          animationDelay: `${i * 0.15}s`,
          animationDuration: '1.2s',
          backgroundColor: `rgba(${primaryRGB}, ${opacity.toFixed(2)})`,
        }}
      />
    );
  })}
</div>

      </div>
    </div>
  );
};

export default Preloader;
