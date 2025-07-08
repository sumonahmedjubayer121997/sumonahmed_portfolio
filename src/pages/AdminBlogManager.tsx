
import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Eye, Edit, Trash2 } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { getDynamicContent, deleteDynamicContent } from '@/integrations/firebase/firestore';
import BlogModal from '@/components/admin/BlogModal';
import BlogPreviewModal from '@/components/admin/BlogPreviewModal';

export interface BlogItem {
  id: string;
  title: string;
  slug: string;
  status: 'Draft' | 'Published';
  date: string;
  author: string;
  tags: string[];
  coverImage?: string;
  content: string;
  tableOfContents?: string[];
  codeSnippets?: { language: string; code: string }[];
  resources?: { title: string; type: string; url: string }[];
  extraSections?: { title: string; body: string }[];
  createdAt?: any;
  updatedAt?: any;
}

const AdminBlogManager = () => {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBlog, setSelectedBlog] = useState<BlogItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await getDynamicContent('blogs');
      
      if (error) {
        console.error('Error fetching blogs:', error);
        toast.error('Failed to load blogs');
        return;
      }

      if (data && Array.isArray(data)) {
        const blogsData = data.map(blog => ({
          ...blog,
          id: blog.id || blog.docId
        }));
        setBlogs(blogsData);
        setFilteredBlogs(blogsData);
      } else {
        setBlogs([]);
        setFilteredBlogs([]);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast.error('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    let filtered = blogs;
    
    if (searchTerm) {
      filtered = filtered.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(blog => blog.status.toLowerCase() === statusFilter);
    }
    
    setFilteredBlogs(filtered);
  }, [searchTerm, statusFilter, blogs]);

  const handleAddBlog = () => {
    setSelectedBlog(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleEditBlog = (blog: BlogItem) => {
    setSelectedBlog(blog);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handlePreviewBlog = (blog: BlogItem) => {
    setSelectedBlog(blog);
    setIsPreviewOpen(true);
  };

  const handleDeleteBlog = async (blog: BlogItem) => {
    if (!window.confirm(`Are you sure you want to delete "${blog.title}"?`)) {
      return;
    }

    try {
      const { error } = await deleteDynamicContent('blogs', blog.id);
      
      if (error) {
        toast.error('Failed to delete blog');
        return;
      }

      toast.success('Blog deleted successfully');
      fetchBlogs();
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error('Failed to delete blog');
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedBlog(null);
    fetchBlogs();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center py-12">
          <div className="text-lg text-gray-600">Loading blogs...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Manage Blogs</h1>
            <p className="text-gray-600 mt-1">Create and manage your blog posts</p>
          </div>
          <Button onClick={handleAddBlog} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add New Blog
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search blogs by title, author, or tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Blogs Table */}
        <Card>
          <CardHeader>
            <CardTitle>Blog Posts ({filteredBlogs.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBlogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        {blogs.length === 0 ? 'No blogs found. Create your first blog post!' : 'No blogs match your search criteria.'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredBlogs.map((blog) => (
                      <TableRow key={blog.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900">{blog.title}</div>
                            <div className="text-sm text-gray-500">/{blog.slug}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-700">{blog.author}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(blog.status)}>
                            {blog.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-700">{blog.date}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {blog.tags?.slice(0, 2).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {blog.tags?.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{blog.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePreviewBlog(blog)}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditBlog(blog)}
                              className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteBlog(blog)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Blog Modal */}
        {isModalOpen && (
          <BlogModal
            blog={selectedBlog}
            mode={modalMode}
            onClose={handleModalClose}
          />
        )}

        {/* Preview Modal */}
        {isPreviewOpen && selectedBlog && (
          <BlogPreviewModal
            blog={selectedBlog}
            onClose={() => setIsPreviewOpen(false)}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminBlogManager;
