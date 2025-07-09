import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown, Eye, Edit, Trash2, EyeOff } from "lucide-react";
import type { ProjectItem } from "@/pages/AdminProjectsManager";

interface ProjectsTableProps {
  projects: ProjectItem[];
  onSort: (field: keyof ProjectItem) => void;
  sortField: keyof ProjectItem;
  sortDirection: "asc" | "desc";
  onEdit: (project: ProjectItem) => void;
  onView: (project: ProjectItem) => void;
  onDelete: (project: ProjectItem) => void;
  onToggleVisibility: (project: ProjectItem) => void;
  getStatusColor: (status: string) => string;
  getTypeColor: (type: string) => string;
}

const ProjectsTable: React.FC<ProjectsTableProps> = ({
  projects,
  onSort,
  sortField,
  sortDirection,
  onEdit,
  onView,
  onDelete,
  onToggleVisibility,
  getStatusColor,
  getTypeColor,
}) => {
  const SortableHeader = ({
    field,
    children,
  }: {
    field: keyof ProjectItem;
    children: React.ReactNode;
  }) => (
    <TableHead>
      <Button
        variant="ghost"
        className="h-auto p-0 font-medium hover:bg-transparent"
        onClick={() => onSort(field)}
      >
        <div className="flex items-center gap-1">
          {children}
          <ArrowUpDown className="w-3 h-3" />
        </div>
      </Button>
    </TableHead>
  );

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <SortableHeader field="order">Order</SortableHeader>
                <SortableHeader field="title">Title</SortableHeader>
                <SortableHeader field="type">Type</SortableHeader>
                <SortableHeader field="status">Status</SortableHeader>
                <SortableHeader field="visible">Visibility</SortableHeader>
                <SortableHeader field="duration">Duration</SortableHeader>
                <TableHead>Technologies</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-8 text-gray-500"
                  >
                    No projects found
                  </TableCell>
                </TableRow>
              ) : (
                projects.map((project) => (
                  <TableRow key={project.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {project.order}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{project.title}</div>
                        <div className="text-sm text-gray-500">
                          v{project.version}
                        </div>
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
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onToggleVisibility(project)}
                        className={
                          project.visible
                            ? "text-green-600 hover:text-green-700"
                            : "text-gray-400 hover:text-gray-600"
                        }
                      >
                        {project.visible ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>{project.duration}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {project.technologies
                          ?.slice(0, 3)
                          .map((tech, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {tech}
                            </Badge>
                          ))}
                        {project.technologies?.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{project.technologies.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onView(project)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(project)}
                          className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(project)}
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
  );
};

export default ProjectsTable;
