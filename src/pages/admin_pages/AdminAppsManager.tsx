import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Eye, Edit, Trash2, ArrowUpDown, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import AppsTable from '@/components/admin/AppsTable';
import AppModal from '@/components/admin/AppModal';
import { listenDynamicContent, deleteDynamicContent, saveAndUpdateDynamicContent } from '@/integrations/firebase/firestore';

export interface AppItem {
  id: string;
  title: string;
  status: 'draft' | 'published' | 'archived';
  version: string;
  type: 'mobile' | 'web' | 'desktop';
  duration: string;
  demoLink?: string;
  codeLink?: string;
  downloadLink?: string;
  screenshots: string[];
  technologies: string[];
  about: string;
  features: string;
  challenges: string;
  achievements: string;
  accessibility: string;
  order: number;
  visible: boolean;
  createdAt: string;
  updatedAt: string;
}

const AdminAppsManager = () => {
  const [apps, setApps] = useState<AppItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<AppItem | null>(null);
  const [viewingApp, setViewingApp] = useState<AppItem | null>(null);
  const [sortField, setSortField] = useState<keyof AppItem>('order');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    const unsubscribe = listenDynamicContent(
      'apps',
      null,
      (data: AppItem[]) => {
        setApps(data || []);
        setLoading(false);
      },
      (error) => {
        console.error('Error listening to apps:', error);
        toast.error('Failed to load apps');
        setLoading(false);
      }
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleSort = (field: keyof AppItem) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedApps = [...apps].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDirection === 'asc' 
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }
    
    return 0;
  });

  const filteredApps = sortedApps.filter(app =>
    app.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddApp = () => {
    setEditingApp(null);
    setIsModalOpen(true);
  };

  const handleEditApp = (app: AppItem) => {
    setEditingApp(app);
    setIsModalOpen(true);
  };

  const handleViewApp = (app: AppItem) => {
    setViewingApp(app);
  };

  const handleToggleVisibility = async (app: AppItem) => {
    const updatedApp = { ...app, visible: !app.visible };
    
    try {
      const { error } = await saveAndUpdateDynamicContent(
        'apps',
        updatedApp,
        app.id
      );
      
      if (error) {
        throw new Error(error);
      }
      
      toast.success(`App ${app.visible ? 'hidden' : 'shown'} successfully`);
    } catch (error) {
      console.error('Toggle visibility error:', error);
      toast.error('Failed to toggle app visibility');
    }
  };

  const handleDeleteApp = async (app: AppItem) => {
    if (!confirm(`Are you sure you want to delete "${app.title}"?`)) return;

    try {
      const { error } = await deleteDynamicContent('apps', app.id);
      
      if (error) {
        console.error('Delete error:', error);
        toast.error('Failed to delete app');
        return;
      }
      
      toast.success('App deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete app');
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingApp(null);
  };

  const handleViewModalClose = () => {
    setViewingApp(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800 border-green-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'archived': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'mobile': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'web': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'desktop': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Apps Manager</h1>
            <p className="text-gray-600 mt-1">Manage your app portfolio</p>
          </div>
          <Button onClick={handleAddApp} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add New App
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">{apps.length}</div>
              <div className="text-sm text-gray-600">Total Apps</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {apps.filter(app => app.status === 'published').length}
              </div>
              <div className="text-sm text-gray-600">Published</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {apps.filter(app => app.status === 'draft').length}
              </div>
              <div className="text-sm text-gray-600">Drafts</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-600">
                {apps.filter(app => app.status === 'archived').length}
              </div>
              <div className="text-sm text-gray-600">Archived</div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search apps by title, type, or status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Apps Table */}
        <AppsTable
          apps={filteredApps}
          onSort={handleSort}
          sortField={sortField}
          sortDirection={sortDirection}
          onEdit={handleEditApp}
          onView={handleViewApp}
          onDelete={handleDeleteApp}
          onToggleVisibility={handleToggleVisibility}
          getStatusColor={getStatusColor}
          getTypeColor={getTypeColor}
        />

        {/* Add/Edit Modal */}
        <AppModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          editingApp={editingApp}
        />

        {/* View Modal */}
        {viewingApp && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto w-full">
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-xl font-semibold">{viewingApp.title}</h2>
                <Button variant="ghost" onClick={handleViewModalClose}>×</Button>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <Badge className={getStatusColor(viewingApp.status)}>
                      {viewingApp.status}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Type</label>
                    <Badge className={getTypeColor(viewingApp.type)}>
                      {viewingApp.type}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Version</label>
                    <p>{viewingApp.version}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Duration</label>
                    <p>{viewingApp.duration}</p>
                  </div>
                </div>

                {viewingApp.screenshots?.length > 0 && (
                  <div>
                    <label className="text-sm font-medium">Screenshots</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                      {viewingApp.screenshots.map((screenshot, index) => (
                        <img
                          key={index}
                          src={screenshot}
                          alt={`Screenshot ${index + 1}`}
                          className="w-full h-32 object-cover rounded border"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {viewingApp.technologies?.length > 0 && (
                  <div>
                    <label className="text-sm font-medium">Technologies</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {viewingApp.technologies.map((tech, index) => (
                        <Badge key={index} variant="outline">{tech}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {viewingApp.about && (
                    <div>
                      <label className="text-sm font-medium">About</label>
                      <div 
                        className="mt-2 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: viewingApp.about }}
                      />
                    </div>
                  )}

                  {viewingApp.features && (
                    <div>
                      <label className="text-sm font-medium">Features</label>
                      <div 
                        className="mt-2 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: viewingApp.features }}
                      />
                    </div>
                  )}

                  {viewingApp.challenges && (
                    <div>
                      <label className="text-sm font-medium">Challenges</label>
                      <div 
                        className="mt-2 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: viewingApp.challenges }}
                      />
                    </div>
                  )}

                  {viewingApp.achievements && (
                    <div>
                      <label className="text-sm font-medium">Achievements</label>
                      <div 
                        className="mt-2 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: viewingApp.achievements }}
                      />
                    </div>
                  )}

                  {viewingApp.accessibility && (
                    <div>
                      <label className="text-sm font-medium">Accessibility</label>
                      <div 
                        className="mt-2 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: viewingApp.accessibility }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminAppsManager;
