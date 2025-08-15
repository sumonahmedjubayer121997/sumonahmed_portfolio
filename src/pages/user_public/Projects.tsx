import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import TechIcon from "@/components/TechIcon";
import Layout from "../../components/Layout";
import { getDynamicContent } from "@/integrations/firebase/firestore";
import { toast } from "sonner";
import DOMPurify from "dompurify";
import Title from "./uif/Title";

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
  visible?: boolean;
}

// Strip HTML tags from a string safely
function stripHtmlTags(html: string): string {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
}

const Projects = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const { data, error } = await getDynamicContent("projects");

        if (error) {
          console.error("Error fetching projects:", error);
          toast.error("Failed to load projects");
          return;
        }

        if (data && Array.isArray(data)) {
          const visibleProjects = (data as ProjectItem[]).filter(
            (project) => project.visible !== false
          );
          setProjects(visibleProjects);
          console.log(projects);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast.error("Failed to load projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  console.log("Projects page rendered", { projects, loading });

  return (
    <Layout>
      <div className="relative pt-16 lg:pt-0 px-6 py-12 lg:py-24 max-w-4xl mx-auto text-foreground transition-colors duration-300 overflow-hidden">
        {/* SVG background */}
        <div className="absolute top-0 -mt-20 right-0 opacity-40 z-0 hidden sm:block">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 631 620"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-full h-full max-w-[200px] sm:max-w-[300px] md:max-w-[400px]"
          >
            <rect
              x="254.558"
              y="1.41421"
              width="122"
              height="358"
              rx="61"
              transform="rotate(45 254.558 1.41421)"
              stroke="purple"
            >
              <animate
                attributeName="stroke-dasharray"
                from="0,1000"
                to="1000,0"
                dur="3s"
                fill="freeze"
              />
            </rect>
            <rect
              x="341.105"
              y="421.087"
              width="122"
              height="358"
              rx="61"
              transform="rotate(135 341.105 421.087)"
              stroke="purple"
            >
              <animate
                attributeName="stroke-dasharray"
                from="0,1000"
                to="1000,0"
                dur="3s"
                fill="freeze"
                begin="0.5s"
              />
            </rect>
            <rect
              y="1.41421"
              width="122"
              height="358"
              rx="61"
              transform="matrix(-0.707107 0.707107 0.707107 0.707107 374.96 111.414)"
              stroke="purple"
            >
              <animate
                attributeName="stroke-dasharray"
                from="0,1000"
                to="1000,0"
                dur="3s"
                fill="freeze"
                begin="1s"
              />
            </rect>
            <rect
              x="1.41421"
              y="0"
              width="122"
              height="358"
              rx="61"
              transform="matrix(0.707107 0.707107 0.707107 -0.707107 288.414 531.087)"
              stroke="purple"
            >
              <animate
                attributeName="stroke-dasharray"
                from="0,1000"
                to="1000,0"
                dur="3s"
                fill="freeze"
                begin="1.5s"
              />
            </rect>
          </svg>
        </div>

        {/* Header Section */}
        <div className="mb-12 relative z-10">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Projects
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            A timeline of my personal and client-based projects.
          </p>
        </div>

        {/* Project Cards Section */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-lg text-gray-600 dark:text-gray-300">
              Loading projects...
            </div>
          </div>
        ) : projects.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-lg text-gray-600 dark:text-gray-300">
              No projects found
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto relative z-10">
            {projects.map((project) => {
              const projectLink = `/projects/${encodeURIComponent(
                project.title
              )}`;
              console.log(`Creating link for ${project.title}: ${projectLink}`);

              return (
                <Link
                  key={project.id}
                  to={projectLink}
                  className="w-full group"
                  onClick={() =>
                    console.log(
                      `Clicked on ${project.title}, navigating to ${projectLink}`
                    )
                  }
                >
                  <div className="flex flex-col w-full h-full p-4 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors duration-200 border border-gray-200 group-hover:border-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700">
                    <img
                      src={
                        project.screenshots && project.screenshots.length > 0
                          ? project.screenshots[0]
                          : "https://firebasestorage.googleapis.com/v0/b/taskwise-n03h6.firebasestorage.app/o/public%2Fimages%2Fblood-donation-preview.png?alt=media"
                      }
                      alt={project.title}
                      className="w-full max-h-52 mb-4 object-cover rounded-lg"
                      style={{ borderRadius: "8px" }}
                    />
                    <div className="flex items-center justify-between">
                      <Title title={project.title} />
                      <div className="flex mt-1 space-x-2">
                        {project.technologies?.map((tech, index) => (
                          <div key={index} title={tech}>
                            <TechIcon techName={tech} />
                          </div>
                        ))}
                      </div>
                    </div>
                    <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm">
                      <div
                        className="mt-2 text-gray-600 dark:text-gray-300 text-sm break-words whitespace-pre-wrap overflow-hidden"
                        dangerouslySetInnerHTML={{
                          __html: (() => {
                            const rawHtml =
                              project.about || "No description available";
                            const sanitizedHtml = DOMPurify.sanitize(rawHtml);
                            const shortHtml =
                              sanitizedHtml.length > 150
                                ? sanitizedHtml.substring(0, 147) + "..."
                                : sanitizedHtml;
                            return shortHtml;
                          })(),
                        }}
                      ></div>
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Projects;
