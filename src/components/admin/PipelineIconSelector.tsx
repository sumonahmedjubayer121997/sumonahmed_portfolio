
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Check, AlertCircle, X } from "lucide-react";
import * as simpleIcons from "simple-icons";

interface PipelineIconSelectorProps {
  value: string;
  onChange: (iconName: string) => void;
  placeholder?: string;
}

const PipelineIconSelector = ({ value, onChange, placeholder = "Enter icon name (e.g., python, react, docker)..." }: PipelineIconSelectorProps) => {
  const [inputValue, setInputValue] = useState(value || "");
  const [iconPreview, setIconPreview] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Function to normalize icon name for simple-icons lookup
  const normalizeIconName = (name: string): string => {
    return name.toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[^a-z0-9]/g, '');
  };

  // Function to get icon from simple-icons
  const getSimpleIcon = (name: string) => {
    try {
      const normalizedName = normalizeIconName(name);
      
      // Try exact match first
      const iconKey = `si${normalizedName.charAt(0).toUpperCase() + normalizedName.slice(1)}`;
      const icon = (simpleIcons as any)[iconKey];

      if (icon) {
        return {
          name: normalizedName,
          displayName: icon.title || name,
          svg: icon.svg,
          color: `#${icon.hex}`,
          found: true
        };
      }

      // If not found, try partial matches
      const allIconKeys = Object.keys(simpleIcons).filter(key => key.startsWith('si'));
      const partialMatch = allIconKeys.find(key => 
        key.toLowerCase().includes(normalizedName) ||
        normalizedName.includes(key.toLowerCase().replace('si', ''))
      );

      if (partialMatch) {
        const matchedIcon = (simpleIcons as any)[partialMatch];
        return {
          name: normalizedName,
          displayName: matchedIcon.title || name,
          svg: matchedIcon.svg,
          color: `#${matchedIcon.hex}`,
          found: true
        };
      }
    } catch (error) {
      console.log('Icon not found:', name);
    }
    
    return {
      name: normalizeIconName(name),
      displayName: name,
      svg: '',
      color: '#6B7280',
      found: false
    };
  };

  // Real-time icon preview as user types
  useEffect(() => {
    if (inputValue.trim().length > 0) {
      setIsSearching(true);
      
      // Debounce the search
      const timeoutId = setTimeout(() => {
        const preview = getSimpleIcon(inputValue.trim());
        setIconPreview(preview);
        setIsSearching(false);
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      setIconPreview(null);
      setIsSearching(false);
    }
  }, [inputValue]);

  // Update input when external value changes
  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  const applyIcon = () => {
    if (iconPreview && iconPreview.name) {
      onChange(iconPreview.name);
    }
  };

  const clearIcon = () => {
    setInputValue("");
    onChange("");
    setIconPreview(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      applyIcon();
    }
  };

  // Render the current saved icon
  const renderCurrentIcon = () => {
    if (!value) return null;
    
    const iconData = getSimpleIcon(value);
    
    if (iconData.found && iconData.svg) {
      return (
        <div className="flex items-center gap-2 text-sm text-green-600 mb-2">
          <div 
            className="w-5 h-5 flex-shrink-0"
            dangerouslySetInnerHTML={{ 
              __html: iconData.svg.replace('<svg', `<svg fill="${iconData.color}"`)
            }}
          />
          <span>Current: {iconData.displayName}</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-5 w-5 p-0"
            onClick={clearIcon}
          >
            <X size={12} />
          </Button>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 text-sm text-orange-600 mb-2">
        <AlertCircle size={16} />
        <span>Current: {value} (not found)</span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-5 w-5 p-0"
          onClick={clearIcon}
        >
          <X size={12} />
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-3">
      {renderCurrentIcon()}
      
      {/* Search Input */}
      <div className="relative">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="pr-16"
        />
        {inputValue && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 px-2"
            onClick={applyIcon}
            disabled={!iconPreview}
          >
            <Plus className="w-3 h-3" />
          </Button>
        )}
      </div>

      {/* Real-time Preview */}
      {inputValue && (
        <div className="p-3 border rounded-lg bg-gray-50">
          {isSearching ? (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
              Searching for icon...
            </div>
          ) : iconPreview ? (
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                {iconPreview.found ? (
                  <div 
                    className="w-8 h-8 flex-shrink-0"
                    dangerouslySetInnerHTML={{ 
                      __html: iconPreview.svg.replace('<svg', `<svg fill="${iconPreview.color}"`)
                    }}
                  />
                ) : (
                  <div className="w-8 h-8 flex-shrink-0 bg-gray-300 rounded-sm flex items-center justify-center">
                    <AlertCircle size={16} className="text-gray-600" />
                  </div>
                )}
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{iconPreview.displayName}</span>
                    {iconPreview.found ? (
                      <Check size={14} className="text-green-600" />
                    ) : (
                      <AlertCircle size={14} className="text-orange-500" />
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    Will be saved as: "{iconPreview.name}"
                  </div>
                </div>
              </div>

              {!iconPreview.found && (
                <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
                  <strong>Icon not found.</strong> Try variations like "python", "react", "docker", etc.
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default PipelineIconSelector;
