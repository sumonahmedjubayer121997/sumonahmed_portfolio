
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Download, Github, Calendar, Code, Zap } from 'lucide-react';
import Layout from '../components/Layout';
import TechIcon from '@/components/TechIcon';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// App data - in a real app, this would come from an API or database
const appData = {
  "Blood Donation Guide": {
    id: "blood-donation-guide",
    name: "Blood Donation Guide",
    description: "A comprehensive mobile application designed to educate users about blood donation processes, eligibility criteria, and help connect donors with recipients. The app provides essential information about blood types, donation procedures, and maintains a database of blood banks.",
    longDescription: "The Blood Donation Guide app serves as a bridge between blood donors and those in need. It features an intuitive interface that guides users through the donation process, provides real-time information about blood bank locations, and includes educational content about the importance of blood donation.",
    features: [
      "Blood type compatibility checker",
      "Nearby blood bank locator with maps integration",
      "Donation eligibility assessment",
      "Educational content about blood donation",
      "Appointment scheduling system",
      "Donation history tracking",
      "Emergency blood request notifications",
      "Multi-language support"
    ],
    techUsed: ["Python", "Flask", "SQLite", "HTML", "CSS", "JavaScript"],
    screenshots: [
      "https://firstnorth.org/wp-content/uploads/2020/10/Gen-Blood-Drive-web-1.jpg",
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop"
    ],
    duration: "3 months",
    projectType: "Mobile App",
    version: "v2.1",
    status: "Active",
    challenges: "Implementing real-time blood bank data synchronization and ensuring HIPAA compliance for user data protection.",
    achievements: "Successfully connected over 500 donors with recipients in the first 6 months.",
    accessibility: "Designed with high contrast colors and screen reader compatibility for visually impaired users.",
    demoLink: "#",
    repoLink: "#",
    downloadLink: "#"
  },
  "Anonymizer": {
    id: "anonymizer",
    name: "Anonymizer",
    description: "A powerful web application that automatically detects and anonymizes sensitive information in text documents. Perfect for protecting privacy in documents before sharing or publishing.",
    longDescription: "The Anonymizer tool uses advanced natural language processing to identify personally identifiable information (PII) such as names, addresses, phone numbers, and email addresses, then replaces them with generic placeholders while maintaining the document's readability and context.",
    features: [
      "Automatic PII detection using NLP",
      "Custom anonymization rules",
      "Batch processing for multiple documents",
      "Support for various file formats (PDF, DOCX, TXT)",
      "Real-time text analysis",
      "Downloadable anonymized results",
      "Privacy-first approach - no data stored",
      "API integration capabilities"
    ],
    techUsed: ["React", "Javascript", "Node.js", "Python", "spaCy", "PDF.js"],
    screenshots: [
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop"
    ],
    duration: "2 months",
    projectType: "Web App",
    version: "v1.3",
    status: "Active",
    challenges: "Balancing accuracy in PII detection while maintaining document context and readability.",
    achievements: "Processed over 10,000 documents with 95% accuracy in PII detection.",
    accessibility: "Keyboard navigation support and clear visual indicators for anonymized content.",
    demoLink: "#",
    repoLink: "#",
    downloadLink: "#"
  }
};

const AppDetail = () => {
  const { appName } = useParams<{ appName: string }>();
  
  if (!appName) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">App Not Found</h1>
          <Link to="/apps">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Apps
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  // Decode the app name from URL
  const decodedAppName = decodeURIComponent(appName);
  const app = appData[decodedAppName as keyof typeof appData];

  if (!app) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">App Not Found</h1>
          <p className="text-gray-600 mb-6">The app "{decodedAppName}" could not be found.</p>
          <Link to="/apps">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Apps
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Back Button */}
        <div className="mb-8">
          <Link to="/apps">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Apps
            </Button>
          </Link>
        </div>

        {/* App Header */}
        <div className="mb-12">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">{app.name}</h1>
            <Badge variant="secondary">{app.status}</Badge>
            <Badge variant="outline">{app.version}</Badge>
          </div>
          <p className="text-xl text-gray-600 mb-6">{app.description}</p>
          
          {/* Quick Info */}
          <div className="flex flex-wrap gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Duration: {app.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              <span>Type: {app.projectType}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-12">
          {app.demoLink && (
            <Button asChild>
              <a href={app.demoLink} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Live Demo
              </a>
            </Button>
          )}
          {app.repoLink && (
            <Button variant="outline" asChild>
              <a href={app.repoLink} target="_blank" rel="noopener noreferrer">
                <Github className="w-4 h-4 mr-2" />
                View Code
              </a>
            </Button>
          )}
          {app.downloadLink && (
            <Button variant="outline" asChild>
              <a href={app.downloadLink} target="_blank" rel="noopener noreferrer">
                <Download className="w-4 h-4 mr-2" />
                Download
              </a>
            </Button>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Screenshots */}
          <div className="lg:col-span-2">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Screenshots</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {app.screenshots.map((screenshot, index) => (
                    <img
                      key={index}
                      src={screenshot}
                      alt={`${app.name} screenshot ${index + 1}`}
                      className="rounded-lg shadow-md w-full h-64 object-cover"
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
                <p className="text-gray-700 leading-relaxed">{app.longDescription}</p>
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
                  {app.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{feature}</span>
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
                  {app.techUsed.map((tech, index) => (
                    <div key={index} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                      <TechIcon techName={tech} className="w-4 h-4" />
                      <span className="text-sm font-medium">{tech}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Challenges & Solutions */}
            {app.challenges && (
              <Card>
                <CardHeader>
                  <CardTitle>Challenges & Solutions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-sm leading-relaxed">{app.challenges}</p>
                </CardContent>
              </Card>
            )}

            {/* Achievements */}
            {app.achievements && (
              <Card>
                <CardHeader>
                  <CardTitle>Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-sm leading-relaxed">{app.achievements}</p>
                </CardContent>
              </Card>
            )}

            {/* Accessibility */}
            {app.accessibility && (
              <Card>
                <CardHeader>
                  <CardTitle>Accessibility</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-sm leading-relaxed">{app.accessibility}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AppDetail;
