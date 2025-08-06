
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { X } from 'lucide-react';

// Import tab components
import BasicInfoTab from './project-modal/BasicInfoTab';
import MediaTechTab from './project-modal/MediaTechTab';
import ContentTab from './project-modal/ContentTab';
import LinksTab from './project-modal/LinksTab';
import PipelineDevTab from './project-modal/PipelineDevTab';

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
  developmentPipeline: any[];
}

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: any;
  onSave: (project: Project) => void;
}

export default function ProjectModal({ isOpen, onClose, project, onSave }: ProjectModalProps) {
  const [activeTab, setActiveTab] = useState('basic-info');

  // Transform project data to handle both ProjectItem and Project types
  const getProjectContent = () => {
    if (!project) return {
      about: '',
      features: '',
      challenges: '',
      achievements: '',
      accessibility: ''
    };
    
    // Handle ProjectItem format
    if ('about' in project) {
      return {
        about: project.about || '',
        features: project.features || '',
        challenges: project.challenges || '',
        achievements: project.achievements || '',
        accessibility: project.accessibility || ''
      };
    }
    
    // Handle Project format
    return project.content || {
      about: '',
      features: '',
      challenges: '',
      achievements: '',
      accessibility: ''
    };
  };

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
    content: getProjectContent(),
    developmentPipeline: project?.developmentPipeline || []
  });

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title?.trim()) {
      toast.error('Title is required');
      setActiveTab('basic-info');
      return;
    }

    if (!formData.version?.trim()) {
      toast.error('Version is required');
      setActiveTab('basic-info');
      return;
    }

    if (!formData.duration?.trim()) {
      toast.error('Duration is required');
      setActiveTab('basic-info');
      return;
    }

    const newProject: Project = {
      id: project?.id,
      title: formData.title,
      version: formData.version,
      status: formData.status,
      type: formData.type,
      duration: formData.duration,
      order: formData.order,
      demoLink: formData.demoLink,
      codeLink: formData.codeLink,
      downloadLink: formData.downloadLink,
      screenshots: formData.screenshots,
      technologies: formData.technologies,
      content: formData.content,
      developmentPipeline: formData.developmentPipeline
    };

    onSave(newProject);
    toast.success(
      project ? "Project updated successfully." : "Project created successfully."
    );
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between pb-4 border-b">
          <DialogTitle className="text-xl font-semibold">
            {project ? 'Edit Project' : 'Add New Project'}
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="basic-info" className="text-sm">Basic Info</TabsTrigger>
              <TabsTrigger value="media-tech" className="text-sm">Media & Tech</TabsTrigger>
              <TabsTrigger value="content" className="text-sm">Content</TabsTrigger>
              <TabsTrigger value="links" className="text-sm">Links</TabsTrigger>
              <TabsTrigger value="pipeline-dev" className="text-sm">Pipeline Dev</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto">
              <TabsContent value="basic-info" className="mt-0">
                <BasicInfoTab formData={formData} onChange={handleFieldChange} />
              </TabsContent>

              <TabsContent value="media-tech" className="mt-0">
                <MediaTechTab formData={formData} onChange={handleFieldChange} />
              </TabsContent>

              <TabsContent value="content" className="mt-0">
                <ContentTab formData={formData} onChange={handleFieldChange} />
              </TabsContent>

              <TabsContent value="links" className="mt-0">
                <LinksTab formData={formData} onChange={handleFieldChange} />
              </TabsContent>

              <TabsContent value="pipeline-dev" className="mt-0">
                <PipelineDevTab formData={formData} onChange={handleFieldChange} />
              </TabsContent>
            </div>
          </Tabs>

          {/* Form Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t bg-background">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
              {project ? 'Update Project' : 'Create Project'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
