
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Search } from "lucide-react";

interface IconSelectorProps {
  selectedIcons: string[];
  onIconsChange: (icons: string[]) => void;
}

const IconSelector = ({ selectedIcons, onIconsChange }: IconSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Predefined list of popular technology and social icons
  const availableIcons = [
    // Programming Languages
    "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "PHP", "Ruby", "Go", "Rust",
    // Frameworks & Libraries
    "React", "Vue.js", "Angular", "Node.js", "Express", "Django", "Flask", "Spring", "Laravel",
    // Databases
    "MySQL", "PostgreSQL", "MongoDB", "Redis", "SQLite", "Oracle", "Cassandra",
    // Cloud & DevOps
    "AWS", "Google Cloud", "Azure", "Docker", "Kubernetes", "Jenkins", "GitHub Actions",
    // Tools & Others
    "Git", "VS Code", "Figma", "Photoshop", "Illustrator", "Sketch",
    // Social & Communication
    "LinkedIn", "Twitter", "GitHub", "GitLab", "Behance", "Dribbble", "Medium", "Dev.to",
    // Mobile
    "React Native", "Flutter", "Swift", "Kotlin", "Xamarin"
  ];

  const filteredIcons = availableIcons.filter(icon =>
    icon.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleIconToggle = (icon: string) => {
    if (selectedIcons.includes(icon)) {
      onIconsChange(selectedIcons.filter(i => i !== icon));
    } else {
      onIconsChange([...selectedIcons, icon]);
    }
  };

  const handleRemoveIcon = (icon: string) => {
    onIconsChange(selectedIcons.filter(i => i !== icon));
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <Input
          placeholder="Search for technologies, social platforms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Selected Icons */}
      {selectedIcons.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-2">Selected Icons ({selectedIcons.length})</p>
          <div className="flex flex-wrap gap-2">
            {selectedIcons.map((icon) => (
              <Badge key={icon} variant="secondary" className="flex items-center gap-1">
                {icon}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => handleRemoveIcon(icon)}
                >
                  <X size={12} />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Available Icons */}
      <div>
        <p className="text-sm font-medium mb-2">Available Icons</p>
        <div className="max-h-60 overflow-y-auto border rounded-md p-3">
          <div className="flex flex-wrap gap-2">
            {filteredIcons.map((icon) => (
              <Button
                key={icon}
                variant={selectedIcons.includes(icon) ? "default" : "outline"}
                size="sm"
                onClick={() => handleIconToggle(icon)}
                className="text-xs"
              >
                {icon}
              </Button>
            ))}
          </div>
          {filteredIcons.length === 0 && (
            <p className="text-gray-500 text-center py-4">No icons found matching "{searchTerm}"</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default IconSelector;
