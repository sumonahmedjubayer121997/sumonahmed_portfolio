
import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getContentCounts, getDynamicContent } from '@/integrations/firebase/firestore';
import { Home, User, Briefcase, FolderOpen, BookOpen, Info, Mail, Wrench, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
const AdminDashboard = () => {
  const [contentCounts, setContentCounts] = useState<Record<string, number>>({});
  const [messagesCount, setMessagesCount] = useState(0);
  const [projectsCount, setProjectsCount] = useState(0);
  const [experienceCount, setExperienceCount] = useState(0);  
  const [blogCount, setBlogCount] = useState(0);
  const [appsCount, setAppsCount] = useState(0);
  const [contactCount, setContactCount] = useState(0);  
  const [toolsCount, setToolsCount] = useState(0);



  useEffect(() => {
    fetchContentCounts();
    fetchMessagesCount();
    fetchProjectsCount();
    fetchExperienceCount();
    fetchBlogCount();
    fetchAppsCount();
    fetchToolsCount();
    fetchContactCount();
  }, []);

  const fetchToolsCount = async () => {
    try {
      const { data, error } = await getDynamicContent('tools');
      if (!error && data) {
        setToolsCount(data.length);
      }
    } catch (error) {
      console.error('Error fetching tools count:', error);
    }
  };    
  const fetchContactCount = async () => {
    try {
      const { data, error } = await getDynamicContent('contact_items');     
      if (!error && data) {
        setContactCount(data.length);
      }
    } catch (error) {
      console.error('Error fetching contact count:', error);
    }

  }

  const fetchAppsCount = async () => {
    try {
      const { data, error } = await getDynamicContent('apps');
      if (!error && data) {
        setAppsCount(data.length);
      }
    } catch (error) {
      console.error('Error fetching apps count:', error);
    }
  };    


  const fetchBlogCount = async () => {
    try {
      const { data, error } = await getDynamicContent('blogs');
      if (!error && data) {
        setBlogCount(data.length);
      }
    } catch (error) {
      console.error('Error fetching blog count:', error);
    }
  };


  const fetchExperienceCount = async () => {
    try {
      const { data, error } = await getDynamicContent('experience');
      if (!error && data) {
        setExperienceCount(data.length);
      }
    } catch (error) {
      console.error('Error fetching experience count:', error);
    }
  };  


  const fetchContentCounts = async () => {
    try {
      const counts = await getContentCounts();
      setContentCounts(counts);
    } catch (error) {
      console.error('Error fetching content counts:', error);
    }
  };

    
  // Fetch messages count from dynamic content

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
    { key: 'experience', label: 'Experience', icon: User, count: experienceCount || 0 },
    { key: 'projects', label: 'Projects', icon: FolderOpen, count: projectsCount || 0 },
    { key: 'apps', label: 'Apps', icon: Briefcase ,count: appsCount || 0 },
    { key: 'blogs', label: 'Blogs', icon: BookOpen, count: blogCount || 0 },
    { key: 'tools', label: 'Tools', icon: Wrench ,  count: toolsCount || 0 },
    { key: 'contact', label: 'Contact', icon: Mail ,  count: contactCount || 0 },
    { key: 'clientsMessages', label: 'Messages', icon: MessageSquare, count: messagesCount || 0 }
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
                  <div className="text-2xl font-bold">{page.count}</div>
                  <CardDescription>
                    {count === 1 ? 'content item' : 'content items'}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pageTypes.map((page) => (
              <Card key={`action-${page.key}`} className="cursor-pointer hover:bg-gray-50">
                <CardHeader>
                 <Link to={`/myportadmin/dashboard/${page.key}`} className="flex flex-col">
                    <CardTitle className="text-lg">{page.label}</CardTitle>
                    <CardDescription>
                      {`Manage your ${page.label.toLowerCase()} content`}
                    </CardDescription>
                  </Link>
                </CardHeader>
              </Card>
            ))}
            
          
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
