import TechIcon from "@/components/TechIcon";
import Layout from "../components/Layout";

const Apps = () => {
  const apps = [
    {
      name: "Blood Donation Guide",
      description: "Get information about blood donation",
      image: "/placeholder.svg",
      alt: "Blood donation guide app interface showing blood type compatibility",
      id: 1,
      type: "MobileApp",
      techUsed: ["Python", "Flask"]
    },
    {
      name: "Anonymizer",
      description: "Anonymize your data",
      image: "/placeholder.svg",
      alt: "Text anonymizer app interface with highlighted entities",
      id: 2,
      type: "WebApp",
      techUsed: ["React", "Javascript"]
    }
  ];

  return (
    <Layout>
      <div className="relative pt-16 lg:pt-0 px-6 py-12 lg:py-24 max-w-4xl mx-auto text-foreground transition-colors duration-300">

        {/* SVG background */}
        <div className="absolute top-0 -mt-20 right-0 opacity-40 z-0 hidden sm:block">
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
        </div>

        {/* Header Section */}
        <div className="mb-12 relative z-10">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Apps
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            A timeline of my apps projets.
          </p>
        </div>

        {/* App Cards Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto relative z-10">
          {apps.map((app) => (
            <a key={app.id} className="w-full" href={`/apps/${app.name}`}>
              <div className="flex flex-col w-full h-full p-4 bg-white rounded-lg shadow-sm hover:shadow-md">
                <img
                  src="https://firstnorth.org/wp-content/uploads/2020/10/Gen-Blood-Drive-web-1.jpg"
                  alt={app.description}
                  className="max-h-52 md:w-full mb-4 items-center justify-center"
                />
                <div className="flex items-center justify-between">
                  <h2 className="text-md font-bold">{app.name}</h2>
                  <div className="flex mt-1 space-x-2">
                    {app.techUsed.map((tech, index) => (
                      <div key={index} title={tech}>
                        <TechIcon techName={tech} />
                      </div>
                    ))}
                  </div>
                </div>
                <p className="mt-2 text-gray-600 text-sm">{app.description}</p>
              </div>
            </a>
          ))}
        </div>

      </div>
    </Layout>
  );
};

export default Apps;
