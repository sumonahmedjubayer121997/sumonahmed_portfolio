import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";

import ProjectsTable from "@/components/admin/ProjectsTable";
import ProjectModal from "@/components/admin/ProjectModal";
import {
  listenDynamicContent,
  deleteDynamicContent,
  saveAndUpdateDynamicContent,
} from "@/integrations/firebase/firestore";

export interface ProjectItem {
  id: string;
  title: string;
  status: "draft" | "published" | "archived";
  version: string;
  type: "mobile" | "web" | "desktop";
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

const AdminProjectsManager: React.FC = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(
    null
  );
  const [viewingProject, setViewingProject] = useState<ProjectItem | null>(
    null
  );
  const [sortField, setSortField] = useState<keyof ProjectItem>("order");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Subscribe to firestore 'projects'
  useEffect(() => {
    const unsubscribe = listenDynamicContent(
      "projects",
      null,
      (data: ProjectItem[]) => {
        setProjects(data || []);
        setLoading(false);
      },
      (error) => {
        console.error("Error listening to projects:", error);
        toast.error("Failed to load projects");
        setLoading(false);
      }
    );
    return () => {
      unsubscribe?.();
    };
  }, []);

  const handleSort = (field: keyof ProjectItem) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedProjects = [...projects].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortDirection === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    }
    return 0;
  });

  const filteredProjects = sortedProjects.filter((project) =>
    [project.title, project.type, project.status].some((field) =>
      field.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleAddProject = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };
  const handleEditProject = (p: ProjectItem) => {
    setEditingProject(p);
    setIsModalOpen(true);
  };
  const handleViewProject = (p: ProjectItem) => setViewingProject(p);

  const handleToggleVisibility = async (p: ProjectItem) => {
    const updated = { ...p, visible: !p.visible };
    try {
      const { error } = await saveAndUpdateDynamicContent(
        "projects",
        updated,
        p.id
      );
      if (error) throw new Error(error);
      toast.success(`Project ${p.visible ? "hidden" : "shown"} successfully`);
    } catch (e) {
      console.error(e);
      toast.error("Failed to toggle visibility");
    }
  };

  const handleDeleteProject = async (p: ProjectItem) => {
    if (!confirm(`Delete "${p.title}" permanently?`)) return;
    try {
      const { error } = await deleteDynamicContent("projects", p.id);
      if (error) throw new Error(error);
      toast.success("Project deleted successfully");
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete project");
    }
  };

  const handleSaveProject = async (project: any) => {
    try {
      // The saving is already handled in the ProjectModal component
      console.log('Project saved successfully:', project.title);
    } catch (error) {
      console.error('Error handling saved project:', error);
      toast.error('Failed to save project');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };
  const closeView = () => setViewingProject(null);

  const getStatusColor = (status: ProjectItem["status"]) => {
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

  const getTypeColor = (type: ProjectItem["type"]) => {
    switch (type) {
      case "mobile":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "web":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "desktop":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
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
            <h1 className="text-3xl font-bold text-gray-900">
              Projects Manager
            </h1>
            <p className="text-gray-600 mt-1">Manage your project portfolio</p>
          </div>
          <Button
            onClick={handleAddProject}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Project
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">
                {projects.length}
              </div>
              <div className="text-sm text-gray-600">Total Projects</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {projects.filter((p) => p.status === "published").length}
              </div>
              <div className="text-sm text-gray-600">Published</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {projects.filter((p) => p.status === "draft").length}
              </div>
              <div className="text-sm text-gray-600">Drafts</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-600">
                {projects.filter((p) => p.status === "archived").length}
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
          onSort={handleSort}
          sortField={sortField}
          sortDirection={sortDirection}
          onEdit={handleEditProject}
          onView={handleViewProject}
          onDelete={handleDeleteProject}
          onToggleVisibility={handleToggleVisibility}
          getStatusColor={getStatusColor}
          getTypeColor={getTypeColor}
        />

        {/* Add/Edit Modal */}
        <ProjectModal
          isOpen={isModalOpen}
          onClose={closeModal}
          project={editingProject}
          onSave={handleSaveProject}
        />

        {/* View Modal */}
        {viewingProject && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto w-full">
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  {viewingProject.title}
                </h2>
                <Button variant="ghost" onClick={closeView}>
                  ×
                </Button>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label>Status</label>
                    <Badge className={getStatusColor(viewingProject.status)}>
                      {viewingProject.status}
                    </Badge>
                  </div>
                  <div>
                    <label>Type</label>
                    <Badge className={getTypeColor(viewingProject.type)}>
                      {viewingProject.type}
                    </Badge>
                  </div>
                  <div>
                    <label>Version</label>
                    <p>{viewingProject.version}</p>
                  </div>
                  <div>
                    <label>Duration</label>
                    <p>{viewingProject.duration}</p>
                  </div>
                </div>

                {/* Screenshots */}
                {viewingProject.screenshots?.length > 0 && (
                  <div>
                    <label>Screenshots</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                      {viewingProject.screenshots.map((src, i) => (
                        <img
                          key={i}
                          src={src}
                          alt={`Screenshot ${i + 1}`}
                          className="w-full h-32 object-cover rounded border"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Technologies */}
                {viewingProject.technologies?.length > 0 && (
                  <div>
                    <label>Technologies</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {viewingProject.technologies.map((t, i) => (
                        <Badge key={i} variant="outline">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Content Sections */}
                {[
                  "about",
                  "features",
                  "challenges",
                  "achievements",
                  "accessibility",
                ].map((key) => {
                  const html = (viewingProject as any)[key];
                  return (
                    html && (
                      <div key={key}>
                        <label className="capitalize">{key}</label>
                        <div
                          className="mt-2 prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: html }}
                        />
                      </div>
                    )
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProjectsManager;
