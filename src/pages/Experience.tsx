import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import Layout from "../components/Layout";
import { useIsMobile } from "@/hooks/use-mobile";

const isMobile= useIsMobile();

const Experience = () => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const experiences = [
    {
      id: 1,
      title: "Founding Product Engineer",
      company: "kay.ai",
      period: "Mar 2024 - Current",
      description:
        "Building Operator for Insurance Industry, leading Frontend and UX.",
      achievements: [
        "Leading UI/UX for Copilot to automate insurance workflows",
        "Built the Kay Admin App, Client App, and Demo Instance for seamless AI-driven automation.",
        "Experimenting with emerging AI models, techniques and UX paradigms to enhance usability and system design.",
      ],
      techStack: [
        "ReactJs",
        "Typescript",
        "TailwindCSS",
        "AWS",
        "ShadCN",
        "Python",
        "Playwright",
        "LLM",
      ],
    },
    {
      id: 2,
      title: "Full Stack Developer",
      company: "TechCorp",
      period: "Jan 2022 - Feb 2024",
      description:
        "Developed and maintained web applications using modern technologies.",
      achievements: [
        "Built responsive web applications serving 10,000+ users",
        "Implemented CI/CD pipelines reducing deployment time by 70%",
        "Collaborated with cross-functional teams to deliver high-quality products",
      ],
      techStack: ["ReactJs", "Typescript", "Python", "AWS"],
    },
    {
      id: 3,
      title: "Frontend Developer",
      company: "StartupXYZ",
      period: "Jun 2020 - Dec 2021",
      description:
        "Focused on creating intuitive user interfaces and exceptional user experiences.",
      achievements: [
        "Redesigned the main application interface, improving user engagement by 40%",
        "Implemented modern React patterns and state management solutions",
        "Mentored junior developers and established frontend best practices",
      ],
      techStack: ["ReactJs", "TailwindCSS", "Typescript"],
    },
  ];

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <Layout>
        <div className="relative pt-16 lg:pt-0 px-6 py-12 lg:py-24 max-w-4xl mx-auto bg-background text-foreground transition-colors duration-300">
          {/* Header Section */}
          <div className="mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Experiences
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              A timeline of my professional experiences.
            </p>
          </div>
          {!isMobile && (
          <div className="absolute top-0 -mt-20 right-0 opacity-60 z-0">
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
              <animate attributeName="stroke-dasharray" from="0,1000" to="1000,0" dur="3s" fill="freeze" />
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
              <animate attributeName="stroke-dasharray" from="0,1000" to="1000,0" dur="3s" fill="freeze" begin="0.5s" />
            </rect>
            <rect
              y="1.41421"
              width="122"
              height="358"
              rx="61"
              transform="matrix(-0.707107 0.707107 0.707107 0.707107 374.96 111.414)"
              stroke="purple"
            >
              <animate attributeName="stroke-dasharray" from="0,1000" to="1000,0" dur="3s" fill="freeze" begin="1s" />
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
              <animate attributeName="stroke-dasharray" from="0,1000" to="1000,0" dur="3s" fill="freeze" begin="1.5s" />
            </rect>
          </svg>
        </div>)}

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
                      {experience.title} at{" "}
                      <span className="text-blue-600 dark:text-blue-400">
                        {experience.company}
                      </span>
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">
                      {experience.period}
                    </p>
                  </div>

                  {/* Logo placeholder - you can replace this with actual company logos */}
                  <div className="ml-6 flex-shrink-0">
                    {experience.company === "kay.ai" ? (
                      <div className="w-16 h-16 bg-black dark:bg-white rounded-lg flex items-center justify-center">
                        <span className="text-white dark:text-black font-bold text-lg">
                          K
                        </span>
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {experience.company.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {experience.description}
                  </p>

                  {/* Achievements */}
                  <ul className="space-y-2">
                    {experience.achievements.map((achievement, index) => (
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
      </Layout>
    </div>
  );
};

export default Experience;
