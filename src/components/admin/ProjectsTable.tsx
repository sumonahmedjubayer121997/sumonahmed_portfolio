
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2, ArrowUpDown } from "lucide-react";
import { Project } from "@/pages/AdminProjectsManager";
import { useState } from "react";

interface ProjectsTableProps {
  projects: Project[];
  loading: boolean;
  onEdit: (project: Project) => void;
  onView: (project: Project) => void;
  onDelete: (projectId: string) => void;
}

export const ProjectsTable = ({
  projects,
  loading,
  onEdit,
  onView,
  onDelete,
}: ProjectsTableProps) => {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Mobile":
        return "bg-blue-100 text-blue-800";
      case "Web":
        return "bg-purple-100 text-purple-800";
      case "Desktop":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const sortedProjects = [...projects].sort((a, b) => {
    if (sortOrder === "asc") {
      return (a.order || 0) - (b.order || 0);
    } else {
      return (b.order || 0) - (a.order || 0);
    }
  });

  const toggleSort = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="text-lg text-gray-600">Loading projects...</div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">No projects found</div>
        <div className="text-gray-400 text-sm mt-2">
          Create your first project to get started
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSort}
                className="flex items-center gap-1 p-0 h-auto font-medium"
              >
                Order
                <ArrowUpDown className="h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Technologies</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedProjects.map((project) => (
            <TableRow key={project.id}>
              <TableCell className="font-medium">
                {project.order || 0}
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{project.title}</div>
                  {project.version && (
                    <div className="text-sm text-gray-500">v{project.version}</div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getTypeColor(project.type)}>
                  {project.type}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(project.status)}>
                  {project.status}
                </Badge>
              </TableCell>
              <TableCell>{project.duration}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {project.technologies.slice(0, 3).map((tech, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                  {project.technologies.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{project.technologies.length - 3}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(project)}
                    className="h-8 w-8 p-0"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(project)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(project.id)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
