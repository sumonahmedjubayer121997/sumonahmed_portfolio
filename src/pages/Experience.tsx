
import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Badge } from "@/components/ui/badge";
import { Calendar, ExternalLink } from "lucide-react";
import { getDynamicContent } from "@/integrations/firebase/firestore";
import { toast } from "sonner";

interface Experience {
  id: string;
  position: string;
  company: string;
  companyUrl?: string;
  startDate: string;
  endDate: string;
  description: string;
  bullets: string[];
  techStack: string[];
  badgeImage?: string;
  badgeColor: string;
  order: number;
  visible: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const Experience = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        const { data, error } = await getDynamicContent('experience');
        
        if (error) {
          console.error('Error fetching experiences:', error);
          toast.error('Failed to load experiences');
          return;
        }

        if (data && Array.isArray(data)) {
          // Filter visible experiences and sort by order
          const visibleExperiences = data
            .filter((exp: Experience) => exp.visible !== false)
            .sort((a: Experience, b: Experience) => (a.order || 0) - (b.order || 0));
          setExperiences(visibleExperiences);
        }
      } catch (error) {
        console.error('Error fetching experiences:', error);
        toast.error('Failed to load experiences');
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  const getBadgeColorClass = (color: string) => {
    const colorMap = {
      blue: "bg-blue-100 text-blue-800 border-blue-200",
      green: "bg-green-100 text-green-800 border-green-200",
      purple: "bg-purple-100 text-purple-800 border-purple-200",
      red: "bg-red-100 text-red-800 border-red-200",
      yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
      indigo: "bg-indigo-100 text-indigo-800 border-indigo-200",
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const renderBadge = (experience: Experience) => {
    const badgeClass = getBadgeColorClass(experience.badgeColor);
    
    if (experience.badgeImage && experience.badgeImage.startsWith('http')) {
      return (
        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${badgeClass}`}>
          <img 
            src={experience.badgeImage} 
            alt={experience.company}
            className="w-8 h-8 rounded-full object-cover"
          />
        </div>
      );
    }
    
    const initial = experience.badgeImage || experience.company?.[0] || 'C';
    return (
      <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${badgeClass} font-bold text-lg`}>
        {initial}
      </div>
    );
  };

  if (loading) {
    return (
      <Layout>
        <div className="pt-16 lg:pt-0 px-6 py-12 lg:py-24 max-w-4xl mx-auto">
          <div className="flex justify-center items-center py-12">
            <div className="text-lg text-gray-600">Loading experiences...</div>
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
            Experiences
          </h1>
          <p className="text-xl text-gray-600">
            A timeline of my professional experiences.
          </p>
        </div>

        {experiences.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No experiences available at the moment.</p>
          </div>
        ) : (
          /* Timeline */
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            
            <div className="space-y-12">
              {experiences.map((experience, index) => (
                <div key={experience.id} className="relative flex items-start space-x-6">
                  {/* Timeline dot and badge */}
                  <div className="relative flex-shrink-0">
                    {renderBadge(experience)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    {/* Header */}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {experience.position}
                      </h3>
                      <div className="flex items-center space-x-4 text-gray-600 mb-2">
                        {experience.companyUrl ? (
                          <a
                            href={experience.companyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 hover:underline font-medium"
                          >
                            <span>{experience.company}</span>
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        ) : (
                          <span className="font-medium">{experience.company}</span>
                        )}
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm">
                            {experience.startDate} - {experience.endDate}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div 
                      className="prose prose-gray max-w-none mb-4 text-gray-700"
                      dangerouslySetInnerHTML={{ __html: experience.description }}
                    />

                    {/* Bullet Points */}
                    {experience.bullets && experience.bullets.length > 0 && (
                      <ul className="list-disc list-inside space-y-1 mb-4 text-gray-700">
                        {experience.bullets.map((bullet, bulletIndex) => (
                          <li key={bulletIndex} className="text-sm">
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Tech Stack */}
                    {experience.techStack && experience.techStack.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-800 mb-2">Tech Stack</h4>
                        <div className="flex flex-wrap gap-2">
                          {experience.techStack.map((tech, techIndex) => (
                            <Badge 
                              key={techIndex}
                              variant="secondary" 
                              className="px-3 py-1 text-xs bg-gray-100 text-gray-700 hover:bg-gray-200"
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Core Skills & Technologies Section */}
        <div className="mt-16 pt-12 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Core Skills & Technologies
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Frontend</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {['React', 'TypeScript', 'TailwindCSS', 'Next.js'].map((skill) => (
                  <Badge key={skill} variant="outline" className="px-3 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Backend</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {['Node.js', 'Python', 'Firebase', 'PostgreSQL'].map((skill) => (
                  <Badge key={skill} variant="outline" className="px-3 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">DevOps</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {['Docker', 'AWS', 'CI/CD', 'GitHub Actions'].map((skill) => (
                  <Badge key={skill} variant="outline" className="px-3 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Experience;
