
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  ExternalLink,
  Download,
  Github,
  Calendar,
  Code,
  Zap,
} from "lucide-react";
import Layout from "../../components/Layout";
import TechIcon from "@/components/TechIcon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDynamicContent } from "@/integrations/firebase/firestore";
import { toast } from "sonner";
import DOMPurify from "dompurify";

function decodeHTML(encoded: string) {
  const txt = document.createElement("textarea");
  txt.innerHTML = encoded;
  return txt.value;
}

interface ProjectItem {
  id: string;
  title: string;
  about?: string;
  screenshots?: string[];
  type: string;
  technologies?: string[];
  status?: string;
  version?: string;
  duration?: string;
  demoLink?: string;
  codeLink?: string;
  downloadLink?: string;
  features?: string;
  challenges?: string;
  achievements?: string;
  accessibility?: string;
  longDescription?: string;
  visible?: boolean;
}

const ProjectDetail = () => {
  const { title } = useParams<{ title: string }>();
  const [project, setProject] = useState<ProjectItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      if (!title) {
        console.log("No title parameter found");
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const decodedTitle = decodeURIComponent(title);
        console.log("Looking for project with title:", decodedTitle);
        
        const { data, error } = await getDynamicContent("projects");

        if (error) {
          console.error("Error fetching projects:", error);
          toast.error("Failed to load project");
          setNotFound(true);
          return;
        }

        if (data && Array.isArray(data)) {
          console.log("Available projects:", data.map(p => p.title));
          const found = data.find(
            (item: ProjectItem) => item.title === decodedTitle
          );
          
          if (found) {
            console.log("Found project:", found);
            setProject(found);
          } else {
            console.log("Project not found. Searched for:", decodedTitle);
            console.log("Available titles:", data.map(p => p.title));
            setNotFound(true);
          }
        } else {
          console.log("No data returned from projects collection");
          setNotFound(true);
        }
      } catch (err) {
        console.error("Error in fetchProject:", err);
        toast.error("Failed to load project");
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [title]);

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-6 py-12 text-center text-gray-500 dark:text-gray-400">
          Loading project...
        </div>
      </Layout>
    );
  }

  if (!project || notFound) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Project Not Found
          </h1>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            {title
              ? `No project named "${decodeURIComponent(title)}" found.`
              : "Invalid project name."}
          </p>
          <Link to="/projects">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-8">
          <Link to="/projects">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              {project.title}
            </h1>
            {project.status && (
              <Badge variant="secondary">{project.status}</Badge>
            )}
            {project.version && (
              <Badge variant="outline">{project.version}</Badge>
            )}
          </div>
          <div
            className="text-lg text-gray-600 dark:text-gray-400 whitespace-pre-wrap"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                decodeHTML(
                  project.about || project.longDescription || "No description"
                )
              ),
            }}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-12">
          {project.demoLink && (
            <Button asChild>
              <a
                href={project.demoLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Live Demo
              </a>
            </Button>
          )}
          {project.codeLink && (
            <Button variant="outline" asChild>
              <a
                href={project.codeLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-4 h-4 mr-2" />
                View Code
              </a>
            </Button>
          )}
          {project.downloadLink && (
            <Button variant="outline" asChild>
              <a
                href={project.downloadLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </a>
            </Button>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Screenshots */}
            {project.screenshots?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Screenshots</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {project.screenshots.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`Screenshot ${index + 1}`}
                        className="w-full rounded-md shadow-md object-cover h-64"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Features */}
            {project.features && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(decodeHTML(project.features)),
                    }}
                  />
                </CardContent>
              </Card>
            )}

            {/* Challenges */}
            {project.challenges && (
              <Card>
                <CardHeader>
                  <CardTitle>Challenges</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(
                        decodeHTML(project.challenges)
                      ),
                    }}
                  />
                </CardContent>
              </Card>
            )}

            {/* Achievements */}
            {project.achievements && (
              <Card>
                <CardHeader>
                  <CardTitle>Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(
                        decodeHTML(project.achievements)
                      ),
                    }}
                  />
                </CardContent>
              </Card>
            )}

            {/* Accessibility */}
            {project.accessibility && (
              <Card>
                <CardHeader>
                  <CardTitle>Accessibility</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(
                        decodeHTML(project.accessibility)
                      ),
                    }}
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Metadata */}
          <div className="space-y-4">
            {project.duration && (
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                Duration: {project.duration}
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Code className="w-4 h-4" />
              Type: {project.type}
            </div>

            {project.technologies?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Technologies Used</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 bg-muted px-3 py-1 rounded-md"
                    >
                      <TechIcon techName={tech} />
                      <span className="text-xs">{tech}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProjectDetail;
