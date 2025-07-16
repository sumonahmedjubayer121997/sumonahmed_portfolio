
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Code, Download, Calendar, Clock } from "lucide-react";
import { ProjectItem } from "@/pages/admin_pages/AdminProjectsManager";

interface ProjectPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectItem | null;
}

export const ProjectPreviewModal = ({
  isOpen,
  onClose,
  project,
}: ProjectPreviewModalProps) => {
  if (!project) return null;

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {project.title}
            {project.version && (
              <Badge variant="outline">v{project.version}</Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            Project details and information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <div className="flex flex-wrap gap-4 items-center">
            <Badge className={getTypeColor(project.type)}>
              {project.type}
            </Badge>
            <Badge className={getStatusColor(project.status)}>
              {project.status}
            </Badge>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              {project.duration}
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              Order: {project.order || 0}
            </div>
          </div>

          {/* Links */}
          {(project.demoLink || project.codeLink || project.downloadLink) && (
            <div className="flex flex-wrap gap-3">
              {project.demoLink && (
                <Button variant="outline" size="sm" asChild>
                  <a href={project.demoLink} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Live Demo
                  </a>
                </Button>
              )}
              {project.codeLink && (
                <Button variant="outline" size="sm" asChild>
                  <a href={project.codeLink} target="_blank" rel="noopener noreferrer">
                    <Code className="h-4 w-4 mr-2" />
                    Source Code
                  </a>
                </Button>
              )}
              {project.downloadLink && (
                <Button variant="outline" size="sm" asChild>
                  <a href={project.downloadLink} target="_blank" rel="noopener noreferrer">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </a>
                </Button>
              )}
            </div>
          )}

          {/* Screenshots */}
          {project.screenshots && project.screenshots.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Screenshots</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.screenshots.map((screenshot, index) => (
                  <img
                    key={index}
                    src={screenshot}
                    alt={`${project.title} screenshot ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Technologies */}
          {project.technologies && project.technologies.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <Badge key={index} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* About */}
          {project.about && (
            <div>
              <h3 className="text-lg font-semibold mb-3">About</h3>
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: project.about }}
              />
            </div>
          )}

          {/* Features */}
          {project.features && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Features</h3>
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: project.features }}
              />
            </div>
          )}

          {/* Challenges */}
          {project.challenges && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Challenges</h3>
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: project.challenges }}
              />
            </div>
          )}

          {/* Achievements */}
          {project.achievements && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Achievements</h3>
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: project.achievements }}
              />
            </div>
          )}

          {/* Accessibility */}
          {project.accessibility && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Accessibility</h3>
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: project.accessibility }}
              />
            </div>
          )}

          {/* Metadata */}
          <div className="border-t pt-4 text-sm text-gray-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>Created: {new Date(project.createdAt).toLocaleDateString()}</div>
              <div>Updated: {new Date(project.updatedAt).toLocaleDateString()}</div>
              <div>Visible: {project.visible ? "Yes" : "No"}</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
