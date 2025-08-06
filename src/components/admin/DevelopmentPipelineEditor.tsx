
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, X } from 'lucide-react';

type StepStatus = "completed" | "in-progress" | "optional";

interface PipelineStep {
  step: number;
  icon: string;
  title: string;
  category: string;
  priority: string;
  duration: string;
  status: StepStatus;
  description: string;
  tools: Array<{ name: string; usage: string; type: string }>;
  codeExample: string;
  media: {
    type: string;
    content: string;
  };
}

interface Tool {
  name: string;
  usage: string;
  type: string;
}

interface DevelopmentPipelineEditorProps {
  steps: PipelineStep[];
  onChange: (steps: PipelineStep[]) => void;
}

const DevelopmentPipelineEditor: React.FC<DevelopmentPipelineEditorProps> = ({
  steps,
  onChange
}) => {
  const addStep = () => {
    const newStep: PipelineStep = {
      step: steps.length + 1,
      icon: "🔧",
      title: "",
      category: "Development",
      priority: "Medium",
      duration: "",
      status: "in-progress",
      description: "",
      tools: [],
      codeExample: "",
      media: {
        type: "text",
        content: ""
      }
    };
    onChange([...steps, newStep]);
  };

  const updateStep = (index: number, field: keyof PipelineStep, value: any) => {
    const updatedSteps = steps.map((step, i) => {
      if (i === index) {
        if (field === 'step') {
          return { ...step, [field]: parseInt(value) || 1 };
        }
        return { ...step, [field]: value };
      }
      return step;
    });
    onChange(updatedSteps);
  };

  const removeStep = (index: number) => {
    const updatedSteps = steps.filter((_, i) => i !== index);
    // Renumber steps
    const renumberedSteps = updatedSteps.map((step, i) => ({
      ...step,
      step: i + 1
    }));
    onChange(renumberedSteps);
  };

  const addTool = (stepIndex: number) => {
    const newTool: Tool = { name: "", usage: "", type: "Framework" };
    const updatedSteps = steps.map((step, i) => {
      if (i === stepIndex) {
        return { ...step, tools: [...step.tools, newTool] };
      }
      return step;
    });
    onChange(updatedSteps);
  };

  const updateTool = (stepIndex: number, toolIndex: number, field: keyof Tool, value: string) => {
    const updatedSteps = steps.map((step, i) => {
      if (i === stepIndex) {
        const updatedTools = step.tools.map((tool, j) => {
          if (j === toolIndex) {
            return { ...tool, [field]: value };
          }
          return tool;
        });
        return { ...step, tools: updatedTools };
      }
      return step;
    });
    onChange(updatedSteps);
  };

  const removeTool = (stepIndex: number, toolIndex: number) => {
    const updatedSteps = steps.map((step, i) => {
      if (i === stepIndex) {
        return { ...step, tools: step.tools.filter((_, j) => j !== toolIndex) };
      }
      return step;
    });
    onChange(updatedSteps);
  };

  return (
    <div className="space-y-4">
      {steps.map((step, stepIndex) => (
        <Card key={stepIndex} className="relative">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Step {step.step}</CardTitle>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeStep(stepIndex)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Basic Step Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label>Step Number</Label>
                <Input
                  type="number"
                  value={step.step}
                  onChange={(e) => updateStep(stepIndex, 'step', e.target.value)}
                  min="1"
                />
              </div>
              <div>
                <Label>Icon</Label>
                <Input
                  value={step.icon}
                  onChange={(e) => updateStep(stepIndex, 'icon', e.target.value)}
                  placeholder="🔧"
                />
              </div>
              <div>
                <Label>Category</Label>
                <Select
                  value={step.category}
                  onValueChange={(value) => updateStep(stepIndex, 'category', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Planning">Planning</SelectItem>
                    <SelectItem value="Development">Development</SelectItem>
                    <SelectItem value="Testing">Testing</SelectItem>
                    <SelectItem value="Deployment">Deployment</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Priority</Label>
                <Select
                  value={step.priority}
                  onValueChange={(value) => updateStep(stepIndex, 'priority', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={step.title}
                  onChange={(e) => updateStep(stepIndex, 'title', e.target.value)}
                  placeholder="Step title..."
                />
              </div>
              <div>
                <Label>Duration</Label>
                <Input
                  value={step.duration}
                  onChange={(e) => updateStep(stepIndex, 'duration', e.target.value)}
                  placeholder="e.g., 2 weeks, 3 days..."
                />
              </div>
              <div>
                <Label>Status</Label>
                <Select
                  value={step.status}
                  onValueChange={(value: StepStatus) => updateStep(stepIndex, 'status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="optional">Optional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div>
              <Label>Description</Label>
              <Textarea
                value={step.description}
                onChange={(e) => updateStep(stepIndex, 'description', e.target.value)}
                placeholder="Describe what happens in this step..."
                rows={3}
              />
            </div>

            {/* Tools Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Tools & Technologies</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addTool(stepIndex)}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Tool
                </Button>
              </div>
              
              {step.tools.map((tool, toolIndex) => (
                <div key={toolIndex} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end p-3 border rounded">
                  <div>
                    <Label className="text-xs">Name</Label>
                    <Input
                      value={tool.name}
                      onChange={(e) => updateTool(stepIndex, toolIndex, 'name', e.target.value)}
                      placeholder="Tool name..."
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Usage</Label>
                    <Input
                      value={tool.usage}
                      onChange={(e) => updateTool(stepIndex, toolIndex, 'usage', e.target.value)}
                      placeholder="How it's used..."
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Type</Label>
                    <Select
                      value={tool.type}
                      onValueChange={(value) => updateTool(stepIndex, toolIndex, 'type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Framework">Framework</SelectItem>
                        <SelectItem value="Library">Library</SelectItem>
                        <SelectItem value="Tool">Tool</SelectItem>
                        <SelectItem value="Service">Service</SelectItem>
                        <SelectItem value="Database">Database</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTool(stepIndex, toolIndex)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Code Example */}
            <div>
              <Label>Code Example (Optional)</Label>
              <Textarea
                value={step.codeExample}
                onChange={(e) => updateStep(stepIndex, 'codeExample', e.target.value)}
                placeholder="Add code example for this step..."
                rows={4}
                className="font-mono"
              />
            </div>

            {/* Media */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Media Type</Label>
                <Select
                  value={step.media.type}
                  onValueChange={(value) => updateStep(stepIndex, 'media', { ...step.media, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="link">Link</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Media Content</Label>
                <Input
                  value={step.media.content}
                  onChange={(e) => updateStep(stepIndex, 'media', { ...step.media, content: e.target.value })}
                  placeholder="Enter URL or text content..."
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Button type="button" variant="outline" onClick={addStep} className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Add Development Step
      </Button>
    </div>
  );
};

export default DevelopmentPipelineEditor;
