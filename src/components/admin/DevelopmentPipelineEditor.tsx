import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import PipelineIconSelector from './PipelineIconSelector';
import * as simpleIcons from "simple-icons";

interface PipelineTool {
  name: string;
  tag: string;
  note: string;
}

interface PipelineStep {
  id: string;
  stepNumber: number;
  phase: string;
  priority: 'high' | 'medium' | 'low';
  duration: string;
  status: 'completed' | 'in-progress' | 'optional';
  title: string;
  description: string;
  proTip?: string;
  tools: PipelineTool[];
  codeExampleLink?: string;
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
      stepNumber: steps.length + 1,
      phase: '',
      priority: 'medium',
      duration: '',
      status: 'in-progress',
      title: '',
      description: '',
      proTip: '',
      tools: [],
      codeExampleLink: '',
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
      stepNumber: index + 1,
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
    
    [newSteps[stepIndex], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[stepIndex]];
    
    newSteps.forEach((step, index) => {
      step.order = index;
      step.stepNumber = index + 1;
    });

    onChange(newSteps);
  };

  const addTool = (stepId: string) => {
    const newTool: PipelineTool = {
      name: '',
      tag: 'library',
      note: ''
    };
    
    updateStep(stepId, 'tools', [
      ...steps.find(s => s.id === stepId)?.tools || [],
      newTool
    ]);
  };

  const updateTool = (stepId: string, toolIndex: number, field: keyof PipelineTool, value: string) => {
    const step = steps.find(s => s.id === stepId);
    if (!step) return;
    
    const updatedTools = [...step.tools];
    updatedTools[toolIndex] = { ...updatedTools[toolIndex], [field]: value };
    updateStep(stepId, 'tools', updatedTools);
  };

  const removeTool = (stepId: string, toolIndex: number) => {
    const step = steps.find(s => s.id === stepId);
    if (!step) return;
    
    const updatedTools = step.tools.filter((_, index) => index !== toolIndex);
    updateStep(stepId, 'tools', updatedTools);
  };

  const renderStepIcon = (iconName: string) => {
    if (!iconName) return null;

    try {
      const normalizedName = iconName.toLowerCase().replace(/[^a-z0-9]/g, '');
      const iconKey = `si${normalizedName.charAt(0).toUpperCase() + normalizedName.slice(1)}`;
      const icon = (simpleIcons as any)[iconKey];

      if (icon && icon.svg && typeof icon.svg === 'string') {
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'in-progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'optional': return 'bg-gray-100 text-gray-600 dark:bg-gray-800/20 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-600 dark:bg-gray-800/20 dark:text-gray-400';
    }
  };

  const getToolTagColor = (tag: string) => {
    const colors = {
      language: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
      library: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
      framework: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
      database: 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400',
      tool: 'bg-pink-100 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400',
      service: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400',
      query: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400',
      integration: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
      default: 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'
    };
    return colors[tag as keyof typeof colors] || colors.default;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">Development Pipeline Steps</h4>
          <p className="text-sm text-muted-foreground">
            Define comprehensive development steps for this project
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
        <div className="space-y-4">
          {steps
            .sort((a, b) => a.order - b.order)
            .map((step, index) => (
              <Card key={step.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-xs">
                        Step {step.stepNumber}
                      </Badge>
                      {step.icon && renderStepIcon(step.icon)}
                      <CardTitle className="text-base">
                        {step.title || 'Untitled Step'}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs ${getPriorityColor(step.priority)}`}>
                          {step.priority}
                        </Badge>
                        <Badge className={`text-xs ${getStatusColor(step.status)}`}>
                          {step.status.replace('-', ' ')}
                        </Badge>
                        {step.phase && (
                          <Badge variant="secondary" className="text-xs">
                            {step.phase}
                          </Badge>
                        )}
                      </div>
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

                <CardContent className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`title-${step.id}`}>Step Title*</Label>
                      <Input
                        id={`title-${step.id}`}
                        value={step.title}
                        onChange={(e) => updateStep(step.id, 'title', e.target.value)}
                        placeholder="e.g., Data Collection"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`phase-${step.id}`}>Phase*</Label>
                      <Input
                        id={`phase-${step.id}`}
                        value={step.phase}
                        onChange={(e) => updateStep(step.id, 'phase', e.target.value)}
                        placeholder="e.g., DATA ACQUISITION"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`duration-${step.id}`}>Duration*</Label>
                      <Input
                        id={`duration-${step.id}`}
                        value={step.duration}
                        onChange={(e) => updateStep(step.id, 'duration', e.target.value)}
                        placeholder="e.g., 2-3 days"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Priority*</Label>
                      <Select
                        value={step.priority}
                        onValueChange={(value) => updateStep(step.id, 'priority', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Status*</Label>
                      <Select
                        value={step.status}
                        onValueChange={(value) => updateStep(step.id, 'status', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="optional">Optional</SelectItem>
                        </SelectContent>
                      </Select>
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

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor={`description-${step.id}`}>Description*</Label>
                    <Textarea
                      id={`description-${step.id}`}
                      value={step.description}
                      onChange={(e) => updateStep(step.id, 'description', e.target.value)}
                      placeholder="Describe what was done during this step. Include tools used, data sources, validation steps, and key goals..."
                      rows={4}
                    />
                  </div>

                  {/* Pro Tip */}
                  <div className="space-y-2">
                    <Label htmlFor={`proTip-${step.id}`}>Pro Tip (Optional)</Label>
                    <Input
                      id={`proTip-${step.id}`}
                      value={step.proTip || ''}
                      onChange={(e) => updateStep(step.id, 'proTip', e.target.value)}
                      placeholder="A helpful tip or best practice relevant to this step..."
                    />
                  </div>

                  {/* Tools & Technologies */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Tools & Technologies</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addTool(step.id)}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Tool
                      </Button>
                    </div>
                    
                    {step.tools.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No tools added yet. Click "Add Tool" to add technologies used in this step.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {step.tools.map((tool, toolIndex) => (
                          <div key={toolIndex} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 border rounded-lg">
                            <div className="space-y-1">
                              <Label className="text-xs">Tool Name</Label>
                              <Input
                                value={tool.name}
                                onChange={(e) => updateTool(step.id, toolIndex, 'name', e.target.value)}
                                placeholder="e.g., Python"
                                size="sm"
                              />
                            </div>
                            
                            <div className="space-y-1">
                              <Label className="text-xs">Tag</Label>
                              <Select
                                value={tool.tag}
                                onValueChange={(value) => updateTool(step.id, toolIndex, 'tag', value)}
                              >
                                <SelectTrigger className="h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="language">Language</SelectItem>
                                  <SelectItem value="library">Library</SelectItem>
                                  <SelectItem value="framework">Framework</SelectItem>
                                  <SelectItem value="database">Database</SelectItem>
                                  <SelectItem value="tool">Tool</SelectItem>
                                  <SelectItem value="service">Service</SelectItem>
                                  <SelectItem value="query">Query</SelectItem>
                                  <SelectItem value="integration">Integration</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-1">
                              <Label className="text-xs">Usage Note</Label>
                              <Input
                                value={tool.note}
                                onChange={(e) => updateTool(step.id, toolIndex, 'note', e.target.value)}
                                placeholder="Primary programming language..."
                                size="sm"
                              />
                            </div>
                            
                            <div className="flex items-end">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                onClick={() => removeTool(step.id, toolIndex)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Code Example Link */}
                  <div className="space-y-2">
                    <Label htmlFor={`codeExample-${step.id}`}>Code Example Link (Optional)</Label>
                    <Input
                      id={`codeExample-${step.id}`}
                      value={step.codeExampleLink || ''}
                      onChange={(e) => updateStep(step.id, 'codeExampleLink', e.target.value)}
                      placeholder="URL or reference to code snippet..."
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
