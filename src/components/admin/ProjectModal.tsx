import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import ScreenshotUploader from './ScreenshotUploader';
import TechnologySelector from './TechnologySelector';
import DevelopmentPipelineEditor from './DevelopmentPipelineEditor';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface Project {
  id?: string;
  title: string;
  version: string;
  status: 'active' | 'inactive' | 'archived';
  type: 'web' | 'mobile' | 'desktop';
  duration: string;
  order: number;
  demoLink: string;
  codeLink: string;
  downloadLink: string;
  screenshots: string[];
  technologies: string[];
  content: {
    about: string;
    features: string;
    challenges: string;
    achievements: string;
    accessibility: string;
  };
  developmentPipeline: PipelineStep[];
}

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

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project;
  onSave: (project: Project) => void;
}

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  version: z.string().min(1, {
    message: "Version must be at least 1 character.",
  }),
  status: z.enum(['active', 'inactive', 'archived']),
  type: z.enum(['web', 'mobile', 'desktop']),
  duration: z.string().min(2, {
    message: "Duration must be at least 2 characters.",
  }),
  order: z.number(),
  demoLink: z.string().url({ message: "Invalid URL" }),
  codeLink: z.string().url({ message: "Invalid URL" }),
  downloadLink: z.string().url({ message: "Invalid URL" }),
  screenshots: z.array(z.string()).optional(),
  technologies: z.array(z.string()).optional(),
  content: z.object({
    about: z.string().min(10, {
      message: "About must be at least 10 characters.",
    }),
    features: z.string().min(10, {
      message: "Features must be at least 10 characters.",
    }),
    challenges: z.string().min(10, {
      message: "Challenges must be at least 10 characters.",
    }),
    achievements: z.string().min(10, {
      message: "Achievements must be at least 10 characters.",
    }),
    accessibility: z.string().min(10, {
      message: "Accessibility must be at least 10 characters.",
    }),
  }),
  developmentPipeline: z.array(z.any()).optional(),
});

export default function ProjectModal({ isOpen, onClose, project, onSave }: ProjectModalProps) {
  const [formData, setFormData] = useState({
    title: project?.title || '',
    version: project?.version || '',
    status: project?.status || 'active',
    type: project?.type || 'web',
    duration: project?.duration || '',
    order: project?.order || 0,
    demoLink: project?.demoLink || '',
    codeLink: project?.codeLink || '',
    downloadLink: project?.downloadLink || '',
    screenshots: project?.screenshots || [],
    technologies: project?.technologies || [],
    content: {
      about: project?.content?.about || '',
      features: project?.content?.features || '',
      challenges: project?.content?.challenges || '',
      achievements: project?.content?.achievements || '',
      accessibility: project?.content?.accessibility || ''
    },
    developmentPipeline: project?.developmentPipeline || []
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: project?.title || "",
      version: project?.version || "",
      status: project?.status || "active",
      type: project?.type || "web",
      duration: project?.duration || "",
      order: project?.order || 0,
      demoLink: project?.demoLink || "",
      codeLink: project?.codeLink || "",
      downloadLink: project?.downloadLink || "",
      content: {
        about: project?.content?.about || "",
        features: project?.content?.features || "",
        challenges: project?.content?.challenges || "",
        achievements: project?.content?.achievements || "",
        accessibility: project?.content?.accessibility || "",
      },
      screenshots: project?.screenshots || [],
      technologies: project?.technologies || [],
      developmentPipeline: project?.developmentPipeline || []
    },
  });

  const { handleSubmit } = form;

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const newProject = {
      ...values,
      id: project?.id,
      screenshots: formData.screenshots,
      technologies: formData.technologies,
      developmentPipeline: formData.developmentPipeline
    };

    onSave(newProject);
    toast({
      title: project ? "Project updated." : "Project created.",
      description: project
        ? "Your project has been updated successfully."
        : "Your project has been created successfully.",
    });
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [name]: value
      }
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{project ? 'Edit Project' : 'Add New Project'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="version">Version</Label>
              <Input
                type="text"
                id="version"
                name="version"
                value={formData.version}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="web">Web</SelectItem>
                  <SelectItem value="mobile">Mobile</SelectItem>
                  <SelectItem value="desktop">Desktop</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="duration">Duration</Label>
              <Input
                type="text"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="order">Order</Label>
              <Input
                type="number"
                id="order"
                name="order"
                value={formData.order}
                onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) }))}
                required
              />
            </div>
          </div>

          {/* Links Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="demoLink">Demo Link</Label>
                <Input
                  type="url"
                  id="demoLink"
                  name="demoLink"
                  value={formData.demoLink}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="codeLink">Code Link</Label>
                <Input
                  type="url"
                  id="codeLink"
                  name="codeLink"
                  value={formData.codeLink}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="downloadLink">Download Link</Label>
                <Input
                  type="url"
                  id="downloadLink"
                  name="downloadLink"
                  value={formData.downloadLink}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Screenshots Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Screenshots</h3>
            <ScreenshotUploader
              screenshots={formData.screenshots}
              onChange={(newScreenshots) => setFormData(prev => ({ ...prev, screenshots: newScreenshots }))}
            />
          </div>

          {/* Technologies Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Technologies</h3>
            <TechnologySelector
              technologies={formData.technologies}
              onChange={(newTechnologies) => setFormData(prev => ({ ...prev, technologies: newTechnologies }))}
            />
          </div>

          {/* Content Sections */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Content</h3>
            <div>
              <Label htmlFor="about">About</Label>
              <Textarea
                id="about"
                name="about"
                value={formData.content.about}
                onChange={handleContentChange}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="features">Features</Label>
              <Textarea
                id="features"
                name="features"
                value={formData.content.features}
                onChange={handleContentChange}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="challenges">Challenges</Label>
              <Textarea
                id="challenges"
                name="challenges"
                value={formData.content.challenges}
                onChange={handleContentChange}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="achievements">Achievements</Label>
              <Textarea
                id="achievements"
                name="achievements"
                value={formData.content.achievements}
                onChange={handleContentChange}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="accessibility">Accessibility</Label>
              <Textarea
                id="accessibility"
                name="accessibility"
                value={formData.content.accessibility}
                onChange={handleContentChange}
                rows={3}
              />
            </div>
          </div>

          {/* Development Pipeline Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Development Pipeline (Optional)</h3>
            <p className="text-sm text-muted-foreground">
              Add custom development steps for this project. Leave empty to use the default ML pipeline.
            </p>
            <DevelopmentPipelineEditor
              steps={formData.developmentPipeline}
              onChange={(steps) => setFormData(prev => ({ ...prev, developmentPipeline: steps }))}
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{project ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
