
import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProjectsTable } from "@/components/admin/ProjectsTable";
import { ProjectModal } from "@/components/admin/ProjectModal";
import { ProjectPreviewModal } from "@/components/admin/ProjectPreviewModal";
import { getDynamicContent, deleteDynamicContent } from "@/integrations/firebase/firestore";
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
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await getDynamicContent('projects');
      if (error) {
        throw new Error(error);
      }
      if (data) {
        const sortedProjects = data
          .sort((a: Project, b: Project) => (a.order || 0) - (b.order || 0));
        setProjects(sortedProjects);
      }
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error",
        description: "Failed to fetch projects",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
      
      fetchProjects();
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projects Management</h1>
            <p className="text-gray-600 mt-2">Manage your portfolio projects</p>
          </div>
          <Button onClick={handleAddProject} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Project
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Projects Overview</CardTitle>
            <CardDescription>
              {projects.length} total projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>

            <ProjectsTable
              projects={filteredProjects}
              loading={loading}
              onEdit={handleEditProject}
              onView={handleViewProject}
              onDelete={handleDeleteProject}
            />
          </CardContent>
        </Card>

        <ProjectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          project={selectedProject}
          mode={modalMode}
          onSuccess={fetchProjects}
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
