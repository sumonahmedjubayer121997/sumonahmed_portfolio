
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, GripVertical } from "lucide-react";

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

interface DevelopmentPipelineEditorProps {
  steps: PipelineStep[];
  onChange: (steps: PipelineStep[]) => void;
}

const defaultStep: Omit<PipelineStep, 'step'> = {
  icon: "🔧",
  title: "",
  category: "Development",
  priority: "medium",
  duration: "1-2 days",
  status: "optional",
  description: "",
  tools: [],
  codeExample: "",
  media: { type: "tip", content: "" }
};

export default function DevelopmentPipelineEditor({ steps, onChange }: DevelopmentPipelineEditorProps) {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const addStep = () => {
    const newStep: PipelineStep = {
      ...defaultStep,
      step: steps.length + 1,
      title: `Step ${steps.length + 1}`
    };
    onChange([...steps, newStep]);
  };

  const removeStep = (stepIndex: number) => {
    const updatedSteps = steps.filter((_, index) => index !== stepIndex)
      .map((step, index) => ({ ...step, step: index + 1 }));
    onChange(updatedSteps);
  };

  const updateStep = (stepIndex: number, updates: Partial<PipelineStep>) => {
    const updatedSteps = steps.map((step, index) => 
      index === stepIndex ? { ...step, ...updates } : step
    );
    onChange(updatedSteps);
  };

  const addTool = (stepIndex: number) => {
    const step = steps[stepIndex];
    const newTool = { name: "", usage: "", type: "library" };
    updateStep(stepIndex, { 
      tools: [...step.tools, newTool] 
    });
  };

  const updateTool = (stepIndex: number, toolIndex: number, updates: Partial<{ name: string; usage: string; type: string }>) => {
    const step = steps[stepIndex];
    const updatedTools = step.tools.map((tool, index) => 
      index === toolIndex ? { ...tool, ...updates } : tool
    );
    updateStep(stepIndex, { tools: updatedTools });
  };

  const removeTool = (stepIndex: number, toolIndex: number) => {
    const step = steps[stepIndex];
    const updatedTools = step.tools.filter((_, index) => index !== toolIndex);
    updateStep(stepIndex, { tools: updatedTools });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Pipeline Steps</h4>
        <Button type="button" onClick={addStep} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Step
        </Button>
      </div>

      {steps.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            <p>No custom pipeline steps defined. Click "Add Step" to create your first step.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {steps.map((step, stepIndex) => (
            <Card key={stepIndex}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                    <CardTitle className="text-sm">
                      Step {step.step}: {step.title || "Untitled"}
                    </CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {step.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedStep(expandedStep === stepIndex ? null : stepIndex)}
                    >
                      {expandedStep === stepIndex ? "Collapse" : "Expand"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeStep(stepIndex)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {expandedStep === stepIndex && (
                <CardContent className="space-y-4">
                  {/* Basic Step Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium">Title</label>
                      <Input
                        value={step.title}
                        onChange={(e) => updateStep(stepIndex, { title: e.target.value })}
                        placeholder="Step title"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium">Icon (Emoji)</label>
                      <Input
                        value={step.icon}
                        onChange={(e) => updateStep(stepIndex, { icon: e.target.value })}
                        placeholder="🔧"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium">Category</label>
                      <Input
                        value={step.category}
                        onChange={(e) => updateStep(stepIndex, { category: e.target.value })}
                        placeholder="Development"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium">Duration</label>
                      <Input
                        value={step.duration}
                        onChange={(e) => updateStep(stepIndex, { duration: e.target.value })}
                        placeholder="1-2 days"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium">Priority</label>
                      <Select
                        value={step.priority}
                        onValueChange={(value) => updateStep(stepIndex, { priority: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs font-medium">Status</label>
                      <Select
                        value={step.status}
                        onValueChange={(value: StepStatus) => updateStep(stepIndex, { status: value })}
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
                    <label className="text-xs font-medium">Description</label>
                    <Textarea
                      value={step.description}
                      onChange={(e) => updateStep(stepIndex, { description: e.target.value })}
                      placeholder="Describe this step..."
                      rows={3}
                    />
                  </div>

                  {/* Media/Insight */}
                  <div>
                    <label className="text-xs font-medium">Insight/Tip</label>
                    <Input
                      value={step.media.content}
                      onChange={(e) => updateStep(stepIndex, { 
                        media: { ...step.media, content: e.target.value } 
                      })}
                      placeholder="💡 Pro tip: ..."
                    />
                  </div>

                  {/* Code Example */}
                  <div>
                    <label className="text-xs font-medium">Code Example</label>
                    <Textarea
                      value={step.codeExample}
                      onChange={(e) => updateStep(stepIndex, { codeExample: e.target.value })}
                      placeholder="# Example code here..."
                      rows={5}
                      className="font-mono text-xs"
                    />
                  </div>

                  {/* Tools Section */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-medium">Tools & Technologies</label>
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
                    
                    <div className="space-y-2">
                      {step.tools.map((tool, toolIndex) => (
                        <div key={toolIndex} className="grid grid-cols-4 gap-2 items-end">
                          <div>
                            <label className="text-xs text-muted-foreground">Name</label>
                            <Input
                              value={tool.name}
                              onChange={(e) => updateTool(stepIndex, toolIndex, { name: e.target.value })}
                              placeholder="Tool name"
                              size="sm"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground">Usage</label>
                            <Input
                              value={tool.usage}
                              onChange={(e) => updateTool(stepIndex, toolIndex, { usage: e.target.value })}
                              placeholder="How it's used"
                              size="sm"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground">Type</label>
                            <Select
                              value={tool.type}
                              onValueChange={(value) => updateTool(stepIndex, toolIndex, { type: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="language">Language</SelectItem>
                                <SelectItem value="library">Library</SelectItem>
                                <SelectItem value="framework">Framework</SelectItem>
                                <SelectItem value="tool">Tool</SelectItem>
                                <SelectItem value="service">Service</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTool(stepIndex, toolIndex)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
