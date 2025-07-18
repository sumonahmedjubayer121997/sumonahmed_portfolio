
import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Save, Eye, EyeOff, Info } from "lucide-react";
import { 
  saveAndUpdateDynamicContent,
  listenDynamicContent
} from '@/integrations/firebase/firestore';
import EnhancedIconSelector from "@/components/EnhancedIconSelector";
import CategoryIconSelector from "@/components/CategoryIconSelector";
import RichTextEditor from "@/components/RichTextEditor";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PortfolioData {
  name: string;
  position: string;
  onlineLink: string;
  aboutMe: string;
  selectedIcons: string[];
}

const AdminHomeManager = () => {
  const [formData, setFormData] = useState<PortfolioData>({
    name: '',
    position: '',
    onlineLink: '',
    aboutMe: '',
    selectedIcons: []
  });
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [existingContent, setExistingContent] = useState(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [iconSelectorMode, setIconSelectorMode] = useState<'simple' | 'category'>('category');
  const { toast } = useToast();

  useEffect(() => {
    console.log('Setting up listener...');
    setIsInitialLoading(true);

    const unsubscribe = listenDynamicContent(
      'home',
      '7E1fmebGEixv8p2mjJfy',
      (data) => {
        if (data) {
          console.log('Live data received:', data);
          setExistingContent(data);

          const portfolioData = data.content as PortfolioData;
          setFormData({
            name: portfolioData.name || '',
            position: portfolioData.position || '',
            onlineLink: portfolioData.onlineLink || '',
            aboutMe: portfolioData.aboutMe || '',
            selectedIcons: portfolioData.selectedIcons || []
          });
        } else {
          console.log('Document does not exist or was deleted');
          setExistingContent(null);
          setFormData({
            name: '',
            position: '',
            onlineLink: '',
            aboutMe: '',
            selectedIcons: []
          });
        }
        setIsInitialLoading(false);
      },
      (error) => {
        console.error('Error with listener:', error);
        toast({
          title: "Error",
          description: "Failed to listen to content updates.",
          variant: "destructive"
        });
        setIsInitialLoading(false);
      }
    );

    return () => {
      console.log('Cleaning up listener...');
      unsubscribe();
    };

  }, []);

  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!formData.name.trim()) {
      errors.push("Name is required");
    }

    if (!formData.position.trim()) {
      errors.push("Position is required");
    }

    if (formData.onlineLink && !isValidUrl(formData.onlineLink)) {
      errors.push("Please enter a valid URL for the online link");
    }

    if (errors.length > 0) {
      toast({
        title: "Validation Error",
        description: errors.join(". "),
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSave = async () => {
    console.log('Save button clicked, form data:', formData);

    if (!validateForm()) {
      console.log('Validation failed');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Starting save process...');
      const collectionName = 'home';

      if (existingContent) {
        console.log('Updating existing content with ID:', existingContent.id);
        const { error } = await saveAndUpdateDynamicContent(collectionName, {
          title: 'Portfolio Information',
          content: formData,
          status: 'published',
        }, existingContent.id);

        if (error) {
          console.error('Update error:', error);
          throw new Error(error);
        }

        console.log('Content updated successfully');
        toast({
          title: 'Success!',
          description: 'Portfolio updated successfully!',
        });

      } else {
        console.log('Creating new content...');
        const { error } = await saveAndUpdateDynamicContent(collectionName, {
          title: 'Portfolio Information',
          content: formData,
          status: 'published',
        });

        if (error) {
          console.error('Create error:', error);
          throw new Error(error);
        }

        console.log('Content created successfully');
        toast({
          title: 'Success!',
          description: 'Portfolio created successfully!',
        });
      }

    } catch (error: any) {
      console.error('Save error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save portfolio. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof PortfolioData, value: string | string[]) => {
    console.log(`Updating field ${field} with value:`, value);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isInitialLoading) {
    return (
      <AdminLayout>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading portfolio information...</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Portfolio Information</h1>
            <p className="text-gray-600 mt-2">Manage your personal portfolio details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Edit Portfolio</CardTitle>
              <CardDescription>
                Update your personal information and portfolio details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <TooltipProvider>
                {/* Name Field */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="name">Name *</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info size={14} className="text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Your full name as displayed on your portfolio</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g. Sumon"
                    className="w-full"
                    disabled={isLoading}
                  />
                </div>

                {/* Position Field */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="position">Position *</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info size={14} className="text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Your professional title or role</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                    placeholder="e.g. Software Engineer"
                    className="w-full"
                    disabled={isLoading}
                  />
                </div>

                {/* Online Link Field */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="onlineLink">Online Link</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info size={14} className="text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Link to your online presence (website, LinkedIn, etc.)</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input
                    id="onlineLink"
                    type="url"
                    value={formData.onlineLink}
                    onChange={(e) => handleInputChange('onlineLink', e.target.value)}
                    placeholder="e.g. https://x.com/username"
                    className="w-full"
                    disabled={isLoading}
                  />
                </div>

                {/* About Me Field */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="aboutMe">About Me</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info size={14} className="text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Rich text description about yourself. Supports HTML formatting.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <RichTextEditor
                    value={formData.aboutMe}
                    onChange={(value) => handleInputChange('aboutMe', value)}
                    placeholder="I bring ideas to life through thoughtful engineering..."
                  />
                </div>

                {/* Icon Selector Mode Toggle */}
                <div className="space-y-2">
                  <Label>Technology & Social Icons</Label>
                  <Tabs value={iconSelectorMode} onValueChange={(value) => setIconSelectorMode(value as 'simple' | 'category')}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="category">Organized by Category</TabsTrigger>
                      <TabsTrigger value="simple">Simple Search</TabsTrigger>
                    </TabsList>
                    <TabsContent value="category">
                      <CategoryIconSelector
                        selectedIcons={formData.selectedIcons}
                        onIconsChange={(icons) => handleInputChange('selectedIcons', icons)}
                      />
                    </TabsContent>
                    <TabsContent value="simple">
                      <EnhancedIconSelector
                        selectedIcons={formData.selectedIcons}
                        onIconsChange={(icons) => handleInputChange('selectedIcons', icons)}
                      />
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Save Button */}
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="w-full flex items-center space-x-2"
                >
                  <Save size={16} />
                  <span>{isLoading ? 'Saving...' : (existingContent ? 'Update Portfolio' : 'Save Portfolio')}</span>
                </Button>
              </TooltipProvider>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8 flex">
          <div className="text-sm text-gray-500 mb-2">
           <Button
            onClick={() => setShowPreview(!showPreview)}
            variant="outline"
            className="flex items-center space-x-2"
            disabled={isLoading}
          >
            {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
            <span>{showPreview ? 'Hide Preview' : 'Show Preview'}</span>
          </Button>
          </div>
        </div>
        
         {/* Live Preview */}
          {showPreview && (
            <Card className="h-fit">
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
                <CardDescription>
                  See how your portfolio information will look
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold">{formData.name || 'Your Name'}</h2>
                  <p className="text-gray-600">{formData.position || 'Your Position'}</p>
                  {formData.onlineLink && (
                    <a 
                      href={formData.onlineLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Visit Profile
                    </a>
                  )}
                </div>
                
                {formData.aboutMe && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2">About Me</h3>
                    <div 
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: formData.aboutMe }}
                    />
                  </div>
                )}

                {formData.selectedIcons.length > 0 && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2">Skills & Social</h3>
                    <div className="flex flex-wrap gap-2">
                      {formData.selectedIcons.map((icon, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 rounded text-sm">
                          {icon}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
      </div>
    </AdminLayout>
  );
};

export default AdminHomeManager;
