
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Download, Github, Calendar, Code, Zap, Clock, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import Layout from '../components/Layout';
import TechIcon from '@/components/TechIcon';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Project data - in a real app, this would come from an API or database
const projectsData = {
  "Bongo - The bengali Tales": {
    id: "bongo-bengali-tales",
    title: "Bongo - The bengali Tales",
    description: "Interactive storytelling platform featuring Bengali mythology and cultural narratives",
    longDescription: "Bongo is a comprehensive digital platform that brings Bengali mythology and cultural stories to life through interactive storytelling. The platform features immersive narratives, multimedia content, and educational resources designed to preserve and share Bengali heritage with modern audiences.",
    features: [
      "Interactive storytelling with multimedia elements",
      "Rich Bengali mythology content library",
      "Audio narration in Bengali and English",
      "Cultural context and historical background",
      "User-friendly navigation and search",
      "Mobile-responsive design",
      "Bookmark and favorites system",
      "Social sharing capabilities"
    ],
    techUsed: ["React", "Javascript", "Node.js", "MongoDB", "Express"],
    screenshots: [
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1516414447565-b14be0adf13e?w=800&h=600&fit=crop"
    ],
    duration: "4 months",
    projectType: "Web Application",
    version: "v2.0",
    status: "Active",
    challenges: "Creating an engaging user experience while maintaining cultural authenticity and ensuring content accessibility across different age groups.",
    achievements: "Successfully launched with over 1,000 active users and positive feedback from Bengali cultural organizations.",
    accessibility: "Designed with screen reader compatibility, high contrast mode, and multilingual support for Bengali and English speakers.",
    demoLink: "https://example.com/bongo-demo",
    repoLink: "https://github.com/example/bongo-bengali-tales",
    downloadLink: "https://example.com/bongo-download",
    tags: ["Youtube", "Videos"],
    links: [{ type: "youtube", url: "#", label: "Youtube" }]
  },
  "AiChat": {
    id: "aichat",
    title: "AiChat",
    description: "Advanced AI-powered chat application with spiritual guidance capabilities",
    longDescription: "AiChat is an innovative conversational AI platform that provides spiritual guidance and personal development support. Built with cutting-edge natural language processing, it offers personalized conversations, meditation guidance, and spiritual insights tailored to individual needs.",
    features: [
      "Advanced AI conversation engine",
      "Spiritual guidance and counseling",
      "Personalized meditation recommendations",
      "Multi-language support",
      "Voice-to-text integration",
      "Conversation history and analytics",
      "Mood tracking and insights",
      "Integration with wellness platforms"
    ],
    techUsed: ["React", "Javascript", "Python", "OpenAI API", "Firebase"],
    screenshots: [
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop"
    ],
    duration: "6 months",
    projectType: "AI Application",
    version: "v1.5",
    status: "Active",
    challenges: "Implementing responsible AI practices while maintaining engaging and helpful conversations, especially in sensitive spiritual contexts.",
    achievements: "Achieved 95% user satisfaction rate and helped over 5,000 users with spiritual guidance sessions.",
    accessibility: "Voice interaction support, customizable text sizes, and compatibility with assistive technologies.",
    demoLink: "https://example.com/aichat-demo",
    repoLink: "https://github.com/example/aichat",
    downloadLink: "https://example.com/aichat-download",
    tags: ["Personal", "AI", "LLM", "Chat"],
    links: [{ type: "link", url: "#", label: "Link" }]
  },
  "Freelance Designer Platform": {
    id: "freelance-designer-platform",
    title: "Freelance Designer Platform",
    description: "Curated platform connecting top Bangladeshi freelance designers with D2C brands",
    longDescription: "A sophisticated marketplace platform that bridges the gap between talented Bangladeshi freelance designers and direct-to-consumer brands. The platform features a rigorous vetting process, project management tools, and quality assurance systems to ensure exceptional design outcomes.",
    features: [
      "Designer vetting and verification system",
      "Advanced portfolio showcase",
      "Integrated project management",
      "Secure payment processing",
      "Real-time collaboration tools",
      "Quality assurance workflows",
      "Client feedback and review system",
      "Analytics and reporting dashboard"
    ],
    techUsed: ["React", "Flask", "PostgreSQL", "Redis", "Stripe API"],
    screenshots: [
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop"
    ],
    duration: "8 months",
    projectType: "Marketplace Platform",
    version: "v1.2",
    status: "In Development",
    challenges: "Building trust between international clients and local designers while ensuring quality standards and timely delivery across different time zones.",
    achievements: "Successfully onboarded 200+ verified designers and facilitated over $50,000 in project transactions in beta phase.",
    accessibility: "Multi-currency support, mobile-first design, and comprehensive accessibility features for global users.",
    demoLink: "https://example.com/freelance-demo",
    repoLink: "https://github.com/example/freelance-platform",
    downloadLink: "https://example.com/freelance-download",
    tags: ["Web", "Platform", "Business"],
    links: [{ type: "link", url: "#", label: "Preview" }]
  },
  "Text Anonymizer": {
    id: "text-anonymizer",
    title: "Text Anonymizer",
    description: "Advanced privacy protection tool for automatic text anonymization",
    longDescription: "A powerful privacy-first application that automatically detects and anonymizes personally identifiable information (PII) in text documents. Using advanced machine learning algorithms, it ensures data privacy compliance while maintaining document readability and context.",
    features: [
      "Automatic PII detection using ML",
      "Custom anonymization rules engine",
      "Batch processing capabilities",
      "Multi-format support (PDF, DOCX, TXT)",
      "Real-time text analysis",
      "GDPR compliance features",
      "API integration support",
      "Audit trail and logging"
    ],
    techUsed: ["Typescript", "Angular", "Python", "spaCy", "Docker"],
    screenshots: [
      "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop"
    ],
    duration: "5 months",
    projectType: "Privacy Tool",
    version: "v2.1",
    status: "Active",
    challenges: "Balancing high accuracy in PII detection with maintaining document context and readability while ensuring compliance with various privacy regulations.",
    achievements: "Processed over 100,000 documents with 98% accuracy rate and achieved SOC 2 compliance certification.",
    accessibility: "Keyboard navigation support, screen reader compatibility, and clear visual indicators for anonymized content.",
    demoLink: "https://example.com/anonymizer-demo",
    repoLink: "https://github.com/example/text-anonymizer",
    downloadLink: "https://example.com/anonymizer-download",
    tags: ["Tool", "Privacy", "AI"],
    links: [{ type: "link", url: "#", label: "Demo" }]
  }
};

const ProjectDetail = () => {
  const { projectName } = useParams<{ projectName: string }>();
  
  console.log('ProjectDetail component rendered');
  console.log('Project name from URL:', projectName);
  
  if (!projectName) {
    console.log('No project name provided in URL');
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Project Not Found</h1>
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

  // Decode the project name from URL
  const decodedProjectName = decodeURIComponent(projectName);
  console.log('Decoded project name:', decodedProjectName);
  console.log('Available projects:', Object.keys(projectsData));
  
  const project = projectsData[decodedProjectName as keyof typeof projectsData];
  console.log('Found project data:', project ? 'Yes' : 'No');

  if (!project) {
    console.log('Project not found in data');
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Project Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The project "{decodedProjectName}" could not be found.</p>
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

  // Get project list for navigation
  const projectList = Object.keys(projectsData);
  const currentIndex = projectList.indexOf(decodedProjectName);
  const previousProject = currentIndex > 0 ? projectList[currentIndex - 1] : null;
  const nextProject = currentIndex < projectList.length - 1 ? projectList[currentIndex + 1] : null;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Back Button */}
        <div className="mb-8">
          <Link to="/projects">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </Link>
        </div>

        {/* Project Header */}
        <div className="mb-12">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">{project.title}</h1>
            <Badge variant="secondary" className={project.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
              {project.status}
            </Badge>
            <Badge variant="outline">{project.version}</Badge>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">{project.description}</p>
          
          {/* Quick Info */}
          <div className="flex flex-wrap gap-6 text-sm text-gray-500 dark:text-gray-400 mb-6">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Duration: {project.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              <span>Type: {project.projectType}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
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

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-12">
          {project.demoLink && (
            <Button asChild>
              <a href={project.demoLink} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Live Demo
              </a>
            </Button>
          )}
          {project.repoLink && (
            <Button variant="outline" asChild>
              <a href={project.repoLink} target="_blank" rel="noopener noreferrer">
                <Github className="w-4 h-4 mr-2" />
                View Code
              </a>
            </Button>
          )}
          {project.downloadLink && (
            <Button variant="outline" asChild>
              <a href={project.downloadLink} target="_blank" rel="noopener noreferrer">
                <Download className="w-4 h-4 mr-2" />
                Download Files
              </a>
            </Button>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Screenshots and Details */}
          <div className="lg:col-span-2">
            {/* Screenshots */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Project Screenshots</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.screenshots.map((screenshot, index) => (
                    <img
                      key={index}
                      src={screenshot}
                      alt={`${project.title} screenshot ${index + 1}`}
                      className="rounded-lg shadow-md w-full h-64 object-cover hover:shadow-lg transition-shadow"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Detailed Description */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>About This Project</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{project.longDescription}</p>
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Key Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {project.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Technical Details */}
          <div className="space-y-6">
            {/* Technologies Used */}
            <Card>
              <CardHeader>
                <CardTitle>Technologies Used</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {project.techUsed.map((tech, index) => (
                    <div key={index} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-lg">
                      <TechIcon techName={tech} className="w-4 h-4" />
                      <span className="text-sm font-medium">{tech}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Challenges & Solutions */}
            {project.challenges && (
              <Card>
                <CardHeader>
                  <CardTitle>Challenges & Solutions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{project.challenges}</p>
                </CardContent>
              </Card>
            )}

            {/* Achievements */}
            {project.achievements && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{project.achievements}</p>
                </CardContent>
              </Card>
            )}

            {/* Accessibility */}
            {project.accessibility && (
              <Card>
                <CardHeader>
                  <CardTitle>Accessibility Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{project.accessibility}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Project Navigation */}
        <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex-1">
            {previousProject && (
              <Link 
                to={`/projects/${encodeURIComponent(previousProject)}`}
                className="group flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <div>
                  <div className="text-sm text-gray-500">Previous Project</div>
                  <div className="font-medium group-hover:underline">{previousProject}</div>
                </div>
              </Link>
            )}
          </div>
          
          <div className="flex-1 text-right">
            {nextProject && (
              <Link 
                to={`/projects/${encodeURIComponent(nextProject)}`}
                className="group flex items-center justify-end gap-2 text-gray-600 hover:text-primary transition-colors"
              >
                <div>
                  <div className="text-sm text-gray-500">Next Project</div>
                  <div className="font-medium group-hover:underline">{nextProject}</div>
                </div>
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProjectDetail;
