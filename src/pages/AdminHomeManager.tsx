
import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Save, Eye, EyeOff, Info } from "lucide-react";
import { 
  getContentByPageType, 
  createContent, 
  updateContent,
  ContentType,
  ContentItem 
} from '@/integrations/firebase/firestore';
import IconSelector from "@/components/IconSelector";
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
  const [existingContent, setExistingContent] = useState<ContentItem | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchExistingContent();
  }, []);

  const fetchExistingContent = async () => {
    try {
      const contents = await getContentByPageType('home');
      if (contents.length > 0) {
        const content = contents[0];
        setExistingContent(content);
        const data = content.content as PortfolioData;
        setFormData({
          name: data.name || '',
          position: data.position || '',
          onlineLink: data.onlineLink || '',
          aboutMe: data.aboutMe || '',
          selectedIcons: data.selectedIcons || []
        });
      }
    } catch (error: any) {
      console.error('Error fetching content:', error);
    }
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Name is required",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.position.trim()) {
      toast({
        title: "Validation Error",
        description: "Position is required",
        variant: "destructive",
      });
      return false;
    }

    if (formData.onlineLink && !isValidUrl(formData.onlineLink)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid URL",
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
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      if (existingContent) {
        const { error } = await updateContent(existingContent.id, {
          title: 'Portfolio Information',
          content: formData,
          status: 'published',
        });

        if (error) throw new Error(error);
        toast({ title: "Portfolio updated successfully!" });
      } else {
        const { error } = await createContent({
          page_type: 'home',
          title: 'Portfolio Information',
          content: formData,
          status: 'published'
        });

        if (error) throw new Error(error);
        toast({ title: "Portfolio created successfully!" });
        fetchExistingContent();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof PortfolioData, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Portfolio Information</h1>
            <p className="text-gray-600 mt-2">Manage your personal portfolio details</p>
          </div>
          <Button
            onClick={() => setShowPreview(!showPreview)}
            variant="outline"
            className="flex items-center space-x-2"
          >
            {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
            <span>{showPreview ? 'Hide Preview' : 'Show Preview'}</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

                {/* Icons Selector */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Label>Technology & Social Icons</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info size={14} className="text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Select icons representing your skills and social presence</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <IconSelector
                    selectedIcons={formData.selectedIcons}
                    onIconsChange={(icons) => handleInputChange('selectedIcons', icons)}
                  />
                </div>

                {/* Save Button */}
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="w-full flex items-center space-x-2"
                >
                  <Save size={16} />
                  <span>{isLoading ? 'Saving...' : 'Save Portfolio'}</span>
                </Button>
              </TooltipProvider>
            </CardContent>
          </Card>

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
      </div>
    </AdminLayout>
  );
};

export default AdminHomeManager;
