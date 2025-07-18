import React from 'react';
import * as SimpleIcons from 'simple-icons';

interface TechIconProps {
  techName: string;
  className?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const TechIcon: React.FC<TechIconProps> = ({
  techName,
  className = '',
  onMouseEnter,
  onMouseLeave
}) => {
  const normalizedName = techName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const iconKey = `si${normalizedName.charAt(0).toUpperCase() + normalizedName.slice(1)}`;
  const icon = (SimpleIcons as any)[iconKey];

  if (!icon) {
    console.log(`Icon not found for: ${techName} (looking for: ${iconKey})`);
    return (
      <div
        className={`w-6 h-6 flex items-center justify-center text-gray-400 border border-gray-300 rounded transition-all duration-200 filter grayscale hover:grayscale-0 ${className}`}
        title={techName}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        ?
      </div>
    );
  }

  return (
    <div
      className={`w-6 h-6 transition-all duration-200 filter grayscale hover:grayscale-0 ${className}`}
      title={techName}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      dangerouslySetInnerHTML={{
        __html: icon.svg.replace(
          '<svg',
          `<svg fill="#${icon.hex}" style="color: #${icon.hex}"`
        )
      }}
    />
  );
};

export default TechIcon;
