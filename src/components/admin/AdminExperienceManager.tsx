
import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Eye, EyeOff, MoveUp, MoveDown } from "lucide-react";
import { toast } from "sonner";
import { getDynamicContent, saveAndUpdateDynamicContent, deleteDynamicContent } from "@/integrations/firebase/firestore";
import EnhancedRichContentEditor from "../editor/EnhancedRichContentEditor";

const experienceSchema = z.object({
  position: z.string().min(1, "Position is required"),
  company: z.string().min(1, "Company is required"),
  companyUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  description: z.string().min(1, "Description is required"),
  bullets: z.array(z.object({
    text: z.string().min(1, "Bullet point cannot be empty")
  })),
  techStack: z.array(z.object({
    name: z.string().min(1, "Tech name cannot be empty")
  })),
  badgeImage: z.string().optional(),
  badgeColor: z.enum(["blue", "green", "purple", "red", "yellow", "indigo"]),
  order: z.number().min(0),
  visible: z.boolean(),
});

type ExperienceFormData = z.infer<typeof experienceSchema>;

interface Experience extends ExperienceFormData {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
}

const AdminExperienceManager = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      position: "",
      company: "",
      companyUrl: "",
      startDate: "",
      endDate: "",
      description: "",
      bullets: [{ text: "" }],
      techStack: [{ name: "" }],
      badgeImage: "",
      badgeColor: "blue",
      order: 0,
      visible: true,
    },
  });

  const { fields: bulletFields, append: appendBullet, remove: removeBullet } = useFieldArray({
    control: form.control,
    name: "bullets",
  });

  const { fields: techFields, append: appendTech, remove: removeTech } = useFieldArray({
    control: form.control,
    name: "techStack",
  });

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const { data, error } = await getDynamicContent('experience');
      
      if (error) {
        console.error('Error fetching experiences:', error);
        toast.error('Failed to load experiences');
        return;
      }

      if (data && Array.isArray(data)) {
        const sortedExperiences = data.sort((a: Experience, b: Experience) => (a.order || 0) - (b.order || 0));
        setExperiences(sortedExperiences);
      }
    } catch (error) {
      console.error('Error fetching experiences:', error);
      toast.error('Failed to load experiences');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ExperienceFormData) => {
    try {
      const experienceData = {
        ...data,
        bullets: data.bullets.map(b => b.text).filter(text => text.trim() !== ""),
        techStack: data.techStack.map(t => t.name).filter(name => name.trim() !== ""),
        updatedAt: new Date().toISOString(),
        ...(editingExperience ? {} : { createdAt: new Date().toISOString() }),
      };

      const { error } = await saveAndUpdateDynamicContent(
        'experience',
        experienceData,
        editingExperience?.id
      );

      if (error) {
        toast.error('Failed to save experience');
        return;
      }

      toast.success(editingExperience ? 'Experience updated successfully' : 'Experience created successfully');
      setIsDialogOpen(false);
      setEditingExperience(null);
      form.reset();
      fetchExperiences();
    } catch (error) {
      console.error('Error saving experience:', error);
      toast.error('Failed to save experience');
    }
  };

  const handleEdit = (experience: Experience) => {
    setEditingExperience(experience);
    form.reset({
      position: experience.position || "",
      company: experience.company || "",
      companyUrl: experience.companyUrl || "",
      startDate: experience.startDate || "",
      endDate: experience.endDate || "",
      description: experience.description || "",
      bullets: experience.bullets?.map(bullet => ({ text: typeof bullet === 'string' ? bullet : bullet.text || '' })) || [{ text: "" }],
      techStack: experience.techStack?.map(tech => ({ name: typeof tech === 'string' ? tech : tech.name || '' })) || [{ name: "" }],
      badgeImage: experience.badgeImage || "",
      badgeColor: experience.badgeColor || "blue",
      order: experience.order || 0,
      visible: experience.visible !== false,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;

    try {
      const { error } = await deleteDynamicContent('experience', id);
      
      if (error) {
        toast.error('Failed to delete experience');
        return;
      }

      toast.success('Experience deleted successfully');
      fetchExperiences();
    } catch (error) {
      console.error('Error deleting experience:', error);
      toast.error('Failed to delete experience');
    }
  };

  const toggleVisibility = async (experience: Experience) => {
    try {
      const { error } = await saveAndUpdateDynamicContent(
        'experience',
        {
          ...experience,
          visible: !experience.visible,
          updatedAt: new Date().toISOString(),
        },
        experience.id
      );

      if (error) {
        toast.error('Failed to update visibility');
        return;
      }

      toast.success('Visibility updated');
      fetchExperiences();
    } catch (error) {
      console.error('Error updating visibility:', error);
      toast.error('Failed to update visibility');
    }
  };

  const updateOrder = async (experience: Experience, newOrder: number) => {
    try {
      const { error } = await saveAndUpdateDynamicContent(
        'experience',
        {
          ...experience,
          order: newOrder,
          updatedAt: new Date().toISOString(),
        },
        experience.id
      );

      if (error) {
        toast.error('Failed to update order');
        return;
      }

      fetchExperiences();
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    }
  };

  const getBadgeColorClass = (color: string) => {
    const colorMap = {
      blue: "bg-blue-100 text-blue-800",
      green: "bg-green-100 text-green-800",
      purple: "bg-purple-100 text-purple-800",
      red: "bg-red-100 text-red-800",
      yellow: "bg-yellow-100 text-yellow-800",
      indigo: "bg-indigo-100 text-indigo-800",
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const handleNewExperience = () => {
    setEditingExperience(null);
    form.reset({
      position: "",
      company: "",
      companyUrl: "",
      startDate: "",
      endDate: "",
      description: "",
      bullets: [{ text: "" }],
      techStack: [{ name: "" }],
      badgeImage: "",
      badgeColor: "blue",
      order: experiences.length,
      visible: true,
    });
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center py-12">
          <div className="text-lg text-gray-600">Loading experiences...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Experience Management</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleNewExperience}>
                <Plus className="w-4 h-4 mr-2" />
                Add Experience
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingExperience ? 'Edit Experience' : 'Add New Experience'}
                </DialogTitle>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="position"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Position *</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Frontend Developer" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company *</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., StartupXYZ" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="companyUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://company.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date *</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Mar 2024" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date *</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Current or Dec 2024" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

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
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description *</FormLabel>
                        <FormControl>
                         <EnhancedRichContentEditor
                            initialContent={field.value || ""}
                            onSave={(content) => field.onChange(content)}
                            placeholder="Describe your role and responsibilities"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div>
                    <Label className="text-sm font-medium">Bullet Points</Label>
                    {bulletFields.map((field, index) => (
                      <div key={field.id} className="flex items-center space-x-2 mt-2">
                        <FormField
                          control={form.control}
                          name={`bullets.${index}.text`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input placeholder="Achievement or task" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeBullet(index)}
                          disabled={bulletFields.length === 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => appendBullet({ text: "" })}
                      className="mt-2"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Bullet Point
                    </Button>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Tech Stack</Label>
                    {techFields.map((field, index) => (
                      <div key={field.id} className="flex items-center space-x-2 mt-2">
                        <FormField
                          control={form.control}
                          name={`techStack.${index}.name`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input placeholder="e.g., React" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeTech(index)}
                          disabled={techFields.length === 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => appendTech({ name: "" })}
                      className="mt-2"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Technology
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="badgeImage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Badge Image URL</FormLabel>
                          <FormControl>
                            <Input placeholder="Image URL or initial letter" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="badgeColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Badge Color</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="blue">Blue</SelectItem>
                              <SelectItem value="green">Green</SelectItem>
                              <SelectItem value="purple">Purple</SelectItem>
                              <SelectItem value="red">Red</SelectItem>
                              <SelectItem value="yellow">Yellow</SelectItem>
                              <SelectItem value="indigo">Indigo</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="visible"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Visible</FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Show this experience on the public page
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

                  <div className="flex justify-end space-x-4">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingExperience ? 'Update' : 'Create'} Experience
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Experience Entries ({experiences.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {experiences.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No experiences found</p>
                <Button onClick={handleNewExperience}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Experience
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Badge</TableHead>
                      <TableHead>Visible</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {experiences.map((experience, index) => (
                      <TableRow key={experience.id}>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <span className="text-sm font-medium">{experience.order}</span>
                            <div className="flex flex-col">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updateOrder(experience, experience.order! - 1)}
                                disabled={index === 0}
                                className="h-6 w-6 p-0"
                              >
                                <MoveUp className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updateOrder(experience, experience.order! + 1)}
                                disabled={index === experiences.length - 1}
                                className="h-6 w-6 p-0"
                              >
                                <MoveDown className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{experience.position}</TableCell>
                        <TableCell>
                          {experience.companyUrl ? (
                            <a
                              href={experience.companyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {experience.company}
                            </a>
                          ) : (
                            experience.company
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {experience.startDate} - {experience.endDate}
                        </TableCell>
                        <TableCell>
                          <Badge className={getBadgeColorClass(experience.badgeColor)}>
                            {experience.badgeImage?.length === 1 ? experience.badgeImage : experience.company?.[0] || 'C'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleVisibility(experience)}
                          >
                            {experience.visible ? (
                              <Eye className="h-4 w-4 text-green-600" />
                            ) : (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(experience)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(experience.id!)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminExperienceManager;
