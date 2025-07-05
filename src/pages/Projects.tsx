import Layout from "../components/Layout";

const Projects = () => {
  return (
    <Layout>
      <div className="pt-16 lg:pt-0 px-6 py-12 lg:py-24 max-w-4xl mx-auto">
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-12">
          Projects
        </h1>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              AI Insurance Agents
            </h3>
            <p className="text-gray-600 mb-4">
              Building intelligent agents for insurance companies to automate
              claims processing and customer service.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                Python
              </span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                AI/ML
              </span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                React
              </span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Content Generation Platform
            </h3>
            <p className="text-gray-600 mb-4">
              Full-stack platform for automated content creation using advanced
              AI models.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                TypeScript
              </span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                Node.js
              </span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                PostgreSQL
              </span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Projects;
