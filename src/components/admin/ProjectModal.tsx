import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { X, Check, Save } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Import tab components
import BasicInfoTab from './project-modal/BasicInfoTab';
import MediaTechTab from './project-modal/MediaTechTab';
import ContentTab from './project-modal/ContentTab';
import LinksTab from './project-modal/LinksTab';
import PipelineDevTab from './project-modal/PipelineDevTab';

import { saveAndUpdateDynamicContent, saveDynamicContent } from '@/integrations/firebase/firestore';

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
  const [isSaving, setIsSaving] = useState(false);
  const [autoSaveTimeoutId, setAutoSaveTimeoutId] = useState<NodeJS.Timeout | null>(null);

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

  // Enhanced Auto-save functionality with proper dependency management
  useEffect(() => {
    // Clear existing timeout
    if (autoSaveTimeoutId) {
      clearTimeout(autoSaveTimeoutId);
    }

    // Only auto-save for existing projects when modal is open
    if (!isOpen || !project?.id) {
      setAutoSaveTimeoutId(null);
      return;
    }

    // Set new timeout for auto-save
    const timeoutId = setTimeout(() => {
      handleAutoSave();
    }, 2000); // Auto-save after 2 seconds of inactivity

    setAutoSaveTimeoutId(timeoutId);

    // Cleanup function
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [
    formData.title,
    formData.version,
    formData.status,
    formData.type,
    formData.duration,
    formData.order,
    formData.demoLink,
    formData.codeLink,
    formData.downloadLink,
    JSON.stringify(formData.screenshots),
    JSON.stringify(formData.technologies),
    formData.content.about,
    formData.content.features,
    formData.content.challenges,
    formData.content.achievements,
    formData.content.accessibility,
    JSON.stringify(formData.developmentPipeline),
    formData.visible,
    isOpen,
    project?.id
  ]);

  const handleAutoSave = async () => {
    if (!project?.id || isAutoSaving) return; // Don't auto-save new projects or if already saving

    try {
      setIsAutoSaving(true);
      
      console.log('Auto-saving project...', project.id);
      
      const updatedProject = {
        title: formData.title,
        version: formData.version,
        status: formData.status,
        type: formData.type,
        duration: formData.duration,
        order: formData.order,
        demoLink: formData.demoLink || '',
        codeLink: formData.codeLink || '',
        downloadLink: formData.downloadLink || '',
        screenshots: formData.screenshots || [],
        technologies: formData.technologies || [],
        // Flatten content object to match database structure
        about: formData.content.about || '',
        features: formData.content.features || '',
        challenges: formData.content.challenges || '',
        achievements: formData.content.achievements || '',
        accessibility: formData.content.accessibility || '',
        developmentPipeline: formData.developmentPipeline || [],
        visible: formData.visible,
        updatedAt: new Date().toISOString(),
        createdAt: project.createdAt || new Date().toISOString()
      };

      const { error } = await saveAndUpdateDynamicContent('projects', updatedProject, project.id);
      
      if (error) {
        console.error('Auto-save error:', error);
        return;
      }
      
      console.log('Auto-save successful');
      
      const now = new Date();
      setLastAutoSaved(now);
      setShowAutoSaveTooltip(true);
      
      // Hide tooltip after 3 seconds
      setTimeout(() => setShowAutoSaveTooltip(false), 3000);
      
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
      setIsSaving(true);
      const now = new Date().toISOString();
      
      // Create the project data in the format expected by the database (flattened structure)
      const projectData = {
        title: formData.title,
        version: formData.version,
        status: formData.status,
        type: formData.type,
        duration: formData.duration,
        order: formData.order,
        demoLink: formData.demoLink || '',
        codeLink: formData.codeLink || '',
        downloadLink: formData.downloadLink || '',
        screenshots: formData.screenshots || [],
        technologies: formData.technologies || [],
        // Flatten content object to match database structure
        about: formData.content.about || '',
        features: formData.content.features || '',
        challenges: formData.content.challenges || '',
        achievements: formData.content.achievements || '',
        accessibility: formData.content.accessibility || '',
        developmentPipeline: formData.developmentPipeline || [],
        visible: formData.visible,
        createdAt: project?.createdAt || now,
        updatedAt: now
      };

      console.log('Saving project data:', projectData);
      console.log('Is new project:', !project?.id);

      let result;
      if (project?.id) {
        // Update existing project
        result = await saveAndUpdateDynamicContent('projects', projectData, project.id);
        if (result.error) {
          throw new Error(result.error);
        }
        console.log('Project updated successfully with ID:', project.id);
      } else {
        // Create new project
        console.log('Creating new project with data:', projectData);
        result = await saveDynamicContent('projects', projectData);
        if (result.error) {
          throw new Error(result.error);
        }
        console.log('New project created successfully with ID:', result.id);
      }

      // Create the project object to return
      const newProject: Project = {
        id: project?.id || result.id,
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

      onSave(newProject);
      toast.success(
        project ? "Project updated successfully." : "Project created successfully."
      );
      onClose();
    } catch (error) {
      console.error('Save failed:', error);
      toast.error(`Failed to ${project ? 'update' : 'create'} project. Please try again.`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <TooltipProvider>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-[95vw] max-w-7xl h-[95vh] max-h-[95vh] p-0 flex flex-col overflow-hidden">
          {/* Fixed Header */}
          <DialogHeader className="flex-shrink-0 flex flex-row items-center justify-between p-4 sm:p-6 pb-3 sm:pb-4 border-b bg-background">
            <div className="flex items-center gap-3 min-w-0">
              <DialogTitle className="text-lg sm:text-xl font-semibold truncate">
                {project ? 'Edit Project' : 'Add New Project'}
              </DialogTitle>
              {project?.id && (
                <div className="flex items-center gap-2 flex-shrink-0">
                  {isAutoSaving && (
                    <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary" />
                      <span className="hidden sm:inline">Auto-saving...</span>
                      <span className="sm:hidden">Saving...</span>
                    </div>
                  )}
                  {lastAutoSaved && !isAutoSaving && (
                    <Tooltip open={showAutoSaveTooltip}>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1 text-xs sm:text-sm text-green-600 cursor-help">
                          <Check className="h-3 w-3" />
                          <span className="hidden sm:inline">Auto-saved</span>
                          <span className="sm:hidden">Saved</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="bg-green-100 text-green-800 border-green-300">
                        <p>Last auto-saved at {lastAutoSaved.toLocaleTimeString()}</p>
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
              className="h-8 w-8 p-0 flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>

          {/* Scrollable Content */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0 overflow-hidden">
                {/* Fixed Tabs Navigation */}
                <div className="flex-shrink-0 px-4 sm:px-6 pt-2">
                  <TabsList className="grid w-full grid-cols-5 mb-3 sm:mb-4 h-9 sm:h-10">
                    <TabsTrigger value="basic-info" className="text-xs sm:text-sm px-1 sm:px-3 py-1 sm:py-2">
                      <span className="hidden sm:inline">Basic Info</span>
                      <span className="sm:hidden">Basic</span>
                    </TabsTrigger>
                    <TabsTrigger value="media-tech" className="text-xs sm:text-sm px-1 sm:px-3 py-1 sm:py-2">
                      <span className="hidden sm:inline">Media & Tech</span>
                      <span className="sm:hidden">Media</span>
                    </TabsTrigger>
                    <TabsTrigger value="content" className="text-xs sm:text-sm px-1 sm:px-3 py-1 sm:py-2">
                      Content
                    </TabsTrigger>
                    <TabsTrigger value="links" className="text-xs sm:text-sm px-1 sm:px-3 py-1 sm:py-2">
                      Links
                    </TabsTrigger>
                    <TabsTrigger value="pipeline-dev" className="text-xs sm:text-sm px-1 sm:px-3 py-1 sm:py-2">
                      <span className="hidden sm:inline">Pipeline Dev</span>
                      <span className="sm:hidden">Pipeline</span>
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Scrollable Tab Content */}
                <ScrollArea className="flex-1 min-h-0 overflow-y-auto">
                  <div className="px-4 sm:px-6 pb-4 space-y-6">
                    <TabsContent value="basic-info" className="mt-0 space-y-0">
                      <BasicInfoTab formData={formData} onChange={handleFieldChange} />
                    </TabsContent>

                    <TabsContent value="media-tech" className="mt-0 space-y-0">
                      <MediaTechTab formData={formData} onChange={handleFieldChange} />
                    </TabsContent>

                    <TabsContent value="content" className="mt-0 space-y-0">
                      <ContentTab formData={formData} onChange={handleFieldChange} />
                    </TabsContent>

                    <TabsContent value="links" className="mt-0 space-y-0">
                      <LinksTab formData={formData} onChange={handleFieldChange} />
                    </TabsContent>

                    <TabsContent value="pipeline-dev" className="mt-0 space-y-0">
                      <PipelineDevTab formData={formData} onChange={handleFieldChange} />
                    </TabsContent>
                  </div>
                </ScrollArea>
              </Tabs>

              {/* Fixed Footer */}
              <div className="flex-shrink-0 flex flex-col-reverse sm:flex-row justify-between items-center gap-2 sm:gap-3 p-4 sm:p-6 pt-3 sm:pt-4 border-t bg-background">
                <div className="text-xs text-muted-foreground text-center sm:text-left">
                  {project?.id ? (
                    <span>Changes are automatically saved every 2 seconds</span>
                  ) : (
                    <span>New projects must be saved manually</span>
                  )}
                </div>
                <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={onClose}
                    className="w-full sm:w-auto h-9 sm:h-10 text-sm"
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2 w-full sm:w-auto h-9 sm:h-10 text-sm font-medium"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span className="hidden sm:inline">
                          {project ? 'Update Project' : 'Create Project'}
                        </span>
                        <span className="sm:hidden">
                          {project ? 'Update' : 'Create'}
                        </span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
