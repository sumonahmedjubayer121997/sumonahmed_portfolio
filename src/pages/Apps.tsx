
import Layout from "../components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const Apps = () => {
  const apps = [
    {
      name: "Blood Donation Guide",
      description: "Get information about blood donation",
      image: "/lovable-uploads/db9b8af0-d481-4774-82d1-b8e2e96e6de0.png",
      altText: "Blood Donation Guide App Interface"
    },
    {
      name: "Anonymizer", 
      description: "Anonymize your data",
      image: "/lovable-uploads/db9b8af0-d481-4774-82d1-b8e2e96e6de0.png",
      altText: "Text Anonymizer App Interface"
    }
  ];

  return (
    <Layout>
      <div className="pt-16 lg:pt-0 px-6 py-12 lg:py-16 max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-12 text-center lg:text-left">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Apps
          </h1>
          <p className="text-xl text-gray-600 font-light">
            Apps - Tools and Services that come in handy
          </p>
        </div>
        
        {/* App Cards Section */}
        <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
          {apps.map((app, index) => (
            <Card key={index} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 rounded-2xl overflow-hidden">
              {/* App Screenshot */}
              <div className="aspect-[4/3] bg-gray-50 overflow-hidden">
                <img 
                  src={app.image}
                  alt={app.altText}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              
              {/* App Info */}
              <CardHeader className="p-6 pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  {app.name}
                </CardTitle>
                <CardDescription className="text-gray-600 text-base leading-relaxed">
                  {app.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Apps;
