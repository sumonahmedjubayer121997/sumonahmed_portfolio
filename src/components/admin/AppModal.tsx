import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, Upload, Link as LinkIcon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import RichContentEditor from '@/components/RichContentEditor';
import TechnologySelector from '@/components/admin/TechnologySelector';
import ScreenshotUploader from '@/components/admin/ScreenshotUploader';
import { saveAndUpdateDynamicContent } from '@/integrations/firebase/firestore';
import type { AppItem } from '@/pages/AdminAppsManager';

const appSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  status: z.enum(['draft', 'published', 'archived']),
  version: z.string().min(1, 'Version is required'),
  type: z.enum(['mobile', 'web', 'desktop']),
  duration: z.string().min(1, 'Duration is required'),
  demoLink: z.string().url().optional().or(z.literal('')),
  codeLink: z.string().url().optional().or(z.literal('')),
  downloadLink: z.string().url().optional().or(z.literal('')),
  order: z.number().min(0, 'Order must be a positive number'),
  visible: z.boolean(),
});

type AppFormData = z.infer<typeof appSchema>;

interface AppModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingApp: AppItem | null;
}

const AppModal: React.FC<AppModalProps> = ({ isOpen, onClose, editingApp }) => {
  const [saving, setSaving] = useState(false);
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [richTextFields, setRichTextFields] = useState({
    about: '',
    features: '',
    challenges: '',
    achievements: '',
    accessibility: '',
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AppFormData>({
    resolver: zodResolver(appSchema),
    defaultValues: {
      title: '',
      status: 'draft',
      version: '1.0.0',
      type: 'web',
      duration: '',
      demoLink: '',
      codeLink: '',
      downloadLink: '',
      order: 0,
      visible: true,
    },
  });

  useEffect(() => {
    if (editingApp) {
      reset({
        title: editingApp.title,
        status: editingApp.status,
        version: editingApp.version,
        type: editingApp.type,
        duration: editingApp.duration,
        demoLink: editingApp.demoLink || '',
        codeLink: editingApp.codeLink || '',
        downloadLink: editingApp.downloadLink || '',
        order: editingApp.order,
        visible: editingApp.visible !== false,
      });
      setScreenshots(editingApp.screenshots || []);
      setTechnologies(editingApp.technologies || []);
      setRichTextFields({
        about: editingApp.about || '',
        features: editingApp.features || '',
        challenges: editingApp.challenges || '',
        achievements: editingApp.achievements || '',
        accessibility: editingApp.accessibility || '',
      });
    } else {
      reset();
      setScreenshots([]);
      setTechnologies([]);
      setRichTextFields({
        about: '',
        features: '',
        challenges: '',
        achievements: '',
        accessibility: '',
      });
    }
  }, [editingApp, reset]);

  const onSubmit = async (data: AppFormData) => {
    setSaving(true);
    
    try {
      const appData = {
        ...data,
        screenshots,
        technologies,
        ...richTextFields,
        updatedAt: new Date().toISOString(),
        ...(editingApp ? {} : { createdAt: new Date().toISOString() }),
      };

      const { error } = await saveAndUpdateDynamicContent(
        'apps',
        appData,
        editingApp?.id
      );

      if (error) throw new Error(error);

      toast.success(editingApp ? 'App updated successfully' : 'App created successfully');
      onClose();
    } catch (error) {
      console.error('Error saving app:', error);
      toast.error('Failed to save app');
    } finally {
      setSaving(false);
    }
  };

  const handleRichTextChange = (field: keyof typeof richTextFields, content: string) => {
    setRichTextFields(prev => ({ ...prev, [field]: content }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {editingApp ? 'Edit App' : 'Add New App'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
          <Tabs defaultValue="basic" className="flex flex-col flex-1 overflow-hidden">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="media">Media & Tech</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="links">Links</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto">
              <TabsContent value="basic" className="space-y-4 p-1">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Controller
                      name="title"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="title"
                          placeholder="Enter app title"
                          className={errors.title ? 'border-red-500' : ''}
                        />
                      )}
                    />
                    {errors.title && (
                      <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="version">Version *</Label>
                    <Controller
                      name="version"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="version"
                          placeholder="e.g., 1.0.0"
                          className={errors.version ? 'border-red-500' : ''}
                        />
                      )}
                    />
                    {errors.version && (
                      <p className="text-sm text-red-500 mt-1">{errors.version.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="status">Status *</Label>
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div>
                    <Label htmlFor="type">Type *</Label>
                    <Controller
                      name="type"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mobile">Mobile</SelectItem>
                            <SelectItem value="web">Web</SelectItem>
                            <SelectItem value="desktop">Desktop</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div>
                    <Label htmlFor="duration">Duration *</Label>
                    <Controller
                      name="duration"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="duration"
                          placeholder="e.g., 3 months, 2 weeks"
                          className={errors.duration ? 'border-red-500' : ''}
                        />
                      )}
                    />
                    {errors.duration && (
                      <p className="text-sm text-red-500 mt-1">{errors.duration.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="order">Order</Label>
                    <Controller
                      name="order"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="order"
                          type="number"
                          min="0"
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          className={errors.order ? 'border-red-500' : ''}
                        />
                      )}
                    />
                    {errors.order && (
                      <p className="text-sm text-red-500 mt-1">{errors.order.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Controller
                    name="visible"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        id="visible"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <Label htmlFor="visible">Visible to public</Label>
                </div>
              </TabsContent>

              <TabsContent value="media" className="space-y-4 p-1">
                <div>
                  <Label>Screenshots</Label>
                  <ScreenshotUploader
                    screenshots={screenshots}
                    onScreenshotsChange={setScreenshots}
                  />
                </div>

                <div>
                  <Label>Technologies</Label>
                  <TechnologySelector
                    selectedTechnologies={technologies}
                    onTechnologiesChange={setTechnologies}
                  />
                </div>
              </TabsContent>

              <TabsContent value="content" className="space-y-4 p-1">
                <div>
                  <Label>About</Label>
                  <RichContentEditor
                    initialContent={richTextFields.about}
                    onSave={(content) => handleRichTextChange('about', content)}
                    placeholder="Describe the app..."
                  />
                </div>

                <div>
                  <Label>Features</Label>
                  <RichContentEditor
                    initialContent={richTextFields.features}
                    onSave={(content) => handleRichTextChange('features', content)}
                    placeholder="List the key features..."
                  />
                </div>

                <div>
                  <Label>Challenges</Label>
                  <RichContentEditor
                    initialContent={richTextFields.challenges}
                    onSave={(content) => handleRichTextChange('challenges', content)}
                    placeholder="Describe challenges faced..."
                  />
                </div>

                <div>
                  <Label>Achievements</Label>
                  <RichContentEditor
                    initialContent={richTextFields.achievements}
                    onSave={(content) => handleRichTextChange('achievements', content)}
                    placeholder="Highlight achievements..."
                  />
                </div>

                <div>
                  <Label>Accessibility</Label>
                  <RichContentEditor
                    initialContent={richTextFields.accessibility}
                    onSave={(content) => handleRichTextChange('accessibility', content)}
                    placeholder="Describe accessibility features..."
                  />
                </div>
              </TabsContent>

              <TabsContent value="links" className="space-y-4 p-1">
                <div>
                  <Label htmlFor="demoLink">Demo Link</Label>
                  <Controller
                    name="demoLink"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="demoLink"
                        type="url"
                        placeholder="https://demo.example.com"
                        className={errors.demoLink ? 'border-red-500' : ''}
                      />
                    )}
                  />
                  {errors.demoLink && (
                    <p className="text-sm text-red-500 mt-1">{errors.demoLink.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="codeLink">Code Link</Label>
                  <Controller
                    name="codeLink"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="codeLink"
                        type="url"
                        placeholder="https://github.com/username/repo"
                        className={errors.codeLink ? 'border-red-500' : ''}
                      />
                    )}
                  />
                  {errors.codeLink && (
                    <p className="text-sm text-red-500 mt-1">{errors.codeLink.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="downloadLink">Download Link</Label>
                  <Controller
                    name="downloadLink"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="downloadLink"
                        type="url"
                        placeholder="https://download.example.com"
                        className={errors.downloadLink ? 'border-red-500' : ''}
                      />
                    )}
                  />
                  {errors.downloadLink && (
                    <p className="text-sm text-red-500 mt-1">{errors.downloadLink.message}</p>
                  )}
                </div>
              </TabsContent>
            </div>
          </Tabs>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : editingApp ? 'Update App' : 'Create App'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AppModal;