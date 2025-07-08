
import React, { useState, useEffect } from 'react';
import { X, Upload, Plus, Trash2, Code, FileText, Link } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { saveDynamicContent, updateDynamicContent } from '@/integrations/firebase/firestore';
import { uploadFile } from '@/integrations/firebase/storage';
import type { BlogItem } from '@/pages/AdminBlogManager';

const blogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  author: z.string().min(1, 'Author is required'),
  date: z.string().min(1, 'Date is required'),
  status: z.enum(['Draft', 'Published']),
  content: z.string().min(1, 'Content is required'),
});

type BlogFormData = z.infer<typeof blogSchema>;

interface BlogModalProps {
  blog: BlogItem | null;
  mode: 'add' | 'edit';
  onClose: () => void;
}

const BlogModal: React.FC<BlogModalProps> = ({ blog, mode, onClose }) => {
  const [tags, setTags] = useState<string[]>(blog?.tags || []);
  const [newTag, setNewTag] = useState('');
  const [coverImage, setCoverImage] = useState<string>(blog?.coverImage || '');
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [tableOfContents, setTableOfContents] = useState<string[]>(blog?.tableOfContents || []);
  const [newTocItem, setNewTocItem] = useState('');
  const [codeSnippets, setCodeSnippets] = useState<{ language: string; code: string }[]>(
    blog?.codeSnippets || []
  );
  const [resources, setResources] = useState<{ title: string; type: string; url: string }[]>(
    blog?.resources || []
  );
  const [extraSections, setExtraSections] = useState<{ title: string; body: string }[]>(
    blog?.extraSections || []
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: blog?.title || '',
      slug: blog?.slug || '',
      author: blog?.author || '',
      date: blog?.date || new Date().toISOString().split('T')[0],
      status: blog?.status || 'Draft',
      content: blog?.content || '',
    }
  });

  const watchTitle = watch('title');

  // Auto-generate slug from title
  useEffect(() => {
    if (watchTitle && mode === 'add') {
      const slug = watchTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setValue('slug', slug);
    }
  }, [watchTitle, mode, setValue]);

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);
      const fileName = `blogs/covers/${Date.now()}-${file.name}`;
      const url = await uploadFile(file, fileName);
      setCoverImage(url);
      setCoverImageFile(null);
      toast.success('Cover image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload cover image');
    } finally {
      setUploading(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const addTocItem = () => {
    if (newTocItem.trim()) {
      setTableOfContents([...tableOfContents, newTocItem.trim()]);
      setNewTocItem('');
    }
  };

  const removeTocItem = (index: number) => {
    setTableOfContents(tableOfContents.filter((_, i) => i !== index));
  };

  const addCodeSnippet = () => {
    setCodeSnippets([...codeSnippets, { language: 'javascript', code: '' }]);
  };

  const updateCodeSnippet = (index: number, field: 'language' | 'code', value: string) => {
    const updated = [...codeSnippets];
    updated[index][field] = value;
    setCodeSnippets(updated);
  };

  const removeCodeSnippet = (index: number) => {
    setCodeSnippets(codeSnippets.filter((_, i) => i !== index));
  };

  const addResource = () => {
    setResources([...resources, { title: '', type: '', url: '' }]);
  };

  const updateResource = (index: number, field: 'title' | 'type' | 'url', value: string) => {
    const updated = [...resources];
    updated[index][field] = value;
    setResources(updated);
  };

  const removeResource = (index: number) => {
    setResources(resources.filter((_, i) => i !== index));
  };

  const addExtraSection = () => {
    setExtraSections([...extraSections, { title: '', body: '' }]);
  };

  const updateExtraSection = (index: number, field: 'title' | 'body', value: string) => {
    const updated = [...extraSections];
    updated[index][field] = value;
    setExtraSections(updated);
  };

  const removeExtraSection = (index: number) => {
    setExtraSections(extraSections.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: BlogFormData) => {
    try {
      setSaving(true);

      const blogData: Partial<BlogItem> = {
        ...data,
        tags,
        coverImage,
        tableOfContents: tableOfContents.length > 0 ? tableOfContents : undefined,
        codeSnippets: codeSnippets.length > 0 ? codeSnippets : undefined,
        resources: resources.filter(r => r.title && r.url).length > 0 
          ? resources.filter(r => r.title && r.url) : undefined,
        extraSections: extraSections.filter(s => s.title && s.body).length > 0 
          ? extraSections.filter(s => s.title && s.body) : undefined,
      };

      if (mode === 'edit' && blog?.id) {
        const { error } = await updateDynamicContent('blogs', blog.id, blogData);
        if (error) throw error;
        toast.success('Blog updated successfully');
      } else {
        const { error } = await saveDynamicContent('blogs', blogData);
        if (error) throw error;
        toast.success('Blog created successfully');
      }

      onClose();
    } catch (error) {
      console.error('Error saving blog:', error);
      toast.error(mode === 'edit' ? 'Failed to update blog' : 'Failed to create blog');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {mode === 'edit' ? 'Edit Blog' : 'Add New Blog'}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    {...register('title')}
                    placeholder="Enter blog title"
                  />
                  {errors.title && (
                    <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    {...register('slug')}
                    placeholder="blog-url-slug"
                  />
                  {errors.slug && (
                    <p className="text-red-600 text-sm mt-1">{errors.slug.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="author">Author *</Label>
                  <Input
                    id="author"
                    {...register('author')}
                    placeholder="Author name"
                  />
                  {errors.author && (
                    <p className="text-red-600 text-sm mt-1">{errors.author.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    {...register('date')}
                  />
                  {errors.date && (
                    <p className="text-red-600 text-sm mt-1">{errors.date.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="status">Status *</Label>
                  <Select onValueChange={(value) => setValue('status', value as 'Draft' | 'Published')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cover Image */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cover Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setCoverImageFile(file);
                        handleImageUpload(file);
                      }
                    }}
                    disabled={uploading}
                  />
                  {uploading && <span className="text-sm text-gray-500">Uploading...</span>}
                </div>
                {coverImage && (
                  <div className="relative">
                    <img src={coverImage} alt="Cover" className="w-32 h-32 object-cover rounded" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2"
                      onClick={() => setCoverImage('')}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => removeTag(tag)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Content *</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                {...register('content')}
                placeholder="Write your blog content here (HTML/Markdown supported)"
                rows={10}
                className="font-mono"
              />
              {errors.content && (
                <p className="text-red-600 text-sm mt-1">{errors.content.message}</p>
              )}
            </CardContent>
          </Card>

          {/* Table of Contents */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Table of Contents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newTocItem}
                    onChange={(e) => setNewTocItem(e.target.value)}
                    placeholder="Add table of contents item"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTocItem())}
                  />
                  <Button type="button" onClick={addTocItem}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {tableOfContents.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <span className="flex-1">{item}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTocItem(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Code Snippets */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Code className="w-5 h-5" />
                Code Snippets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button type="button" onClick={addCodeSnippet} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Code Snippet
                </Button>
                {codeSnippets.map((snippet, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <Select
                        value={snippet.language}
                        onValueChange={(value) => updateCodeSnippet(index, 'language', value)}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="javascript">JavaScript</SelectItem>
                          <SelectItem value="typescript">TypeScript</SelectItem>
                          <SelectItem value="python">Python</SelectItem>
                          <SelectItem value="java">Java</SelectItem>
                          <SelectItem value="css">CSS</SelectItem>
                          <SelectItem value="html">HTML</SelectItem>
                          <SelectItem value="json">JSON</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeCodeSnippet(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <Textarea
                      value={snippet.code}
                      onChange={(e) => updateCodeSnippet(index, 'code', e.target.value)}
                      placeholder="Enter your code here..."
                      rows={6}
                      className="font-mono text-sm"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Link className="w-5 h-5" />
                Downloadable Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button type="button" onClick={addResource} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Resource
                </Button>
                {resources.map((resource, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Resource {index + 1}</span>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeResource(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <Input
                        value={resource.title}
                        onChange={(e) => updateResource(index, 'title', e.target.value)}
                        placeholder="Resource title"
                      />
                      <Input
                        value={resource.type}
                        onChange={(e) => updateResource(index, 'type', e.target.value)}
                        placeholder="File type (PDF, ZIP, etc.)"
                      />
                      <Input
                        value={resource.url}
                        onChange={(e) => updateResource(index, 'url', e.target.value)}
                        placeholder="Download URL"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Extra Sections */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Extra Sections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button type="button" onClick={addExtraSection} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Section
                </Button>
                {extraSections.map((section, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Section {index + 1}</span>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeExtraSection(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <Input
                      value={section.title}
                      onChange={(e) => updateExtraSection(index, 'title', e.target.value)}
                      placeholder="Section title"
                    />
                    <Textarea
                      value={section.body}
                      onChange={(e) => updateExtraSection(index, 'body', e.target.value)}
                      placeholder="Section content"
                      rows={4}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : (mode === 'edit' ? 'Update Blog' : 'Create Blog')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogModal;
