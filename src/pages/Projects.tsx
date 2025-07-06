
import Layout from "../components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Youtube } from "lucide-react";

const Projects = () => {
  const projects = [
    {
      id: 1,
      title: "Katha - The Hindu Tales",
      description: "Interactive storytelling platform featuring Hindu mythology",
      image: "/lovable-uploads/c228c517-bfd2-4a2f-ae08-19cf7ccde212.png",
      status: "active",
      links: [
        { type: "youtube", url: "#", label: "Youtube" }
      ],
      tags: ["Youtube", "Videos"]
    },
    {
      id: 2,
      title: "Gitachat",
      description: "Chat with Gita - AI-powered spiritual guidance",
      image: "/placeholder.svg",
      status: "active",
      links: [
        { type: "link", url: "#", label: "Link" }
      ],
      tags: ["Personal", "AI", "LLM", "Chat"]
    },
    {
      id: 3,
      title: "Freelance Designer Platform",
      description: "Top Indian Freelance Designers, Handpicked for D2Cs",
      image: "/placeholder.svg",
      status: "development",
      links: [
        { type: "link", url: "#", label: "Preview" }
      ],
      tags: ["Web", "Platform", "Business"]
    },
    {
      id: 4,
      title: "Text Anonymizer",
      description: "Advanced text anonymization tool for privacy protection",
      image: "/placeholder.svg",
      status: "active",
      links: [
        { type: "link", url: "#", label: "Demo" }
      ],
      tags: ["Tool", "Privacy", "AI"]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "development":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getButtonIcon = (type: string) => {
    switch (type) {
      case "youtube":
        return <Youtube className="w-4 h-4" />;
      case "link":
        return <ExternalLink className="w-4 h-4" />;
      default:
        return <ExternalLink className="w-4 h-4" />;
    }
  };

  return (
    <Layout>
      <div className="relative pt-16 lg:pt-0 px-6 py-12 lg:py-24 max-w-4xl mx-auto bg-background text-foreground transition-colors duration-300">
          {/* Header Section */}
          <div className="mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Projects
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Playground - Small MVP to Production Apps
            </p>
          </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projects.map((project) => (
            <Card key={project.id} className="group hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white">
              <CardContent className="p-0">
                {/* Project Image */}
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Status Badge - positioned over image */}
                  <div className="absolute top-4 right-4">
                    <Badge 
                      variant="outline" 
                      className={`text-xs font-medium ${getStatusColor(project.status)}`}
                    >
                      {project.status}
                    </Badge>
                  </div>
                </div>

                {/* Project Content */}
                <div className="p-6">
                  {/* Title and Description */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {project.description}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {project.links.map((link, index) => (
                        <Button
                          key={index}
                          variant="default"
                          size="sm"
                          className="bg-gray-900 text-white hover:bg-gray-800 transition-colors"
                          asChild
                        >
                          <a href={link.url} className="flex items-center gap-2">
                            {getButtonIcon(link.type)}
                            {link.label}
                          </a>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Projects;
