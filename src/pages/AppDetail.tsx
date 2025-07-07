
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Back Button */}
        <div className="mb-6 sm:mb-8">
          <Link to="/apps">
            <Button variant="outline" size="sm" className="sm:size-default">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Apps
            </Button>
          </Link>
        </div>

        {/* App Header */}
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-4 mb-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white break-words">{app.title}</h1>
            <div className="flex gap-2">
              <Badge variant="secondary">{app.status || 'Active'}</Badge>
              {app.version && <Badge variant="outline">{app.version}</Badge>}
            </div>
          </div>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 leading-relaxed">{app.about || app.longDescription || 'No description available'}</p>
          
          {/* Quick Info */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-6 text-sm text-gray-500 dark:text-gray-400">
            {app.duration && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span>Duration: {app.duration}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 flex-shrink-0" />
              <span>Type: {app.type}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-8 sm:mb-12">
          {app.demoLink && (
            <Button asChild className="w-full sm:w-auto">
              <a href={app.demoLink} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Live Demo
              </a>
            </Button>
          )}
          {app.codeLink && (
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <a href={app.codeLink} target="_blank" rel="noopener noreferrer">
                <Github className="w-4 h-4 mr-2" />
                View Code
              </a>
            </Button>
          )}
          {app.downloadLink && (
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <a href={app.downloadLink} target="_blank" rel="noopener noreferrer">
                <Download className="w-4 h-4 mr-2" />
                Download
              </a>
            </Button>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Screenshots */}
          <div className="lg:col-span-2">
            {/* Screenshots */}
            {app.screenshots && app.screenshots.length > 0 && (
              <Card className="mb-6 sm:mb-8">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Screenshots</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {app.screenshots.map((screenshot, index) => (
                      <img
                        key={index}
                        src={screenshot}
                        alt={`${app.title} screenshot ${index + 1}`}
                        className="rounded-lg shadow-md w-full h-48 sm:h-64 object-cover"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Detailed Description */}
            {(app.longDescription || app.about) && (
              <Card className="mb-6 sm:mb-8">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">About This App</CardTitle>
                </CardHeader>
                 <CardContent>
                   <div 
                     className="text-gray-700 dark:text-gray-300 leading-relaxed prose prose-sm max-w-none dark:prose-invert"
                     dangerouslySetInnerHTML={{ __html: app.longDescription || app.about || '' }}
                   />
                 </CardContent>
              </Card>
            )}

            {/* Features */}
            {app.features && app.features.length > 0 && (
              <Card className="mb-6 sm:mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Zap className="w-5 h-5" />
                    Key Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {app.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Technical Details */}
          <div className="space-y-4 sm:space-y-6">
            {/* Technologies Used */}
            {app.technologies && app.technologies.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Technologies Used</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {app.technologies.map((tech, index) => (
                      <div key={index} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg">
                        <TechIcon techName={tech} className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="text-xs sm:text-sm font-medium">{tech}</span>
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
                  <CardTitle className="text-lg sm:text-xl">Challenges & Solutions</CardTitle>
                </CardHeader>
                 <CardContent>
                   <div 
                     className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed prose prose-sm max-w-none dark:prose-invert"
                     dangerouslySetInnerHTML={{ __html: app.challenges || '' }}
                   />
                 </CardContent>
              </Card>
            )}

            {/* Achievements */}
            {app.achievements && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Achievements</CardTitle>
                </CardHeader>
                 <CardContent>
                   <div 
                     className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed prose prose-sm max-w-none dark:prose-invert"
                     dangerouslySetInnerHTML={{ __html: app.achievements || '' }}
                   />
                 </CardContent>
              </Card>
            )}

            {/* Accessibility */}
            {app.accessibility && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Accessibility</CardTitle>
                </CardHeader>
                 <CardContent>
                   <div 
                     className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed prose prose-sm max-w-none dark:prose-invert"
                     dangerouslySetInnerHTML={{ __html: app.accessibility || '' }}
                   />
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
