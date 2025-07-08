
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { X, Plus, Upload } from "lucide-react";
import { Project } from "@/pages/AdminProjectsManager";
import { saveDynamicContent, updateDynamicContent } from "@/integrations/firebase/firestore";
import { uploadImage } from "@/integrations/firebase/storage";
import { useToast } from "@/hooks/use-toast";
import RichContentEditor from "@/components/RichContentEditor";

const projectSchema = z.object({
  order: z.number().min(0, "Order must be 0 or greater"),
  title: z.string().min(1, "Title is required"),
  status: z.enum(["draft", "published", "archived"]),
  version: z.string().optional(),
  type: z.enum(["Mobile", "Web", "Desktop"]),
  duration: z.string().min(1, "Duration is required"),
  demoLink: z.string().url().optional().or(z.literal("")),
  codeLink: z.string().url().optional().or(z.literal("")),
  downloadLink: z.string().url().optional().or(z.literal("")),
  screenshots: z.array(z.string()),
  technologies: z.array(z.string()),
  about: z.string().min(1, "About section is required"),
  features: z.array(z.string()),
  challenges: z.string().optional(),
  achievements: z.string().optional(),
  accessibility: z.string().optional(),
  visible: z.boolean(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project | null;
  mode: "add" | "edit";
  onSuccess: () => void;
}

const commonTechnologies = [
  "React", "TypeScript", "JavaScript", "Node.js", "Python", "Java", "C++", "C#",
  "Flutter", "React Native", "Swift", "Kotlin", "HTML", "CSS", "TailwindCSS",
  "Firebase", "MongoDB", "PostgreSQL", "MySQL", "Docker", "AWS", "Git"
];

export const ProjectModal = ({
  isOpen,
  onClose,
  project,
  mode,
  onSuccess,
}: ProjectModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [newTechnology, setNewTechnology] = useState("");
  const [newFeature, setNewFeature] = useState("");
  const [screenshotUrls, setScreenshotUrls] = useState<string[]>([]);
  const [uploadingScreenshots, setUploadingScreenshots] = useState(false);
  const { toast } = useToast();

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      order: 0,
      title: "",
      status: "draft",
      version: "",
      type: "Web",
      duration: "",
      demoLink: "",
      codeLink: "",
      downloadLink: "",
      screenshots: [],
      technologies: [],
      about: "",
      features: [],
      challenges: "",
      achievements: "",
      accessibility: "",
      visible: true,
    },
  });

  useEffect(() => {
    if (project && mode === "edit") {
      form.reset({
        order: project.order || 0,
        title: project.title,
        status: project.status,
        version: project.version || "",
        type: project.type,
        duration: project.duration,
        demoLink: project.demoLink || "",
        codeLink: project.codeLink || "",
        downloadLink: project.downloadLink || "",
        screenshots: project.screenshots || [],
        technologies: project.technologies || [],
        about: project.about,
        features: project.features || [],
        challenges: project.challenges || "",
        achievements: project.achievements || "",
        accessibility: project.accessibility || "",
        visible: project.visible !== undefined ? project.visible : true,
      });
      setScreenshotUrls(project.screenshots || []);
    } else {
      form.reset({
        order: 0,
        title: "",
        status: "draft",
        version: "",
        type: "Web",
        duration: "",
        demoLink: "",
        codeLink: "",
        downloadLink: "",
        screenshots: [],
        technologies: [],
        about: "",
        features: [],
        challenges: "",
        achievements: "",
        accessibility: "",
        visible: true,
      });
      setScreenshotUrls([]);
    }
  }, [project, mode, form]);

  const addTechnology = () => {
    if (newTechnology.trim()) {
      const currentTechs = form.getValues("technologies");
      if (!currentTechs.includes(newTechnology.trim())) {
        form.setValue("technologies", [...currentTechs, newTechnology.trim()]);
      }
      setNewTechnology("");
    }
  };

  const removeTechnology = (tech: string) => {
    const currentTechs = form.getValues("technologies");
    form.setValue("technologies", currentTechs.filter(t => t !== tech));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      const currentFeatures = form.getValues("features");
      form.setValue("features", [...currentFeatures, newFeature.trim()]);
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    const currentFeatures = form.getValues("features");
    form.setValue("features", currentFeatures.filter((_, i) => i !== index));
  };

  const handleScreenshotUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setUploadingScreenshots(true);
    try {
      const uploadPromises = Array.from(files).map(file => uploadImage(file, 'projects'));
      const urls = await Promise.all(uploadPromises);
      
      const newUrls = [...screenshotUrls, ...urls];
      setScreenshotUrls(newUrls);
      form.setValue("screenshots", newUrls);
      
      toast({
        title: "Success",
        description: `${urls.length} screenshot(s) uploaded successfully`,
      });
    } catch (error) {
      console.error('Error uploading screenshots:', error);
      toast({
        title: "Error",
        description: "Failed to upload screenshots",
        variant: "destructive",
      });
    } finally {
      setUploadingScreenshots(false);
    }
  };

  const removeScreenshot = (index: number) => {
    const newUrls = screenshotUrls.filter((_, i) => i !== index);
    setScreenshotUrls(newUrls);
    form.setValue("screenshots", newUrls);
  };

  const onSubmit = async (data: ProjectFormData) => {
    setIsLoading(true);
    try {
      const projectData = {
        ...data,
        createdAt: project?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (mode === "edit" && project) {
        const { error } = await updateDynamicContent('projects', project.id, projectData);
        if (error) throw new Error(error);
        
        toast({
          title: "Success",
          description: "Project updated successfully",
        });
      } else {
        const { error } = await saveDynamicContent('projects', projectData);
        if (error) throw new Error(error);
        
        toast({
          title: "Success",
          description: "Project created successfully",
        });
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error saving project:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save project",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Edit Project" : "Add New Project"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit" 
              ? "Update the project information below"
              : "Fill in the details to create a new project"
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="version"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Version</FormLabel>
                    <FormControl>
                      <Input placeholder="1.0.0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <FormControl>
                      <Input placeholder="2 months" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Mobile">Mobile</SelectItem>
                        <SelectItem value="Web">Web</SelectItem>
                        <SelectItem value="Desktop">Desktop</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="demoLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Demo Link</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="codeLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code Link</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="downloadLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Download Link</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Screenshots */}
            <div>
              <FormLabel>Screenshots</FormLabel>
              <div className="mt-2">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleScreenshotUpload}
                  className="hidden"
                  id="screenshot-upload"
                />
                <label htmlFor="screenshot-upload">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center gap-2"
                    disabled={uploadingScreenshots}
                    asChild
                  >
                    <span>
                      <Upload className="h-4 w-4" />
                      {uploadingScreenshots ? "Uploading..." : "Upload Screenshots"}
                    </span>
                  </Button>
                </label>
                
                {screenshotUrls.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {screenshotUrls.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Screenshot ${index + 1}`}
                          className="w-full h-20 object-cover rounded-md border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                          onClick={() => removeScreenshot(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Technologies */}
            <div>
              <FormLabel>Technologies</FormLabel>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Add technology..."
                  value={newTechnology}
                  onChange={(e) => setNewTechnology(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                />
                <Button type="button" onClick={addTechnology}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {commonTechnologies.map((tech) => (
                  <Button
                    key={tech}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const currentTechs = form.getValues("technologies");
                      if (!currentTechs.includes(tech)) {
                        form.setValue("technologies", [...currentTechs, tech]);
                      }
                    }}
                    className="h-8"
                  >
                    {tech}
                  </Button>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {form.watch("technologies").map((tech, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tech}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeTechnology(tech)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* About Section */}
            <FormField
              control={form.control}
              name="about"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>About</FormLabel>
                  <FormControl>
                    <RichContentEditor
                      initialContent={field.value}
                      onSave={(content) => field.onChange(content)}
                      placeholder="Describe the project..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Features */}
            <div>
              <FormLabel>Features</FormLabel>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Add feature..."
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                />
                <Button type="button" onClick={addFeature}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-2 mt-2">
                {form.watch("features").map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 border rounded">
                    <span className="flex-1">{feature}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFeature(index)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Rich Text Fields */}
            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="challenges"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Challenges</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe challenges faced..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="achievements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Achievements</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe achievements..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accessibility"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Accessibility</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe accessibility features..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Visibility Toggle */}
            <FormField
              control={form.control}
              name="visible"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Visible</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Make this project visible on the website
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : mode === "edit" ? "Update Project" : "Create Project"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
