import React from 'react';
import {
  SiPython,
  SiFlask,
  SiReact,
  SiTailwindcss,
  SiNodedotjs,
  SiJavascript,
  SiTypescript
} from 'react-icons/si';

// Map tech names (lowercased) to icon components
const techIconMap: Record<string, React.ComponentType<{ className?: string; title?: string }>> = {
  python: SiPython,
  flask: SiFlask,
  react: SiReact,
  'tailwind css': SiTailwindcss,
  nodejs: SiNodedotjs,
  javascript: SiJavascript,
  typescript: SiTypescript
  // Add more techs as needed
};

interface TechIconProps {
  techName: string;
  className?: string;
}

const TechIcon: React.FC<TechIconProps> = ({ techName, className = '' }) => {
  const Icon = techIconMap[techName.toLowerCase()];

  if (!Icon) {
    return (
      <div
        className={`w-5 h-5 flex items-center justify-center text-gray-400 border border-gray-300 rounded ${className}`}
        title={techName}
      >
        ?
      </div>
    );
  }

  return <Icon className={`w-5 h-5 ${className}`} title={techName} />;
};

export default TechIcon;
