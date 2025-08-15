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
import MLDevelopmentSteps from "@/components/MLDevelopmentSteps";
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
          console.log(
            "Available projects:",
            data.map((p) => p.title)
          );
          const found = data.find(
            (item: ProjectItem) => item.title === decodedTitle
          );

          if (found) {
            console.log("Found project:", found);
            setProject(found);
          } else {
            console.log("Project not found. Searched for:", decodedTitle);
            console.log(
              "Available titles:",
              data.map((p) => p.title)
            );
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
        <div className="max-w-4xl mx-auto px-6 py-12 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Loading project...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!project || notFound) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-foreground">
                Project Not Found
              </h1>
              <p className="text-lg text-muted-foreground">
                {title
                  ? `No project named "${decodeURIComponent(title)}" found.`
                  : "Invalid project name."}
              </p>
            </div>
            <Link to="/projects">
              <Button variant="outline" className="gap-2 ">
                <ArrowLeft className="w-4 h-4 " />
                Back to Projects
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
            {/* Navigation */}
            <div className="mb-8">
              <Link to="/projects">
                <Button
                  variant="ghost"
                  className="gap-2 hover:bg-accent/50 transition-all duration-300 group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Back to Projects
                </Button>
              </Link>
            </div>

            {/* Hero Header */}
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    {project.status && (
                      <Badge
                        variant="secondary"
                        className="text-sm font-medium"
                      >
                        {project.status}
                      </Badge>
                    )}
                    {project.version && (
                      <Badge variant="outline" className="text-sm">
                        v{project.version}
                      </Badge>
                    )}
                    <Badge variant="default" className="text-xs">
                      {project.type}
                    </Badge>
                  </div>

                  <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                    {project.title}
                  </h1>

                  <div
                    className="text-xl text-muted-foreground leading-relaxed max-w-2xl"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(
                        decodeHTML(
                          project.about ||
                            project.longDescription ||
                            "No description available."
                        )
                      ),
                    }}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 pt-4">
                  {project.demoLink && (
                    <Button
                      asChild
                      size="lg"
                      className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <a
                        href={project.demoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-5 h-5" />
                        Live Demo
                      </a>
                    </Button>
                  )}
                  {project.codeLink && (
                    <Button
                      variant="outline"
                      size="lg"
                      asChild
                      className="gap-2 hover:bg-accent transition-all duration-300"
                    >
                      <a
                        href={project.codeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="w-5 h-5" />
                        View Code
                      </a>
                    </Button>
                  )}
                  {project.downloadLink && (
                    <Button
                      variant="secondary"
                      size="lg"
                      asChild
                      className="gap-2 hover:bg-secondary/80 transition-all duration-300"
                    >
                      <a
                        href={project.downloadLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="w-5 h-5" />
                        Download
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              {/* Project Info Card */}
              <div className="lg:justify-self-end w-full max-w-md">
                <Card className="border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl">
                  <CardHeader className="border-b border-border/30">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-accent"></div>
                      Project Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    {project.duration && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/20">
                        <Calendar className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                            Duration
                          </p>
                          <p className="text-sm font-semibold text-foreground">
                            {project.duration}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/20">
                      <Code className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                          Type
                        </p>
                        <p className="text-sm font-semibold text-foreground">
                          {project.type}
                        </p>
                      </div>
                    </div>

                    {project.technologies?.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                          Technologies
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.slice(0, 6).map((tech, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-1.5 bg-primary/10 hover:bg-primary/20 transition-colors px-2.5 py-1.5 rounded-full border border-primary/20"
                            >
                              <TechIcon techName={tech} />
                              <span className="text-xs font-medium text-foreground">
                                {tech}
                              </span>
                            </div>
                          ))}
                          {project.technologies.length > 6 && (
                            <Badge variant="secondary" className="text-xs">
                              +{project.technologies.length - 6} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Left Sidebar - Quick Navigation */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-4">
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">
                      Quick Navigation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {project.screenshots?.length > 0 && (
                      <a
                        href="#screenshots"
                        className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md transition-colors"
                      >
                        Screenshots
                      </a>
                    )}
                    <a
                      href="#timeline"
                      className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md transition-colors"
                    >
                      Development Timeline
                    </a>
                    {project.features && (
                      <a
                        href="#features"
                        className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md transition-colors"
                      >
                        Features
                      </a>
                    )}
                    {project.challenges && (
                      <a
                        href="#challenges"
                        className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md transition-colors"
                      >
                        Challenges
                      </a>
                    )}
                    {project.achievements && (
                      <a
                        href="#achievements"
                        className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md transition-colors"
                      >
                        Achievements
                      </a>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3 space-y-12">
              {/* Screenshots Section */}
              {project.screenshots?.length > 0 && (
                <section id="screenshots">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
                      <h2 className="text-2xl font-bold text-foreground">
                        Screenshots
                      </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {project.screenshots.map((url, index) => (
                        <Card
                          key={index}
                          className="group overflow-hidden border-border/50 bg-card/30 backdrop-blur-sm hover:shadow-2xl transition-all duration-500"
                        >
                          <div className="relative overflow-hidden">
                            <img
                              src={url}
                              alt={`Screenshot ${index + 1}`}
                              className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="absolute bottom-4 left-4 text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              Screenshot {index + 1}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* ML Development Timeline */}
              <section id="timeline">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-8 bg-gradient-to-b from-accent to-primary rounded-full"></div>
                    <h2 className="text-2xl font-bold text-foreground">
                      Development Timeline
                    </h2>
                  </div>

                  <Card className="border-border/50 bg-card/30 backdrop-blur-sm">
                    <CardContent className="p-8">
                      <MLDevelopmentSteps />
                    </CardContent>
                  </Card>
                </div>
              </section>

              {/* Features Section */}
              {project.features && (
                <section id="features">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <Zap className="w-6 h-6 text-primary" />
                      <h2 className="text-2xl font-bold text-foreground">
                        Features
                      </h2>
                    </div>

                    <Card className="border-border/50 bg-gradient-to-br from-card/40 to-card/60 backdrop-blur-sm">
                      <CardContent className="p-8">
                        <div
                          className="text-card-foreground whitespace-pre-wrap leading-relaxed prose prose-lg max-w-none"
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(
                              decodeHTML(project.features)
                            ),
                          }}
                        />
                      </CardContent>
                    </Card>
                  </div>
                </section>
              )}

              {/* Challenges Section */}
              {project.challenges && (
                <section id="challenges">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      </div>
                      <h2 className="text-2xl font-bold text-foreground">
                        Challenges & Solutions
                      </h2>
                    </div>

                    <Card className="border-border/50 bg-gradient-to-br from-orange-50/30 to-red-50/30 dark:from-orange-950/20 dark:to-red-950/20 backdrop-blur-sm">
                      <CardContent className="p-8">
                        <div
                          className="text-card-foreground whitespace-pre-wrap leading-relaxed prose prose-lg max-w-none"
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(
                              decodeHTML(project.challenges)
                            ),
                          }}
                        />
                      </CardContent>
                    </Card>
                  </div>
                </section>
              )}

              {/* Achievements Section */}
              {project.achievements && (
                <section id="achievements">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      </div>
                      <h2 className="text-2xl font-bold text-foreground">
                        Achievements & Impact
                      </h2>
                    </div>

                    <Card className="border-border/50 bg-gradient-to-br from-green-50/30 to-emerald-50/30 dark:from-green-950/20 dark:to-emerald-950/20 backdrop-blur-sm">
                      <CardContent className="p-8">
                        <div
                          className="text-card-foreground whitespace-pre-wrap leading-relaxed prose prose-lg max-w-none"
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(
                              decodeHTML(project.achievements)
                            ),
                          }}
                        />
                      </CardContent>
                    </Card>
                  </div>
                </section>
              )}

              {/* Accessibility Section */}
              {project.accessibility && (
                <section id="accessibility">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      </div>
                      <h2 className="text-2xl font-bold text-foreground">
                        Accessibility
                      </h2>
                    </div>

                    <Card className="border-border/50 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 dark:from-blue-950/20 dark:to-indigo-950/20 backdrop-blur-sm">
                      <CardContent className="p-8">
                        <div
                          className="text-card-foreground whitespace-pre-wrap leading-relaxed prose prose-lg max-w-none"
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(
                              decodeHTML(project.accessibility)
                            ),
                          }}
                        />
                      </CardContent>
                    </Card>
                  </div>
                </section>
              )}

              {/* Technology Deep Dive */}
              {project.technologies?.length > 0 && (
                <section id="technologies">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <Code className="w-6 h-6 text-primary" />
                      <h2 className="text-2xl font-bold text-foreground">
                        Technology Stack
                      </h2>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {project.technologies.map((tech, i) => (
                        <Card
                          key={i}
                          className="group border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
                        >
                          <CardContent className="p-4">
                            <div className="flex flex-col items-center gap-3 text-center">
                              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors group-hover:scale-110 transform duration-300">
                                <TechIcon techName={tech} />
                              </div>
                              <span className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">
                                {tech}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProjectDetail;
