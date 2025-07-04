import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import Layout from "../components/Layout";

const Experience = () => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });
  const [highlightedItem, setHighlightedItem] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const scrollToSection = (sectionId: string, itemId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setHighlightedItem(itemId);
      setTimeout(() => setHighlightedItem(null), 500);
    }
  };

  const frontEndSkills = [
    "TypeScript",
    "React",
    "Vue.js",
    "Tailwind CSS",
    "Framer Motion",
    "Next.js",
  ];

  const backEndSkills = [
    "Python",
    "FastAPI",
    "Django",
    "Flask",
    "Sanic",
    "Agent Swarm",
    "PostgreSQL",
    "MongoDB",
    "Redis",
    "Celery",
    "Docker",
  ];

  const devOpsSkills = [
    "Docker",
    "Kubernetes",
    "AWS (EC2, RDS, Lambda, S3)",
    "GitHub Actions",
  ];

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <Layout>
        <div className="pt-16 lg:pt-0 px-6 py-12 lg:py-24 max-w-6xl mx-auto bg-background text-foreground transition-colors duration-300">
          {/* Header with Theme Toggle */}
          <div className="flex justify-between items-start mb-8 mt-8">
            <div>
              <p className="text-blue-600 dark:text-blue-400 font-medium mb-2">
                Work
              </p>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Skills and Tools
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl">
                A look at all the programming languages, libraries, and tools
                I've worked with.
              </p>
            </div>

            <div
              className="absolute right-0 top-0  -top-8"
              // style={{
              //   position: "absolute",
              //   right: 0,
              //   top: "-6rem",
              //   bottom: 0,
              // }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 631 620"
                fill="none"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-16 h-16 sm:w-20 sm:h-20 lg:w-full lg:h-full opacity-60"
                // style={{
                //   height: "100%",
                //   width: "100%",
                //   opacity: 0.6,
                // }}
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
                  y="-1.19209e-07"
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
            {/* <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              )}
            </button> */}
          </div>

          <div className="flex gap-12">
            {/* Main Content */}
            <div className="flex-1 space-y-12">
              {/* Career Overview */}
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  I started my career as a web developer about{" "}
                  <strong>6 years ago</strong>. I've tried some programming
                  languages and tech stack, both Back-End, and Front-End.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Even though the scope of web development is broad, I was very
                  interested and focused on
                  <strong> Front-End Development</strong>,{" "}
                  <strong>Back-End Development</strong> and{" "}
                  <strong>DevOps Engineer</strong>.
                </p>
              </div>

              {/* Front-End Developer Section */}
              <section id="frontend" className="scroll-mt-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Front-End Developer
                </h2>
                <div className="space-y-6">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    I love creating something that is clean and minimalistic,
                    attractive and has value, and of course, easy to use.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    I really enjoy creating websites with{" "}
                    <strong>rich UI components</strong>, including:
                  </p>
                  <ul className="space-y-2 ml-6">
                    <li className="flex items-center text-gray-700 dark:text-gray-300">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                      Web application
                    </li>
                    <li className="flex items-center text-gray-700 dark:text-gray-300">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                      Documentation pages
                    </li>
                    <li className="flex items-center text-gray-700 dark:text-gray-300">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                      CMS contents layout
                    </li>
                    <li className="flex items-center text-gray-700 dark:text-gray-300">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                      Dashboard layout
                    </li>
                    <li className="flex items-center text-gray-700 dark:text-gray-300">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                      and others.
                    </li>
                  </ul>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    But I still like to make simple website pages like{" "}
                    <strong>landing pages</strong>. So, what tools did I feel
                    comfortable using during the website creation?
                  </p>
                </div>
              </section>

              {/* Backend Developer Section */}
              <section id="backend" className="scroll-mt-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Backend-End Developer
                </h2>
                <div className="space-y-6">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Building robust and scalable server-side applications is my
                    passion. I focus on creating efficient APIs, managing
                    databases, and implementing complex business logic.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    My experience spans across various backend technologies,
                    from Python frameworks to database management and cloud
                    services.
                  </p>
                </div>
              </section>

              {/* DevOps Engineer Section */}
              <section id="devops" className="scroll-mt-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  DevOps Engineer
                </h2>
                <div className="space-y-6">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    I enjoy bridging the gap between development and operations,
                    focusing on automation, deployment pipelines, and
                    infrastructure management.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    My DevOps experience includes containerization with Docker,
                    orchestration with Kubernetes, and cloud deployment on AWS.
                  </p>
                </div>
              </section>
            </div>

            {/* Table of Contents Sidebar */}
            <div className="w-80 hidden lg:block">
              <div className="sticky top-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Table of Contents
                </h3>

                <div className="space-y-4">
                  {/* Front-End Developer */}
                  <div>
                    <button
                      onClick={() =>
                        scrollToSection("frontend", "frontend-title")
                      }
                      className={`text-blue-600 dark:text-blue-400 font-medium block w-full text-left hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 ${
                        highlightedItem === "frontend-title"
                          ? "bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded"
                          : ""
                      }`}
                    >
                      Front-End Developer
                    </button>
                    <ul className="ml-4 mt-2 space-y-1">
                      {frontEndSkills.map((skill, index) => (
                        <li key={index}>
                          <button
                            onClick={() =>
                              scrollToSection("frontend", `frontend-${index}`)
                            }
                            className={`text-gray-600 dark:text-gray-400 text-sm hover:text-gray-800 dark:hover:text-gray-200 transition-all duration-200 ${
                              highlightedItem === `frontend-${index}`
                                ? "bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-800 dark:text-gray-200"
                                : ""
                            }`}
                          >
                            {skill}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Backend-End Developer */}
                  <div>
                    <button
                      onClick={() =>
                        scrollToSection("backend", "backend-title")
                      }
                      className={`text-blue-600 dark:text-blue-400 font-medium block w-full text-left hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 ${
                        highlightedItem === "backend-title"
                          ? "bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded"
                          : ""
                      }`}
                    >
                      Backend-End Developer
                    </button>
                    <ul className="ml-4 mt-2 space-y-1">
                      {backEndSkills.map((skill, index) => (
                        <li key={index}>
                          <button
                            onClick={() =>
                              scrollToSection("backend", `backend-${index}`)
                            }
                            className={`text-gray-600 dark:text-gray-400 text-sm hover:text-gray-800 dark:hover:text-gray-200 transition-all duration-200 ${
                              highlightedItem === `backend-${index}`
                                ? "bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-800 dark:text-gray-200"
                                : ""
                            }`}
                          >
                            {skill}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* DevOps Engineer */}
                  <div>
                    <button
                      onClick={() => scrollToSection("devops", "devops-title")}
                      className={`text-blue-600 dark:text-blue-400 font-medium block w-full text-left hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 ${
                        highlightedItem === "devops-title"
                          ? "bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded"
                          : ""
                      }`}
                    >
                      DevOps Engineer
                    </button>
                    <ul className="ml-4 mt-2 space-y-1">
                      {devOpsSkills.map((skill, index) => (
                        <li key={index}>
                          <button
                            onClick={() =>
                              scrollToSection("devops", `devops-${index}`)
                            }
                            className={`text-gray-600 dark:text-gray-400 text-sm hover:text-gray-800 dark:hover:text-gray-200 transition-all duration-200 ${
                              highlightedItem === `devops-${index}`
                                ? "bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-800 dark:text-gray-200"
                                : ""
                            }`}
                          >
                            {skill}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
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
