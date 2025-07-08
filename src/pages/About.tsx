
import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Badge } from "@/components/ui/badge";
import { Calendar, ExternalLink } from "lucide-react";
import { getDynamicContent } from "@/integrations/firebase/firestore";
import { toast } from "sonner";

interface AboutData {
  id: string;
  tagline?: string;
  bio: string;
  quote?: string;
  techStack: string[];
  milestones: Array<{
    year: string;
    text: string;
  }>;
  socialLinks: Array<{
    title: string;
    url: string;
    icon?: string;
  }>;
  lastUpdated?: string;
}

const About = () => {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setLoading(true);
        const { data, error } = await getDynamicContent('about');
        
        if (error) {
          console.error('Error fetching about data:', error);
          toast.error('Failed to load about information');
          return;
        }

        if (data && Array.isArray(data) && data.length > 0) {
          setAboutData(data[0] as AboutData);
        }
      } catch (error) {
        console.error('Error fetching about data:', error);
        toast.error('Failed to load about information');
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="pt-16 lg:pt-0 px-6 py-12 lg:py-24 max-w-4xl mx-auto">
          <div className="flex justify-center items-center py-12">
            <div className="text-lg text-gray-600">Loading about information...</div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!aboutData) {
    return (
      <Layout>
        <div className="pt-16 lg:pt-0 px-6 py-12 lg:py-24 max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">About</h1>
            <p className="text-gray-600">About information is not available at the moment.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pt-16 lg:pt-0 px-6 py-12 lg:py-24 max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            About Me
          </h1>
          {aboutData.tagline && (
            <p className="text-xl text-gray-600 mb-6">
              {aboutData.tagline}
            </p>
          )}
        </div>

        {/* Bio Section */}
        <div className="mb-12">
          <div 
            className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: aboutData.bio }}
          />
        </div>

        {/* Quote Section */}
        {aboutData.quote && (
          <div className="mb-12 text-center">
            <blockquote className="text-xl italic text-gray-600 bg-gray-50 p-6 rounded-lg border-l-4 border-blue-500">
              "{aboutData.quote}"
            </blockquote>
          </div>
        )}

        {/* Tech Stack Section */}
        {aboutData.techStack && aboutData.techStack.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Tech Stack</h2>
            <div className="flex flex-wrap gap-3">
              {aboutData.techStack.map((tech, index) => (
                <Badge 
                  key={index}
                  variant="secondary" 
                  className="px-4 py-2 text-sm bg-blue-100 text-blue-800 hover:bg-blue-200"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Milestones Section */}
        {aboutData.milestones && aboutData.milestones.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Milestones</h2>
            <div className="space-y-4">
              {aboutData.milestones.map((milestone, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 text-blue-600 font-semibold min-w-[80px]">
                    <Calendar className="h-4 w-4" />
                    <span>{milestone.year}</span>
                  </div>
                  <p className="text-gray-700 flex-1">{milestone.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Social Links Section */}
        {aboutData.socialLinks && aboutData.socialLinks.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Connect With Me</h2>
            <div className="flex flex-wrap gap-4">
              {aboutData.socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <span>{link.title}</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Last Updated */}
        {aboutData.lastUpdated && (
          <div className="text-center text-sm text-gray-500">
            Last updated: {new Date(aboutData.lastUpdated).toLocaleDateString()}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default About;
