
import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ProjectsTable } from "@/components/admin/ProjectsTable";
import { ProjectModal } from "@/components/admin/ProjectModal";
import { ProjectPreviewModal } from "@/components/admin/ProjectPreviewModal";
import { listenDynamicContent, deleteDynamicContent } from "@/integrations/firebase/firestore";
import { useToast } from "@/hooks/use-toast";

export interface Project {
  id: string;
  order: number;
  title: string;
  status: "draft" | "published" | "archived";
  version: string;
  type: "Mobile" | "Web" | "Desktop";
  duration: string;
  demoLink?: string;
  codeLink?: string;
  downloadLink?: string;
  screenshots: string[];
  technologies: string[];
  about: string;
  features: string[];
  challenges: string;
  achievements: string;
  accessibility: string;
  createdAt: string;
  updatedAt: string;
  visible: boolean;
}

const AdminProjectsManager = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = listenDynamicContent(
      'projects',
      null,
      (data: Project[]) => {
        const sortedProjects = data
          .sort((a: Project, b: Project) => (a.order || 0) - (b.order || 0));
        setProjects(sortedProjects);
        setLoading(false);
      },
      (error) => {
        console.error('Error listening to projects:', error);
        toast({
          title: "Error",
          description: "Failed to load projects",
          variant: "destructive",
        });
        setLoading(false);
      }
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [toast]);

  const handleAddProject = () => {
    setSelectedProject(null);
    setModalMode("add");
    setIsModalOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleViewProject = (project: Project) => {
    setSelectedProject(project);
    setIsPreviewOpen(true);
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const { error } = await deleteDynamicContent('projects', projectId);
      if (error) {
        throw new Error(error);
      }
      
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting project:', error);
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      });
    }
  };

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800 border-green-200";
      case "draft":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "archived":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Mobile":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Web":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Desktop":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
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
            <h1 className="text-3xl font-bold text-gray-900">Projects Manager</h1>
            <p className="text-gray-600 mt-1">Manage your project portfolio</p>
          </div>
          <Button onClick={handleAddProject} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add New Project
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">{projects.length}</div>
              <div className="text-sm text-gray-600">Total Projects</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {projects.filter(project => project.status === "published").length}
              </div>
              <div className="text-sm text-gray-600">Published</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {projects.filter(project => project.status === "draft").length}
              </div>
              <div className="text-sm text-gray-600">Drafts</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-600">
                {projects.filter(project => project.status === "archived").length}
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
                placeholder="Search projects by title, type, or status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Projects Table */}
        <ProjectsTable
          projects={filteredProjects}
          loading={loading}
          onEdit={handleEditProject}
          onView={handleViewProject}
          onDelete={handleDeleteProject}
        />

        <ProjectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          project={selectedProject}
          mode={modalMode}
          onSuccess={() => {
            // The real-time listener will automatically update the list
          }}
        />

        <ProjectPreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          project={selectedProject}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminProjectsManager;
