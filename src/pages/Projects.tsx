import Layout from "../components/Layout";

const Projects = () => {
  return (
    <Layout>
            <div className="relative pt-16 lg:pt-0 px-6 py-12 lg:py-24 max-w-4xl mx-auto bg-background text-foreground transition-colors duration-300">

        {/* SVG background */}
        <div className="absolute top-0 -mt-20 right-0 opacity-60 z-0">
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


        <div className="grid gap-8 md:grid-cols-2">
          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="min-w-full grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-6">
      <a href="/projects/katha-the-hindu-tales">
        <div
          className="w-full h-full"
          tabIndex={0}
          style={{ willChange: 'auto', transform: 'none' }}
        >
          <div className="rounded-xl border shadow bg-neutral-200 dark:bg-slate border-none text-gray-800 dark:text-white hover:border-zinc-800 w-full h-full">
            <div className="space-y-1.5 p-2 flex flex-col h-full justify-between gap-1">
              <div className="space-y-1.5">
                <img
                  alt="Katha - The Hindu Tales"
                  loading="lazy"
                  width="500"
                  height="500"
                  decoding="async"
                  data-nimg="1"
                  className="max-h-36 w-full sm:max-h-36 md:max-h-48 object-cover rounded-md"
                  srcSet="/_next/image?url=%2Fcontent%2Fprojects%2Fkatha%2Fimage.png&amp;w=640&amp;q=75 1x, /_next/image?url=%2Fcontent%2Fprojects%2Fkatha%2Fimage.png&amp;w=1080&amp;q=75 2x"
                  src="/_next/image?url=%2Fcontent%2Fprojects%2Fkatha%2Fimage.png&amp;w=1080&amp;q=75"
                  style={{ color: 'transparent' }}
                />
                <h2 className="text-primary dark:text-white font-semibold leading-none line-clamp-1">
                  Katha - The Hindu Tales
                </h2>
                <h4 className="text-xs line-clamp-2"></h4>
              </div>
              <div className="space-y-3">
                <div className="flex flex-row items-center justify-between gap-2">
                  <div className="space-x-2">
                    <button className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-gray-600 bg-primary shadow hover:bg-primary/90 rounded-md px-3 text-xs text-white dark:text-white hover:text-white dark:hover:text-zinc-400 h-6">
                      Youtube
                    </button>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full text-black bg-green-200">
                    active
                  </span>
                </div>
                <div>
                  <div className="flex gap-1 overflow-hidden">
                    <span className="bg-zinc-100 text-primary dark:bg-zinc-800 dark:text-white text-xs px-2 py-0.5 rounded-full line-clamp-1">
                      Youtube
                    </span>
                    <span className="bg-zinc-100 text-primary dark:bg-zinc-800 dark:text-white text-xs px-2 py-0.5 rounded-full line-clamp-1">
                      Videos
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </a>
    </div>
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
