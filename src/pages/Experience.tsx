import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Badge } from "@/components/ui/badge";
import { Calendar, ExternalLink } from "lucide-react";
import { getDynamicContent } from "@/integrations/firebase/firestore";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        const { data, error } = await getDynamicContent("experience");

        if (error) {
          console.error("Error fetching experiences:", error);
          toast.error("Failed to load experiences");
          return;
        }

        if (data && Array.isArray(data)) {
          // Filter visible experiences and sort by order
          const visibleExperiences = data
            .filter((exp: Experience) => exp.visible !== false)
            .sort(
              (a: Experience, b: Experience) => (a.order || 0) - (b.order || 0)
            );
          setExperiences(visibleExperiences);
        }
      } catch (error) {
        console.error("Error fetching experiences:", error);
        toast.error("Failed to load experiences");
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

    if (experience.badgeImage && experience.badgeImage.startsWith("http")) {
      return (
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${badgeClass}`}
        >
          <img
            src={experience.badgeImage}
            alt={experience.company}
            className="w-8 h-8 rounded-full object-cover"
          />
        </div>
      );
    }

    const initial = experience.badgeImage || experience.company?.[0] || "C";
    return (
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${badgeClass} font-bold text-lg`}
      >
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
      {isMobile ? (
        <div className="relative pt-16 lg:pt-0 px-6 py-12 lg:py-24 max-w-4xl mx-auto  text-foreground transition-colors duration-300">
          {/* Header Section */}

          <div className="mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Experiences
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              A timeline of my professional experiences.
            </p>
          </div>

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
              {/* Rects with animation */}
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

          {/* Experience Cards */}
          <div className="space-y-8">
            {experiences.map((experience) => (
              <div
                key={experience.id}
                className="bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {experience.position} at{" "}
                      <span className="text-blue-600 dark:text-blue-400">
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
                          <span className="font-medium">
                            {experience.company}
                          </span>
                        )}
                      </span>
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">
                      {experience.startDate} - {experience.endDate}
                    </p>
                  </div>

                  {/* Logo placeholder - you can replace this with actual company logos */}
                  <div className="ml-6 flex-shrink-0">
                    <div className="w-16 h-16 bg-black dark:bg-white rounded-lg flex items-center justify-center">
                      <span className="text-white dark:text-black font-bold text-lg">
                        <img
                          src={experience.badgeImage}
                          alt={experience.company}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {experience.description}
                  </p>

                  {/* Achievements */}
                  <ul className="space-y-2">
                    {experience.bullets.map((achievement, index) => (
                      <li
                        key={index}
                        className="flex items-start text-gray-700 dark:text-gray-300"
                      >
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                        <span className="leading-relaxed">{achievement}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Tech Stack */}
                  <div className="pt-2">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Tech Stack
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {experience.techStack.map((tech, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="px-3 py-1 text-xs font-medium bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Skills Section */}
          <div className="mt-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Core Skills & Technologies
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Frontend
                </h3>
                <div className="flex flex-wrap gap-2">
                  {["ReactJs", "Typescript", "TailwindCSS", "Next.js"].map(
                    (skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    )
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Backend
                </h3>
                <div className="flex flex-wrap gap-2">
                  {["Python", "FastAPI", "Django", "PostgreSQL", "MongoDB"].map(
                    (skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    )
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  DevOps
                </h3>
                <div className="flex flex-wrap gap-2">
                  {["AWS", "Docker", "Kubernetes", "GitHub Actions"].map(
                    (skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        //laptop viewwwwwwwwwwwwwwwwwwwwwwwww

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
              <p className="text-gray-600">
                No experiences available at the moment.
              </p>
            </div>
          ) : (
            /* Timeline */
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

              <div className="space-y-12">
                {experiences.map((experience, index) => (
                  <div
                    key={experience.id}
                    className="relative flex items-start space-x-6"
                  >
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
                            <span className="font-medium">
                              {experience.company}
                            </span>
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
                        dangerouslySetInnerHTML={{
                          __html: experience.description,
                        }}
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
                      {experience.techStack &&
                        experience.techStack.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-gray-800 mb-2">
                              Tech Stack
                            </h4>
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
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Frontend
                </h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {["React", "TypeScript", "TailwindCSS", "Next.js"].map(
                    (skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="px-3 py-1"
                      >
                        {skill}
                      </Badge>
                    )
                  )}
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Backend
                </h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {["Node.js", "Python", "Firebase", "PostgreSQL"].map(
                    (skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="px-3 py-1"
                      >
                        {skill}
                      </Badge>
                    )
                  )}
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  DevOps
                </h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {["Docker", "AWS", "CI/CD", "GitHub Actions"].map((skill) => (
                    <Badge key={skill} variant="outline" className="px-3 py-1">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Experience;
