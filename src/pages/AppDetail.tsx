
import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, ExternalLink, Download, Github, Calendar, Code, Zap } from 'lucide-react';
import Layout from '../components/Layout';
import TechIcon from '@/components/TechIcon';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getDynamicContent } from "@/integrations/firebase/firestore";
import { toast } from "sonner";

interface AppItem {
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
  features?: string[];
  challenges?: string;
  achievements?: string;
  accessibility?: string;
  longDescription?: string;
}

const AppDetail = () => {
  const { appName } = useParams<{ appName: string }>();
  const [app, setApp] = useState<AppItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  
  console.log('AppDetail component rendered');
  console.log('App name from URL:', appName);
  
  useEffect(() => {
    const fetchApp = async () => {
      if (!appName) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const decodedAppName = decodeURIComponent(appName);
        console.log('Decoded app name:', decodedAppName);
        
        const { data, error } = await getDynamicContent('apps');
        
        if (error) {
          console.error('Error fetching apps:', error);
          toast.error('Failed to load app data');
          setNotFound(true);
          return;
        }

        if (data && Array.isArray(data)) {
          const foundApp = data.find((appItem: AppItem) => appItem.title === decodedAppName);
          console.log('Found app:', foundApp ? 'Yes' : 'No');
          
          if (foundApp) {
            setApp(foundApp);
            setNotFound(false);
          } else {
            setNotFound(true);
          }
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error('Error fetching app:', error);
        toast.error('Failed to load app data');
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchApp();
  }, [appName]);

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="flex justify-center items-center py-12">
            <div className="text-lg text-gray-600 dark:text-gray-400">Loading app details...</div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!appName || notFound || !app) {
    const decodedAppName = appName ? decodeURIComponent(appName) : '';
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">App Not Found</h1>
          {decodedAppName && (
            <p className="text-gray-600 dark:text-gray-400 mb-6">The app "{decodedAppName}" could not be found.</p>
          )}
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
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">{app.title}</h1>
            <Badge variant="secondary">{app.status || 'Active'}</Badge>
            {app.version && <Badge variant="outline">{app.version}</Badge>}
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">{app.about || app.longDescription || 'No description available'}</p>
          
          {/* Quick Info */}
          <div className="flex flex-wrap gap-6 text-sm text-gray-500 dark:text-gray-400">
            {app.duration && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Duration: {app.duration}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              <span>Type: {app.type}</span>
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
          {app.codeLink && (
            <Button variant="outline" asChild>
              <a href={app.codeLink} target="_blank" rel="noopener noreferrer">
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
            {/* Screenshots */}
            {app.screenshots && app.screenshots.length > 0 && (
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
                        alt={`${app.title} screenshot ${index + 1}`}
                        className="rounded-lg shadow-md w-full h-64 object-cover"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Detailed Description */}
            {(app.longDescription || app.about) && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>About This App</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{app.longDescription || app.about}</p>
                </CardContent>
              </Card>
            )}

            {/* Features */}
            {app.features && app.features.length > 0 && (
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
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Technical Details */}
          <div className="space-y-6">
            {/* Technologies Used */}
            {app.technologies && app.technologies.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Technologies Used</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {app.technologies.map((tech, index) => (
                      <div key={index} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-lg">
                        <TechIcon techName={tech} className="w-4 h-4" />
                        <span className="text-sm font-medium">{tech}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Challenges & Solutions */}
            {app.challenges && (
              <Card>
                <CardHeader>
                  <CardTitle>Challenges & Solutions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{app.challenges}</p>
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
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{app.achievements}</p>
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
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{app.accessibility}</p>
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
