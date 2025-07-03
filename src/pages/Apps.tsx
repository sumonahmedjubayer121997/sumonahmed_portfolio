
import Layout from "../components/Layout";

const Apps = () => {
  const apps = [
    {
      name: "Dreamboat.ai",
      description: "AI-powered platform for automated content generation and management.",
      status: "Live",
      tech: ["React", "Python", "AI/ML"]
    },
    {
      name: "Engagebud",
      description: "Social media engagement platform with analytics and automation.",
      status: "Live",
      tech: ["React", "Node.js", "PostgreSQL"]
    },
    {
      name: "Influencerbit",
      description: "Influencer marketing platform connecting brands with creators.",
      status: "Live",
      tech: ["React", "Ruby on Rails", "Redis"]
    }
  ];

  return (
    <Layout>
      <div className="pt-16 lg:pt-0 px-6 py-12 lg:py-24 max-w-4xl mx-auto">
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-12">Apps</h1>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {apps.map((app, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{app.name}</h3>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                  {app.status}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{app.description}</p>
              <div className="flex flex-wrap gap-2">
                {app.tech.map((tech, techIndex) => (
                  <span key={techIndex} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Apps;
