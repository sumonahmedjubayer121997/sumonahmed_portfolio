
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Server, Cloud, Database, Cpu, Globe } from 'lucide-react';

interface PreloaderProps {
  onComplete?: () => void;
  minDuration?: number;
}

const Preloader: React.FC<PreloaderProps> = ({ onComplete, minDuration = 2000 }) => {
  const [isVisible, setIsVisible] = useState(true);
  const stages = ['git pull', 'npm run build', 'firebase deploy'];
const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
  let currentStage = 0;
  const stageDuration = minDuration / stages.length;

  const stageTimer = setInterval(() => {
    currentStage++;
    if (currentStage < stages.length) {
      setStageIndex(currentStage);
    } else {
      clearInterval(stageTimer);
      setIsVisible(false);
      setTimeout(() => {
        onComplete?.();
      }, 500);
    }
  }, stageDuration);

  return () => clearInterval(stageTimer);
}, [onComplete, minDuration]);


  

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 50%, #f0f0f0 100%)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 0.8,
            transition: { duration: 0.5, ease: "easeInOut" }
          }}
        >
          {/* Animated Grid Background */}
          <motion.div
            className="absolute inset-0 opacity-20"
            animate={{
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              backgroundImage: `
                linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}
          />

          <div className="relative flex flex-col items-center">
            {/* Main 3D Cube Animation */}
            <div className="relative mb-8">
              <motion.div
                className="relative w-20 h-20"
                animate={{
                  rotateX: [0, 360],
                  rotateY: [0, 360],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Cube faces */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg shadow-lg transform translate-z-10" 
                     style={{ transform: 'rotateY(0deg) translateZ(40px)' }} />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg shadow-lg" 
                     style={{ transform: 'rotateY(90deg) translateZ(40px)' }} />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg shadow-lg" 
                     style={{ transform: 'rotateY(180deg) translateZ(40px)' }} />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-700 to-blue-900 rounded-lg shadow-lg" 
                     style={{ transform: 'rotateY(-90deg) translateZ(40px)' }} />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-300 to-blue-500 rounded-lg shadow-lg" 
                     style={{ transform: 'rotateX(90deg) translateZ(40px)' }} />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-800 to-blue-950 rounded-lg shadow-lg" 
                     style={{ transform: 'rotateX(-90deg) translateZ(40px)' }} />
              </motion.div>

              {/* Orbiting Tech Icons */}
              <motion.div
                className="absolute inset-0 w-32 h-32 -translate-x-6 -translate-y-6"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <Server className="absolute top-0 left-1/2 w-4 h-4 text-blue-400 -translate-x-2" />
                <Cloud className="absolute top-1/2 right-0 w-4 h-4 text-gray-300 -translate-y-2" />
                <Database className="absolute bottom-0 left-1/2 w-4 h-4 text-blue-500 -translate-x-2" />
                <Cpu className="absolute top-1/2 left-0 w-4 h-4 text-gray-400 -translate-y-2" />
              </motion.div>
            </div>

            {/* Pulsing Network Nodes */}
            <div className="flex space-x-4 mb-8">
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  className="w-3 h-3 bg-blue-500 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.3
                  }}
                />
              ))}
            </div>

            {/* Connection Lines */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <motion.div
                className="w-px h-16 bg-gradient-to-b from-transparent via-blue-400 to-transparent"
                animate={{
                  opacity: [0, 1, 0],
                  scaleY: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>

            {/* Loading Text */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              
              <motion.p 
                className="text-sm text-gray-500 font-mono"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                 {stages[stageIndex]}
              </motion.p>
            </motion.div>

            {/* Progress Indicator */}
            <motion.div
              className="mt-6 w-48 h-1 bg-gray-800 rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ 
                  duration: minDuration / 1000 - 0.5, 
                  ease: "easeInOut" 
                }}
              />
            </motion.div>

            {/* Floating Particles */}
            {[...Array(6)].map((_, index) => (
              <motion.div
                key={index}
                className="absolute w-1 h-1 bg-blue-400 rounded-full"
                style={{
                  top: `${20 + (index * 15)}%`,
                  left: `${10 + (index * 12)}%`,
                }}
                animate={{
                  y: [-20, 20, -20],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 3 + (index * 0.5),
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
