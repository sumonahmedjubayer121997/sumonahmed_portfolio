
import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import AdminLayout from '@/components/admin/AdminLayout';
import RichContentEditor from '@/components/RichContentEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Save, RotateCcw, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  getDynamicContent, 
  saveAndUpdateDynamicContent,
  listenDynamicContent 
} from '@/integrations/firebase/firestore';

// Zod schema for form validation
const aboutSchema = z.object({
  tagline: z.string().optional(),
  bio: z.string().min(1, 'Bio is required'),
  quote: z.string().optional(),
  techStack: z.array(z.string()).default([]),
  milestones: z.array(z.object({
    year: z.string().min(1, 'Year is required'),
    text: z.string().min(1, 'Text is required')
  })).default([]),
  socialLinks: z.array(z.object({
    title: z.string().min(1, 'Title is required'),
    url: z.string().url('Must be a valid URL'),
    icon: z.string().optional()
  })).default([])
});

type AboutFormData = z.infer<typeof aboutSchema>;

const AdminAboutManager = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aboutId, setAboutId] = useState<string | null>(null);
  const [techStackInput, setTechStackInput] = useState('');
  const { toast } = useToast();

  const form = useForm<AboutFormData>({
    resolver: zodResolver(aboutSchema),
    defaultValues: {
      tagline: '',
      bio: '',
      quote: '',
      techStack: [],
      milestones: [],
      socialLinks: []
    }
  });

  const { fields: milestoneFields, append: appendMilestone, remove: removeMilestone } = useFieldArray({
    control: form.control,
    name: 'milestones'
  });

  const { fields: socialFields, append: appendSocial, remove: removeSocial } = useFieldArray({
    control: form.control,
    name: 'socialLinks'
  });

  // Load existing data on component mount
  useEffect(() => {
    const loadAboutData = async () => {
      try {
        setLoading(true);
        const { data, error } = await getDynamicContent('about');
        
        if (error) {
          console.error('Error fetching about data:', error);
          toast({
            title: 'Error',
            description: 'Failed to load about data',
            variant: 'destructive'
          });
          return;
        }

        if (data && Array.isArray(data) && data.length > 0) {
          const aboutData = data[0];
          setAboutId(aboutData.id);
          
          // Reset form with fetched data
          form.reset({
            tagline: aboutData.tagline || '',
            bio: aboutData.bio || '',
            quote: aboutData.quote || '',
            techStack: aboutData.techStack || [],
            milestones: aboutData.milestones || [],
            socialLinks: aboutData.socialLinks || []
          });
        }
      } catch (error) {
        console.error('Error loading about data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load about data',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    loadAboutData();
  }, [form, toast]);

  // Handle form submission
  const onSubmit = async (data: AboutFormData) => {
    try {
      setSaving(true);
      
      const aboutData = {
        ...data,
        lastUpdated: new Date().toISOString()
      };

      const { error } = await saveAndUpdateDynamicContent(
        'about',
        aboutData,
        aboutId || undefined
      );

      if (error) {
        throw new Error(error);
      }

      toast({
        title: 'Success',
        description: 'About page updated successfully!'
      });

      // If this was a new document, fetch the ID
      if (!aboutId) {
        const { data: updatedData } = await getDynamicContent('about');
        if (updatedData && Array.isArray(updatedData) && updatedData.length > 0) {
          setAboutId(updatedData[0].id);
        }
      }
    } catch (error: any) {
      console.error('Error saving about data:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save about data',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle tech stack management
  const addTechStack = () => {
    if (techStackInput.trim()) {
      const currentTechStack = form.getValues('techStack');
      form.setValue('techStack', [...currentTechStack, techStackInput.trim()]);
      setTechStackInput('');
    }
  };

  const removeTechStack = (index: number) => {
    const currentTechStack = form.getValues('techStack');
    form.setValue('techStack', currentTechStack.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    form.reset();
    setTechStackInput('');
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2 text-lg">Loading about data...</span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">About Page Manager</h1>
            <p className="text-gray-600 mt-1">Manage your about page content</p>
          </div>
          <div className="flex space-x-2">
            <Button 
              onClick={resetForm} 
              variant="outline"
              disabled={saving}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button 
              onClick={form.handleSubmit(onSubmit)}
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="tagline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tagline</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="AI Product Engineer • Startup Builder"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quote"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quote/Philosophy</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Your personal philosophy or inspiring quote"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Bio Section */}
            <Card>
              <CardHeader>
                <CardTitle>Bio</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Biography *</FormLabel>
                      <FormControl>
                        <RichContentEditor
                          initialContent={field.value}
                          onSave={(content) => field.onChange(content)}
                          placeholder="Write your biography here..."
                          autoSave={false}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Tech Stack */}
            <Card>
              <CardHeader>
                <CardTitle>Tech Stack</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add technology (e.g., React, Firebase, LLMs)"
                    value={techStackInput}
                    onChange={(e) => setTechStackInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechStack())}
                  />
                  <Button type="button" onClick={addTechStack}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {form.watch('techStack').map((tech, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center space-x-1"
                    >
                      <span>{tech}</span>
                      <button
                        type="button"
                        onClick={() => removeTechStack(index)}
                        className="ml-1 hover:text-red-500"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Milestones */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Milestones
                  <Button
                    type="button"
                    onClick={() => appendMilestone({ year: '', text: '' })}
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Milestone
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {milestoneFields.map((field, index) => (
                  <div key={field.id} className="flex space-x-4 items-start">
                    <FormField
                      control={form.control}
                      name={`milestones.${index}.year`}
                      render={({ field }) => (
                        <FormItem className="w-24">
                          <FormLabel>Year</FormLabel>
                          <FormControl>
                            <Input placeholder="2024" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`milestones.${index}.text`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Achievement</FormLabel>
                          <FormControl>
                            <Input placeholder="Founded startup, launched product..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeMilestone(index)}
                      className="mt-6"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Social Links
                  <Button
                    type="button"
                    onClick={() => appendSocial({ title: '', url: '', icon: '' })}
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Social Link
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {socialFields.map((field, index) => (
                  <div key={field.id} className="flex space-x-4 items-start">
                    <FormField
                      control={form.control}
                      name={`socialLinks.${index}.title`}
                      render={({ field }) => (
                        <FormItem className="w-32">
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="LinkedIn" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`socialLinks.${index}.url`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://linkedin.com/in/..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`socialLinks.${index}.icon`}
                      render={({ field }) => (
                        <FormItem className="w-32">
                          <FormLabel>Icon</FormLabel>
                          <FormControl>
                            <Input placeholder="linkedin" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeSocial(index)}
                      className="mt-6"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
    </AdminLayout>
  );
};

export default AdminAboutManager;
