
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { Label } from '@/components/ui/label';
import PipelineIconSelector from './PipelineIconSelector';
import * as simpleIcons from "simple-icons";

interface PipelineStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

interface DevelopmentPipelineEditorProps {
  steps: PipelineStep[];
  onChange: (steps: PipelineStep[]) => void;
}

const DevelopmentPipelineEditor: React.FC<DevelopmentPipelineEditorProps> = ({
  steps,
  onChange
}) => {
  const [editingStep, setEditingStep] = useState<string | null>(null);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addStep = () => {
    const newStep: PipelineStep = {
      id: generateId(),
      title: '',
      description: '',
      icon: '',
      order: steps.length
    };
    onChange([...steps, newStep]);
    setEditingStep(newStep.id);
  };

  const updateStep = (id: string, field: keyof PipelineStep, value: any) => {
    const updatedSteps = steps.map(step =>
      step.id === id ? { ...step, [field]: value } : step
    );
    onChange(updatedSteps);
  };

  const removeStep = (id: string) => {
    const filteredSteps = steps.filter(step => step.id !== id);
    const reorderedSteps = filteredSteps.map((step, index) => ({
      ...step,
      order: index
    }));
    onChange(reorderedSteps);
  };

  const moveStep = (id: string, direction: 'up' | 'down') => {
    const stepIndex = steps.findIndex(step => step.id === id);
    if (
      (direction === 'up' && stepIndex === 0) ||
      (direction === 'down' && stepIndex === steps.length - 1)
    ) {
      return;
    }

    const newSteps = [...steps];
    const targetIndex = direction === 'up' ? stepIndex - 1 : stepIndex + 1;
    
    // Swap the steps
    [newSteps[stepIndex], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[stepIndex]];
    
    // Update order values
    newSteps.forEach((step, index) => {
      step.order = index;
    });

    onChange(newSteps);
  };

  // Function to render step icon
  const renderStepIcon = (iconName: string) => {
    if (!iconName) return null;

    try {
      const normalizedName = iconName.toLowerCase().replace(/[^a-z0-9]/g, '');
      const iconKey = `si${normalizedName.charAt(0).toUpperCase() + normalizedName.slice(1)}`;
      const icon = (simpleIcons as any)[iconKey];

      if (icon && icon.svg) {
        return (
          <div 
            className="w-5 h-5 flex-shrink-0"
            dangerouslySetInnerHTML={{ 
              __html: icon.svg.replace('<svg', `<svg fill="#${icon.hex}"`)
            }}
          />
        );
      }
    } catch (error) {
      console.log('Icon not found:', iconName);
    }

    return (
      <div className="w-5 h-5 flex-shrink-0 bg-gray-300 rounded-sm flex items-center justify-center">
        <span className="text-xs text-gray-600">?</span>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">Development Pipeline Steps</h4>
          <p className="text-sm text-muted-foreground">
            Define the custom development steps for this project
          </p>
        </div>
        <Button onClick={addStep} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Step
        </Button>
      </div>

      {steps.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No pipeline steps defined yet.</p>
          <p className="text-sm">Click "Add Step" to create your first development step.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {steps
            .sort((a, b) => a.order - b.order)
            .map((step, index) => (
              <Card key={step.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        Step {index + 1}
                      </Badge>
                      {step.icon && renderStepIcon(step.icon)}
                      <CardTitle className="text-base">
                        {step.title || 'Untitled Step'}
                      </CardTitle>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => moveStep(step.id, 'up')}
                        disabled={index === 0}
                      >
                        ↑
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => moveStep(step.id, 'down')}
                        disabled={index === steps.length - 1}
                      >
                        ↓
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                        onClick={() => removeStep(step.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`title-${step.id}`}>Step Title</Label>
                      <Input
                        id={`title-${step.id}`}
                        value={step.title}
                        onChange={(e) => updateStep(step.id, 'title', e.target.value)}
                        placeholder="e.g., Data Collection, Model Training, etc."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Step Icon</Label>
                      <PipelineIconSelector
                        value={step.icon}
                        onChange={(iconName) => updateStep(step.id, 'icon', iconName)}
                        placeholder="e.g., python, tensorflow, docker..."
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`description-${step.id}`}>Step Description</Label>
                    <Textarea
                      id={`description-${step.id}`}
                      value={step.description}
                      onChange={(e) => updateStep(step.id, 'description', e.target.value)}
                      placeholder="Describe what happens in this step..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
};

export default DevelopmentPipelineEditor;
