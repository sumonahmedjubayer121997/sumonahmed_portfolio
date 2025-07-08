
import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { getDynamicContent } from "@/integrations/firebase/firestore";

interface Tool {
  id: string;
  name: string;
  category: string;
  logo?: string;
  url?: string;
  order: number;
  visible: boolean;
}

const Tools = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    try {
      const { data, error } = await getDynamicContent("tools");
      
      if (error) {
        console.error("Error fetching tools:", error);
        return;
      }

      if (data && Array.isArray(data)) {
        // Filter visible tools and sort by order
        const visibleTools = data
          .filter(tool => tool.visible)
          .sort((a, b) => (a.order || 0) - (b.order || 0));
        setTools(visibleTools);
      }
    } catch (error) {
      console.error("Error fetching tools:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToolClick = (tool: Tool) => {
    if (tool.url) {
      window.open(tool.url, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="pt-16 lg:pt-0 px-6 py-12 lg:py-24 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-lg text-gray-600">Loading tools...</div>
          </div>
        </div>
      </Layout>
    );
  }

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
        {tools.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500">No tools available at the moment.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tools.map((tool) => (
              <div
                key={tool.id}
                className={`bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 hover:-translate-y-1 ${
                  tool.url ? 'cursor-pointer' : ''
                }`}
                onClick={() => handleToolClick(tool)}
              >
                <div className="flex items-center space-x-4">
                  {/* Tool Logo */}
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl overflow-hidden">
                    {tool.logo ? (
                      <img 
                        src={tool.logo} 
                        alt={tool.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span>{tool.name.charAt(0).toUpperCase()}</span>
                    )}
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
        )}
      </div>
    </Layout>
  );
};

export default Tools;
