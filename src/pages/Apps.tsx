
import Layout from "../components/Layout";

const Apps = () => {
  const apps = [
    {
      name: "Blood Donation Guide",
      description: "Get information about blood donation",
      screenshot: "/lovable-uploads/de143137-449a-489e-8b23-ea3591eea8b7.png",
      alt: "Blood Donation Guide interface showing blood type compatibility"
    },
    {
      name: "Anonymizer", 
      description: "Anonymize your data",
      screenshot: "/lovable-uploads/de143137-449a-489e-8b23-ea3591eea8b7.png",
      alt: "Text Anonymizer interface showing data anonymization features"
    }
  ];

  return (
    <Layout>
      <div className="pt-16 lg:pt-0 px-6 py-12 lg:py-24 max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-4 tracking-tight">
            Apps
          </h1>
          <p className="text-xl text-gray-600 font-medium">
            Apps - Tools and Services that come in handy
          </p>
        </div>
        
        {/* App Cards Section */}
        <div className="grid gap-8 md:gap-12 md:grid-cols-2 max-w-5xl mx-auto">
          {apps.map((app, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100"
            >
              {/* App Screenshot */}
              <div className="aspect-video bg-gray-50 overflow-hidden">
                <img 
                  src={app.screenshot}
                  alt={app.alt}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              
              {/* App Details */}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
                  {app.name}
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {app.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Future Apps Placeholder */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-gray-50 rounded-full border border-gray-200">
            <span className="text-sm text-gray-500 font-medium">More apps coming soon</span>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Apps;
