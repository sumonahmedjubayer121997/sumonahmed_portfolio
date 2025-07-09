
import React, { useState, useEffect } from 'react';
import { Loader, Code, Zap, Cloud, Server } from 'lucide-react';

interface PreloaderProps {
  onComplete?: () => void;
  duration?: number;
}

const Preloader: React.FC<PreloaderProps> = ({ onComplete, duration = 1500 }) => {
  const [progress, setProgress] = useState(0);
  const [currentText, setCurrentText] = useState('Initializing...');
  const [isVisible, setIsVisible] = useState(true);

  const loadingTexts = [
    'Initializing...',
    'Loading Dependencies...',
    'Compiling Code...',
    'Deploying to Cloud...',
    'Starting Services...',
    'Portfolio Ready!'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (duration / 100));
        
        // Update text based on progress
        const textIndex = Math.floor((newProgress / 100) * (loadingTexts.length - 1));
        setCurrentText(loadingTexts[Math.min(textIndex, loadingTexts.length - 1)]);
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsVisible(false);
            onComplete?.();
          }, 500);
          return 100;
        }
        
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [duration, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-transaparent flex items-center justify-center z-50 transition-opacity duration-500">
      {/* Background animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-green-400/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center space-y-8">
        {/* Animated Code Brackets */}
        <div className="relative">
          <div className="flex items-center justify-center space-x-4 text-6xl font-mono text-green-400">
            <span className="animate-bounce" style={{ animationDelay: '0s' }}>{`{`}</span>
            <div className="relative">
              {/* Rotating deployment icons */}
              <div className="flex space-x-2">
                <Server className="w-8 h-8 animate-spin text-blue-400" style={{ animationDuration: '3s' }} />
                <Cloud className="w-8 h-8 animate-bounce text-cyan-400" style={{ animationDelay: '0.5s' }} />
                <Zap className="w-8 h-8 animate-pulse text-yellow-400" />
              </div>
              
              {/* Code symbol animation */}
              <div className="absolute -top-2 -right-2">
                <Code className="w-4 h-4 text-green-300 animate-ping" />
              </div>
            </div>
            <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>{`}`}</span>
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-4">
          <p className="text-2xl font-mono text-white tracking-wider">
            {currentText}
          </p>
          
          {/* Terminal-style Progress Bar */}
          <div className="w-96 max-w-md mx-auto">
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <div className="flex justify-between items-center space-x-2 mb-2">
                <div className="flex space-x-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-slate-400 text-sm font-mono ml-1">terminal</span>
                </div>
<div className="flex items-center space-x-1">
 <span className="text-slate-400 text-sm font-mono ml-1">{currentText}</span>
</div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-green-400 font-mono text-sm">$</span>
                  <span className="text-white font-mono text-sm">deploy --portfolio</span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 to-blue-400 rounded-full transition-all duration-300 ease-out relative"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                  </div>
                </div>
                
                <div className="flex justify-between text-xs font-mono text-slate-400">
                  <span>{Math.round(progress)}%</span>
                  <span className="animate-pulse">●</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Spinning Loader */}
        <div className="flex justify-center items-center space-x-2">
          <Loader className="w-6 h-6 text-green-400 animate-spin" />
          <div className="flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                style={{ 
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;