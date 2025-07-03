
import Layout from "../components/Layout";

const Tools = () => {
  const toolCategories = [
    {
      category: "Development",
      tools: ["ReactJS", "TypeScript", "Python", "Node.js", "Ruby on Rails"]
    },
    {
      category: "AI/ML",
      tools: ["TensorFlow", "PyTorch", "OpenAI API", "Hugging Face", "LangChain"]
    },
    {
      category: "Databases",
      tools: ["PostgreSQL", "Redis", "MongoDB", "Supabase"]
    },
    {
      category: "Cloud & DevOps",
      tools: ["AWS", "Vercel", "Docker", "GitHub Actions"]
    },
    {
      category: "Design & UI",
      tools: ["Tailwind CSS", "ShadCN", "Figma", "Framer"]
    },
    {
      category: "Productivity",
      tools: ["VS Code", "Linear", "Notion", "Slack"]
    }
  ];

  return (
    <Layout>
      <div className="pt-16 lg:pt-0 px-6 py-12 lg:py-24 max-w-4xl mx-auto">
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-12">Tools</h1>
        
        <p className="text-lg text-gray-700 mb-12">
          Here are the tools and technologies I use to build products quickly and efficiently.
        </p>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {toolCategories.map((category, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{category.category}</h3>
              <div className="space-y-2">
                {category.tools.map((tool, toolIndex) => (
                  <div key={toolIndex} className="flex items-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                    <span className="text-gray-700">{tool}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Tools;
