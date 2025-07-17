
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Search, Plus, Check, AlertCircle } from "lucide-react";
import * as simpleIcons from "simple-icons";

interface IconPreview {
  name: string;
  displayName: string;
  svg: string;
  color: string;
  found: boolean;
}

interface EnhancedIconSelectorProps {
  selectedIcons: string[];
  onIconsChange: (icons: string[]) => void;
}

const EnhancedIconSelector = ({ selectedIcons, onIconsChange }: EnhancedIconSelectorProps) => {
  const [inputValue, setInputValue] = useState("");
  const [iconPreview, setIconPreview] = useState<IconPreview | null>(null);
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
      let iconKey = Object.keys(simpleIcons).find(key => 
        key.toLowerCase() === `si${normalizedName}`
      );

      // If not found, try partial matches
      if (!iconKey) {
        iconKey = Object.keys(simpleIcons).find(key => 
          key.toLowerCase().includes(normalizedName) ||
          normalizedName.includes(key.toLowerCase().replace('si', ''))
        );
      }

      if (iconKey) {
        const icon = (simpleIcons as any)[iconKey];
        return {
          name: normalizedName,
          displayName: icon.title || name,
          svg: icon.svg,
          color: `#${icon.hex}`,
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

  const addIcon = (iconName: string) => {
    const normalizedName = normalizeIconName(iconName);
    if (normalizedName && !selectedIcons.includes(normalizedName)) {
      onIconsChange([...selectedIcons, normalizedName]);
    }
    setInputValue('');
    setIconPreview(null);
  };

  const removeIcon = (iconName: string) => {
    onIconsChange(selectedIcons.filter(icon => icon !== iconName));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (iconPreview) {
        addIcon(iconPreview.name);
      }
    }
  };

  // Function to render saved icons with their actual Simple Icons
  const renderSavedIcon = (iconName: string) => {
    const iconData = getSimpleIcon(iconName);
    
    if (iconData.found && iconData.svg) {
      return (
        <div 
          className="w-4 h-4 flex-shrink-0"
          dangerouslySetInnerHTML={{ 
            __html: iconData.svg.replace('<svg', `<svg fill="${iconData.color}"`)
          }}
        />
      );
    }
    
    return (
      <div className="w-4 h-4 flex-shrink-0 bg-gray-300 rounded-sm flex items-center justify-center">
        <span className="text-xs text-gray-600">?</span>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Selected Icons */}
      {selectedIcons.length > 0 && (
        <div>
          <label className="text-sm font-medium mb-2 block">Selected Icons ({selectedIcons.length})</label>
          <div className="flex flex-wrap gap-2">
            {selectedIcons.map((icon) => {
              const iconData = getSimpleIcon(icon);
              return (
                <Badge key={icon} variant="secondary" className="flex items-center gap-2 px-3 py-1">
                  {renderSavedIcon(icon)}
                  <span className="text-sm">{iconData.displayName}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => removeIcon(icon)}
                  >
                    <X size={12} />
                  </Button>
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      {/* Add New Icon */}
      <div>
        <label className="text-sm font-medium mb-2 block">Add Technology/Platform Icon</label>
        
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type technology name (e.g., firebase, react, python)..."
            className="pl-10 pr-16"
          />
          {inputValue && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 px-2"
              onClick={() => iconPreview && addIcon(iconPreview.name)}
              disabled={!iconPreview || selectedIcons.includes(iconPreview.name)}
            >
              <Plus className="w-3 h-3" />
            </Button>
          )}
        </div>

        {/* Real-time Preview */}
        {inputValue && (
          <div className="mt-3 p-3 border rounded-lg bg-gray-50">
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
                    <strong>Icon not found.</strong> You can still add it manually. 
                    Try variations like "firebase", "nodejs", "javascript", etc.
                  </div>
                )}

                {selectedIcons.includes(iconPreview.name) && (
                  <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                    This icon is already selected.
                  </div>
                )}
              </div>
            ) : null}
          </div>
        )}

        {/* Instructions */}
        <div className="mt-2 text-xs text-gray-500">
          <p>💡 <strong>Tips:</strong></p>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li>Type exact names like "firebase", "react", "python" for best results</li>
            <li>Icons are automatically matched from the Simple Icons library</li>
            <li>Saved names will be used to render icons on your public portfolio</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EnhancedIconSelector;
