import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';

interface TechnologySelectorProps {
  selectedTechnologies: string[];
  onTechnologiesChange: (technologies: string[]) => void;
}

const commonTechnologies = [
  'React', 'TypeScript', 'JavaScript', 'Node.js', 'Python', 'Java', 'C#', 'PHP',
  'Vue.js', 'Angular', 'Next.js', 'Express.js', 'Django', 'Flask', 'Spring Boot',
  'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Firebase', 'Supabase',
  'HTML', 'CSS', 'Tailwind CSS', 'Bootstrap', 'SASS/SCSS',
  'Docker', 'Kubernetes', 'AWS', 'Azure', 'Google Cloud',
  'Git', 'GitHub', 'GitLab', 'Figma', 'Adobe XD',
  'React Native', 'Flutter', 'Swift', 'Kotlin', 'Xamarin',
  'GraphQL', 'REST API', 'WebSocket', 'JWT', 'OAuth'
];

const TechnologySelector: React.FC<TechnologySelectorProps> = ({
  selectedTechnologies = [],
  onTechnologiesChange
}) => {
  const [inputValue, setInputValue] = useState('');

  const addTechnology = (tech: string) => {
    const trimmedTech = tech.trim();
    if (trimmedTech && !selectedTechnologies.includes(trimmedTech)) {
      onTechnologiesChange([...selectedTechnologies, trimmedTech]);
    }
    setInputValue('');
  };

  const removeTechnology = (tech: string) => {
    onTechnologiesChange(selectedTechnologies.filter(t => t !== tech));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTechnology(inputValue);
    }
  };

  const availableCommonTechs = commonTechnologies.filter(
    tech => !selectedTechnologies.includes(tech)
  );

  return (
    <div className="space-y-4">
      {/* Selected Technologies */}
      {selectedTechnologies.length > 0 && (
        <div>
          <label className="text-sm font-medium mb-2 block">Selected Technologies</label>
          <div className="flex flex-wrap gap-2">
            {selectedTechnologies.map((tech) => (
              <Badge key={tech} variant="secondary" className="flex items-center gap-1">
                {tech}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-red-500"
                  onClick={() => removeTechnology(tech)}
                />
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Add Custom Technology */}
      <div>
        <label className="text-sm font-medium mb-2 block">Add Technology</label>
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter technology name..."
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => addTechnology(inputValue)}
            disabled={!inputValue.trim()}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Common Technologies */}
      {availableCommonTechs.length > 0 && (
        <div>
          <label className="text-sm font-medium mb-2 block">Common Technologies</label>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
            {availableCommonTechs.map((tech) => (
              <Badge
                key={tech}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                onClick={() => addTechnology(tech)}
              >
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnologySelector;
