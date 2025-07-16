
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AdminLayout from "@/components/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, Eye, EyeOff, Upload, Search } from "lucide-react";
import { toast } from "sonner";
import { getDynamicContent, saveAndUpdateDynamicContent, deleteDynamicContent } from "@/integrations/firebase/firestore";
import { uploadImage } from "@/integrations/firebase/storage";

const toolSchema = z.object({
  name: z.string().min(1, "Tool name is required"),
  category: z.string().min(1, "Category is required"),
  logo: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  order: z.number().min(0, "Order must be 0 or greater"),
  visible: z.boolean(),
});

type ToolFormData = z.infer<typeof toolSchema>;

interface Tool extends ToolFormData {
  id: string;
  createdAt: string;
  updatedAt: string;
}

const AdminToolsManager = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [uploading, setUploading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>("");

  const form = useForm<ToolFormData>({
    resolver: zodResolver(toolSchema),
    defaultValues: {
      name: "",
      category: "",
      logo: "",
      url: "",
      order: 0,
      visible: true,
    },
  });

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    try {
      setLoading(true);
      const { data, error } = await getDynamicContent("tools");
      
      if (error) {
        console.error("Error fetching tools:", error);
        toast.error("Failed to fetch tools");
        return;
      }

      if (data && Array.isArray(data)) {
        const sortedTools = data
          .map(tool => ({
            ...tool,
            createdAt: tool.createdAt || new Date().toISOString(),
            updatedAt: tool.updatedAt || new Date().toISOString(),
          }))
          .sort((a, b) => (a.order || 0) - (b.order || 0));
        setTools(sortedTools);
      }
    } catch (error) {
      console.error("Error fetching tools:", error);
      toast.error("Failed to fetch tools");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);
      const fileName = `${Date.now()}-${file.name}`;
      const logoUrl = await uploadImage(file, `tools/logos/${fileName}`);
      
      form.setValue("logo", logoUrl);
      setLogoPreview(logoUrl);
      toast.success("Logo uploaded successfully!");
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast.error("Failed to upload logo");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: ToolFormData) => {
    try {
      const timestamp = new Date().toISOString();
      const toolData = {
        ...data,
        updatedAt: timestamp,
        ...(editingTool ? {} : { createdAt: timestamp }),
      };

      const { error } = await saveAndUpdateDynamicContent(
        "tools",
        toolData,
        editingTool?.id
      );

      if (error) {
        toast.error("Failed to save tool");
        return;
      }

      toast.success(
        editingTool ? "Tool updated successfully!" : "Tool created successfully!"
      );
      
      setDialogOpen(false);
      resetForm();
      await fetchTools();
    } catch (error) {
      console.error("Error saving tool:", error);
      toast.error("Failed to save tool");
    }
  };

  const handleEdit = (tool: Tool) => {
    setEditingTool(tool);
    form.reset({
      name: tool.name,
      category: tool.category,
      logo: tool.logo || "",
      url: tool.url || "",
      order: tool.order,
      visible: tool.visible,
    });
    setLogoPreview(tool.logo || "");
    setDialogOpen(true);
  };

  const handleDelete = async (toolId: string) => {
    if (!confirm("Are you sure you want to delete this tool?")) return;

    try {
      const { error } = await deleteDynamicContent("tools", toolId);
      
      if (error) {
        toast.error("Failed to delete tool");
        return;
      }

      toast.success("Tool deleted successfully!");
      await fetchTools();
    } catch (error) {
      console.error("Error deleting tool:", error);
      toast.error("Failed to delete tool");
    }
  };

  const resetForm = () => {
    setEditingTool(null);
    setLogoPreview("");
    form.reset({
      name: "",
      category: "",
      logo: "",
      url: "",
      order: 0,
      visible: true,
    });
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    resetForm();
  };

  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getNextOrder = () => {
    return tools.length > 0 ? Math.max(...tools.map(t => t.order || 0)) + 1 : 0;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tools Management</h1>
            <p className="text-gray-600 mt-2">
              Manage tools and apps displayed in the "Shovels" section
            </p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                resetForm();
                form.setValue("order", getNextOrder());
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Tool
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingTool ? "Edit Tool" : "Add New Tool"}
                </DialogTitle>
                <DialogDescription>
                  {editingTool 
                    ? "Update the tool information below." 
                    : "Fill in the details to add a new tool."}
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tool Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., ChatGPT" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Productivity, IDE, Design" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Logo</label>
                    <div className="flex items-center gap-4">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file);
                        }}
                        disabled={uploading}
                      />
                      {uploading && (
                        <div className="text-sm text-gray-500">Uploading...</div>
                      )}
                    </div>
                    {logoPreview && (
                      <div className="flex items-center gap-2">
                        <img
                          src={logoPreview}
                          alt="Logo preview"
                          className="w-12 h-12 object-contain border rounded"
                        />
                        <span className="text-sm text-gray-600">Preview</span>
                      </div>
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website URL (optional)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://example.com" 
                            {...field} 
                          />
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
                        <FormLabel>Display Order</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
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
                    name="visible"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <FormLabel>Visible on public page</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="flex-1">
                      {editingTool ? "Update Tool" : "Add Tool"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleDialogClose}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Tools ({tools.length})
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search tools..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>
            </CardTitle>
            <CardDescription>
              Manage your personal tools and applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="text-gray-500">Loading tools...</div>
              </div>
            ) : filteredTools.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-500">
                  {searchTerm ? "No tools found matching your search." : "No tools created yet."}
                </div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Logo</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTools.map((tool) => (
                    <TableRow key={tool.id}>
                      <TableCell>
                        {tool.logo ? (
                          <img
                            src={tool.logo}
                            alt={tool.name}
                            className="w-8 h-8 object-contain"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-xs">
                            {tool.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {tool.url ? (
                          <a
                            href={tool.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {tool.name}
                          </a>
                        ) : (
                          tool.name
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{tool.category}</Badge>
                      </TableCell>
                      <TableCell>{tool.order}</TableCell>
                      <TableCell>
                        {tool.visible ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            <Eye className="h-3 w-3 mr-1" />
                            Visible
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                            <EyeOff className="h-3 w-3 mr-1" />
                            Hidden
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(tool)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(tool.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminToolsManager;
