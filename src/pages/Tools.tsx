
import Layout from "../components/Layout";

const Tools = () => {
  const tools = [
    {
      name: "Windsurf",
      category: "IDE",
      icon: "💨", // You can replace with actual icons later
    },
    {
      name: "ChatGPT",
      category: "Productivity",
      icon: "🤖",
    },
    {
      name: "Claude",
      category: "Productivity", 
      icon: "🧠",
    },
    {
      name: "Notion",
      category: "Productivity",
      icon: "📝",
    },
    {
      name: "WebStorm",
      category: "IDE",
      icon: "🌐",
    },
    {
      name: "PyCharm",
      category: "IDE",
      icon: "🐍",
    },
    {
      name: "Readwise Reader",
      category: "Reading",
      icon: "📚",
    },
    {
      name: "Slack",
      category: "Communication",
      icon: "💬",
    },
    {
      name: "Medium",
      category: "Writing",
      icon: "✍️",
    },
    {
      name: "VS Code",
      category: "IDE",
      icon: "💻",
    },
    {
      name: "Linear",
      category: "Productivity",
      icon: "📊",
    },
    {
      name: "Figma",
      category: "Design",
      icon: "🎨",
    },
  ];

  return (
    <Layout>
      <div className="pt-16 lg:pt-0 px-6 py-12 lg:py-24 max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Shovels
          </h1>
          <p className="text-lg text-gray-600">
            Tools I frequently use to make life easier
          </p>
        </div>
        
        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map((tool, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 hover:-translate-y-1 cursor-pointer"
            >
              <div className="flex items-center space-x-4">
                {/* Tool Icon */}
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
                  {tool.icon}
                </div>
                
                {/* Tool Info */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {tool.category}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Tools;
