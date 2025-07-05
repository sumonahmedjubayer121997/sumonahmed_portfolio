
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { 
  getContentByPageType, 
  createContent, 
  updateContent, 
  deleteContent,
  ContentType,
  ContentItem 
} from '@/integrations/firebase/firestore';

const AdminContentManager = () => {
  const { pageType } = useParams();
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    status: 'draft'
  });
  const { toast } = useToast();

  // Validate pageType
  const validPageTypes: ContentType[] = ['home', 'experience', 'apps', 'projects', 'blogs', 'about', 'contact'];
  const isValidPageType = (type: string | undefined): type is ContentType => {
    return type !== undefined && validPageTypes.includes(type as ContentType);
  };

  const currentPageType = isValidPageType(pageType) ? pageType : null;

  useEffect(() => {
    if (currentPageType) {
      fetchContents();
    }
  }, [currentPageType]);

  const fetchContents = async () => {
    if (!currentPageType) return;
    
    try {
      const data = await getContentByPageType(currentPageType);
      setContents(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    if (!currentPageType) return;

    try {
      if (editingId) {
        // Update existing content
        const { error } = await updateContent(editingId, {
          title: formData.title,
          content: { text: formData.content },
          status: formData.status,
        });

        if (error) throw new Error(error);
        toast({ title: "Content updated successfully!" });
      } else {
        // Create new content
        const { error } = await createContent({
          page_type: currentPageType,
          title: formData.title,
          content: { text: formData.content },
          status: formData.status
        });

        if (error) throw new Error(error);
        toast({ title: "Content created successfully!" });
      }

      setIsEditing(false);
      setEditingId(null);
      setFormData({ title: '', content: '', status: 'draft' });
      fetchContents();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (item: ContentItem) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      content: item.content?.text || '',
      status: item.status
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return;

    try {
      const { error } = await deleteContent(id);
      if (error) throw new Error(error);
      
      toast({ title: "Content deleted successfully!" });
      fetchContents();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({ title: '', content: '', status: 'draft' });
  };

  if (!currentPageType) {
    return (
      <AdminLayout>
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold text-red-600">Invalid Page Type</h1>
          <p className="text-gray-600 mt-2">The requested page type is not valid.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 capitalize">
            Manage {currentPageType}
          </h1>
          <Button
            onClick={() => setIsEditing(true)}
            disabled={isEditing}
            className="flex items-center space-x-2"
          >
            <Plus size={16} />
            <span>Add New</span>
          </Button>
        </div>

        {isEditing && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                {editingId ? 'Edit Content' : 'Create New Content'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Content</label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Enter content"
                  rows={6}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleSave} className="flex items-center space-x-2">
                  <Save size={16} />
                  <span>Save</span>
                </Button>
                <Button onClick={handleCancel} variant="outline" className="flex items-center space-x-2">
                  <X size={16} />
                  <span>Cancel</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {contents.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">No content found for {currentPageType}</p>
              </CardContent>
            </Card>
          ) : (
            contents.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{item.title}</CardTitle>
                      <CardDescription>
                        Status: {item.status} | Created: {new Date(item.created_at).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleEdit(item)}
                        size="sm"
                        variant="outline"
                        disabled={isEditing}
                      >
                        <Edit size={14} />
                      </Button>
                      <Button
                        onClick={() => handleDelete(item.id)}
                        size="sm"
                        variant="outline"
                        disabled={isEditing}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 line-clamp-3">
                    {item.content?.text || 'No content available'}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminContentManager;
