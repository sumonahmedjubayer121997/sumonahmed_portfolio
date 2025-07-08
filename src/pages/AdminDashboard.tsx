
import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getContentCounts, getDynamicContent } from '@/integrations/firebase/firestore';
import { Home, User, Briefcase, FolderOpen, BookOpen, Info, Mail, Wrench, MessageSquare } from "lucide-react";

const AdminDashboard = () => {
  const [contentCounts, setContentCounts] = useState<Record<string, number>>({});
  const [messagesCount, setMessagesCount] = useState(0);
  const [projectsCount, setProjectsCount] = useState(0);

  useEffect(() => {
    fetchContentCounts();
    fetchMessagesCount();
    fetchProjectsCount();
  }, []);

  const fetchContentCounts = async () => {
    try {
      const counts = await getContentCounts();
      setContentCounts(counts);
    } catch (error) {
      console.error('Error fetching content counts:', error);
    }
  };

  const fetchMessagesCount = async () => {
    try {
      const { data, error } = await getDynamicContent('contact_messages');
      if (!error && data) {
        setMessagesCount(data.length);
      }
    } catch (error) {
      console.error('Error fetching messages count:', error);
    }
  };

  const fetchProjectsCount = async () => {
    try {
      const { data, error } = await getDynamicContent('projects');
      if (!error && data) {
        setProjectsCount(data.length);
      }
    } catch (error) {
      console.error('Error fetching projects count:', error);
    }
  };

  const pageTypes = [
    { key: 'home', label: 'Home', icon: Home },
    { key: 'experience', label: 'Experience', icon: User },
    { key: 'apps', label: 'Apps', icon: Briefcase },
    { key: 'blogs', label: 'Blogs', icon: BookOpen },
    { key: 'about', label: 'About', icon: Info },
    { key: 'tools', label: 'Tools', icon: Wrench },
    { key: 'contact', label: 'Contact', icon: Mail },
  ];

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {pageTypes.map((page) => {
            const Icon = page.icon;
            const count = contentCounts[page.key] || 0;
            
            return (
              <Card key={page.key} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {page.label}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{count}</div>
                  <CardDescription>
                    {count === 1 ? 'content item' : 'content items'}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
          
          {/* Projects Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Projects
              </CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projectsCount}</div>
              <CardDescription>
                {projectsCount === 1 ? 'project' : 'projects'}
              </CardDescription>
            </CardContent>
          </Card>
          
          {/* Client Messages Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Client Messages
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{messagesCount}</div>
              <CardDescription>
                {messagesCount === 1 ? 'message received' : 'messages received'}
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pageTypes.map((page) => (
              <Card key={`action-${page.key}`} className="cursor-pointer hover:bg-gray-50">
                <CardHeader>
                  <CardTitle className="text-lg">Manage {page.label}</CardTitle>
                  <CardDescription>
                    Create, edit, and delete {page.label.toLowerCase()} content
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
            
            {/* Projects Quick Action */}
            <Card className="cursor-pointer hover:bg-gray-50">
              <CardHeader>
                <CardTitle className="text-lg">Manage Projects</CardTitle>
                <CardDescription>
                  Create, edit, and showcase your portfolio projects
                </CardDescription>
              </CardHeader>
            </Card>
            
            {/* Client Messages Quick Action */}
            <Card className="cursor-pointer hover:bg-gray-50">
              <CardHeader>
                <CardTitle className="text-lg">View Client Messages</CardTitle>
                <CardDescription>
                  Review and manage messages from website visitors
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
