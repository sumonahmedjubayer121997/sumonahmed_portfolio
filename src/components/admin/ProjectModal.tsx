import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import RichContentEditor from "@/components/RichContentEditor";
import TechnologySelector from "@/components/admin/TechnologySelector";
import ScreenshotUploader from "@/components/admin/ScreenshotUploader";
import { saveAndUpdateDynamicContent } from "@/integrations/firebase/firestore";
import type { ProjectItem } from "@/pages/admin_pages/AdminProjectsManager";
const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  status: z.enum(["draft", "published", "archived"]),
  version: z.string().min(1, "Version is required"),
  type: z.enum(["mobile", "web", "desktop"]),
  duration: z.string().min(1, "Duration is required"),
  demoLink: z.string().url().optional().or(z.literal("")),
  codeLink: z.string().url().optional().or(z.literal("")),
  downloadLink: z.string().url().optional().or(z.literal("")),
  order: z.number().min(0, "Order must be a positive number"),
  visible: z.boolean(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingProject: ProjectItem | null;
}

const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  editingProject,
}) => {
  const [saving, setSaving] = useState(false);
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [richTextFields, setRichTextFields] = useState({
    about: "",
    features: "",
    challenges: "",
    achievements: "",
    accessibility: "",
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      status: "draft",
      version: "1.0.0",
      type: "web",
      duration: "",
      demoLink: "",
      codeLink: "",
      downloadLink: "",
      order: 0,
      visible: true,
    },
  });

  useEffect(() => {
    if (editingProject) {
      reset({
        title: editingProject.title,
        status: editingProject.status,
        version: editingProject.version,
        type: editingProject.type,
        duration: editingProject.duration,
        demoLink: editingProject.demoLink || "",
        codeLink: editingProject.codeLink || "",
        downloadLink: editingProject.downloadLink || "",
        order: editingProject.order,
        visible: editingProject.visible !== false,
      });
      setScreenshots(editingProject.screenshots || []);
      setTechnologies(editingProject.technologies || []);
      setRichTextFields({
        about: editingProject.about || "",
        features: editingProject.features || "",
        challenges: editingProject.challenges || "",
        achievements: editingProject.achievements || "",
        accessibility: editingProject.accessibility || "",
      });
    } else {
      reset();
      setScreenshots([]);
      setTechnologies([]);
      setRichTextFields({
        about: "",
        features: "",
        challenges: "",
        achievements: "",
        accessibility: "",
      });
    }
  }, [editingProject, reset]);

  const onSubmit = async (data: ProjectFormData) => {
    setSaving(true);

    try {
      const projectData = {
        ...data,
        screenshots,
        technologies,
        ...richTextFields,
        updatedAt: new Date().toISOString(),
        ...(editingProject ? {} : { createdAt: new Date().toISOString() }),
      };

      const { error } = await saveAndUpdateDynamicContent(
        "projects",
        projectData,
        editingProject?.id
      );

      if (error) throw new Error(error);

      toast.success(
        editingProject
          ? "Project updated successfully"
          : "Project created successfully"
      );
      onClose();
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error("Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  const handleRichTextChange = (
    field: keyof typeof richTextFields,
    content: string
  ) => {
    setRichTextFields((prev) => ({ ...prev, [field]: content }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {editingProject ? "Edit Project" : "Add New Project"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <Tabs
            defaultValue="basic"
            className="flex flex-col flex-1 overflow-hidden"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="media">Media & Tech</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="links">Links</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto">
              {/* Basic Info Tab */}
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
                          placeholder="Enter project title"
                          className={errors.title ? "border-red-500" : ""}
                        />
                      )}
                    />
                    {errors.title && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.title.message}
                      </p>
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
                          className={errors.version ? "border-red-500" : ""}
                        />
                      )}
                    />
                    {errors.version && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.version.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="status">Status *</Label>
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
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
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
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
                          placeholder="e.g., 3 months"
                          className={errors.duration ? "border-red-500" : ""}
                        />
                      )}
                    />
                    {errors.duration && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.duration.message}
                      </p>
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
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                          className={errors.order ? "border-red-500" : ""}
                        />
                      )}
                    />
                    {errors.order && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.order.message}
                      </p>
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

              {/* Media Tab */}
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

              {/* Content Tab */}
              <TabsContent value="content" className="space-y-4 p-1">
                {Object.entries(richTextFields).map(([field, content]) => (
                  <div key={field}>
                    <Label className="capitalize">{field}</Label>
                    <RichContentEditor
                      initialContent={content}
                      onSave={(html) =>
                        handleRichTextChange(
                          field as keyof typeof richTextFields,
                          html
                        )
                      }
                      placeholder={`Enter ${field}...`}
                    />
                  </div>
                ))}
              </TabsContent>

              {/* Links Tab */}
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
                        className={errors.demoLink ? "border-red-500" : ""}
                      />
                    )}
                  />
                  {errors.demoLink && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.demoLink.message}
                    </p>
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
                        className={errors.codeLink ? "border-red-500" : ""}
                      />
                    )}
                  />
                  {errors.codeLink && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.codeLink.message}
                    </p>
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
                        className={errors.downloadLink ? "border-red-500" : ""}
                      />
                    )}
                  />
                  {errors.downloadLink && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.downloadLink.message}
                    </p>
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
              {saving
                ? "Saving..."
                : editingProject
                ? "Update Project"
                : "Create Project"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectModal;
