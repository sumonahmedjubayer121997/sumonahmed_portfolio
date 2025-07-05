
import Layout from "../components/Layout";
import { Card, CardContent } from "@/components/ui/card";

const Apps = () => {
  const apps = [
    {
      name: "Blood Donation Guide",
      description: "Get information about blood donation",
      image: "/placeholder.svg",
      alt: "Blood donation guide app interface showing blood type compatibility"
    },
    {
      name: "Anonymizer",
      description: "Anonymize your data",
      image: "/placeholder.svg", 
      alt: "Text anonymizer app interface with highlighted entities"
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        {/* Header Section */}
        <div className="pt-8 pb-16 px-6 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              Apps
            </h1>
            <p className="text-xl text-gray-600 font-medium">
              Apps - Tools and Services that come in handy
            </p>
          </div>

          {/* App Cards Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {apps.map((app, index) => (
              <Card key={index} className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl overflow-hidden">
                <CardContent className="p-0">
                  {/* App Screenshot/Illustration */}
                  <div className="aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-full bg-gray-200 rounded-lg m-6 flex items-center justify-center">
                        <div className="w-16 h-16 bg-gray-300 rounded-lg flex items-center justify-center">
                          <svg 
                            className="w-8 h-8 text-gray-400" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* App Information */}
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {app.name}
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      {app.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Apps;
