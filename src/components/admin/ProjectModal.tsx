
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { X, Check, Save } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Import tab components
import BasicInfoTab from './project-modal/BasicInfoTab';
import MediaTechTab from './project-modal/MediaTechTab';
import ContentTab from './project-modal/ContentTab';
import LinksTab from './project-modal/LinksTab';
import PipelineDevTab from './project-modal/PipelineDevTab';

import { saveAndUpdateDynamicContent } from '@/integrations/firebase/firestore';

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
  visible: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: any;
  onSave: (project: Project) => void;
}

export default function ProjectModal({ isOpen, onClose, project, onSave }: ProjectModalProps) {
  const [activeTab, setActiveTab] = useState('basic-info');
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastAutoSaved, setLastAutoSaved] = useState<Date | null>(null);
  const [showAutoSaveTooltip, setShowAutoSaveTooltip] = useState(false);

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
    developmentPipeline: project?.developmentPipeline || [],
    visible: project?.visible ?? true
  });

  // Reset form data when project changes
  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        version: project.version || '',
        status: project.status || 'active',
        type: project.type || 'web',
        duration: project.duration || '',
        order: project.order || 0,
        demoLink: project.demoLink || '',
        codeLink: project.codeLink || '',
        downloadLink: project.downloadLink || '',
        screenshots: project.screenshots || [],
        technologies: project.technologies || [],
        content: getProjectContent(),
        developmentPipeline: project.developmentPipeline || [],
        visible: project.visible ?? true
      });
    } else {
      // Reset for new project
      setFormData({
        title: '',
        version: '',
        status: 'active',
        type: 'web',
        duration: '',
        order: 0,
        demoLink: '',
        codeLink: '',
        downloadLink: '',
        screenshots: [],
        technologies: [],
        content: {
          about: '',
          features: '',
          challenges: '',
          achievements: '',
          accessibility: ''
        },
        developmentPipeline: [],
        visible: true
      });
    }
  }, [project, isOpen]);

  // Auto-save functionality
  useEffect(() => {
    if (!isOpen || !project?.id) return; // Only auto-save for existing projects

    const timeoutId = setTimeout(() => {
      handleAutoSave();
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(timeoutId);
  }, [formData, isOpen, project?.id]);

  const handleAutoSave = async () => {
    if (!project?.id) return; // Don't auto-save new projects

    try {
      setIsAutoSaving(true);
      
      const updatedProject = {
        ...formData,
        id: project.id,
        updatedAt: new Date().toISOString(),
        createdAt: project.createdAt || new Date().toISOString()
      };

      await saveAndUpdateDynamicContent('projects', updatedProject, project.id);
      
      const now = new Date();
      setLastAutoSaved(now);
      setShowAutoSaveTooltip(true);
      
      // Hide tooltip after 2 seconds
      setTimeout(() => setShowAutoSaveTooltip(false), 2000);
      
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setIsAutoSaving(false);
    }
  };

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

    try {
      const now = new Date().toISOString();
      const newProject: Project = {
        id: project?.id,
        title: formData.title,
        version: formData.version,
        status: formData.status as 'active' | 'inactive' | 'archived',
        type: formData.type as 'web' | 'mobile' | 'desktop',
        duration: formData.duration,
        order: formData.order,
        demoLink: formData.demoLink,
        codeLink: formData.codeLink,
        downloadLink: formData.downloadLink,
        screenshots: formData.screenshots,
        technologies: formData.technologies,
        content: formData.content,
        developmentPipeline: formData.developmentPipeline,
        visible: formData.visible,
        createdAt: project?.createdAt || now,
        updatedAt: now
      };

      // Save to Firebase
      if (project?.id) {
        await saveAndUpdateDynamicContent('projects', newProject, project.id);
      } else {
        const result = await saveAndUpdateDynamicContent('projects', newProject);
        newProject.id = result.id;
      }

      onSave(newProject);
      toast.success(
        project ? "Project updated successfully." : "Project created successfully."
      );
      onClose();
    } catch (error) {
      console.error('Save failed:', error);
      toast.error('Failed to save project. Please try again.');
    }
  };

  return (
    <TooltipProvider>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex flex-row items-center justify-between pb-4 border-b flex-shrink-0">
            <div className="flex items-center gap-3">
              <DialogTitle className="text-xl font-semibold">
                {project ? 'Edit Project' : 'Add New Project'}
              </DialogTitle>
              {project?.id && (
                <div className="flex items-center gap-2">
                  {isAutoSaving && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary" />
                      <span>Saving...</span>
                    </div>
                  )}
                  {lastAutoSaved && (
                    <Tooltip open={showAutoSaveTooltip}>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1 text-sm text-green-600">
                          <Check className="h-3 w-3" />
                          <span>Auto-saved</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>Last saved at {lastAutoSaved.toLocaleTimeString()}</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              )}
            </div>
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
              <TabsList className="grid w-full grid-cols-5 mb-6 flex-shrink-0">
                <TabsTrigger value="basic-info" className="text-sm">Basic Info</TabsTrigger>
                <TabsTrigger value="media-tech" className="text-sm">Media & Tech</TabsTrigger>
                <TabsTrigger value="content" className="text-sm">Content</TabsTrigger>
                <TabsTrigger value="links" className="text-sm">Links</TabsTrigger>
                <TabsTrigger value="pipeline-dev" className="text-sm">Pipeline Dev</TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <TabsContent value="basic-info" className="mt-0 p-1">
                  <BasicInfoTab formData={formData} onChange={handleFieldChange} />
                </TabsContent>

                <TabsContent value="media-tech" className="mt-0 p-1">
                  <MediaTechTab formData={formData} onChange={handleFieldChange} />
                </TabsContent>

                <TabsContent value="content" className="mt-0 p-1">
                  <ContentTab formData={formData} onChange={handleFieldChange} />
                </TabsContent>

                <TabsContent value="links" className="mt-0 p-1">
                  <LinksTab formData={formData} onChange={handleFieldChange} />
                </TabsContent>

                <TabsContent value="pipeline-dev" className="mt-0 p-1">
                  <PipelineDevTab formData={formData} onChange={handleFieldChange} />
                </TabsContent>
              </div>
            </Tabs>

            {/* Form Actions */}
            <div className="flex justify-end gap-2 pt-4 border-t bg-background flex-shrink-0">
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
                <Save className="h-4 w-4" />
                {project ? 'Update Project' : 'Create Project'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
