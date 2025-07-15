import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TechStack from "./icon/TechStack";
import { listenDynamicContent } from "@/integrations/firebase/firestore"; // adjust your path
import { getFirestore, doc, onSnapshot } from "firebase/firestore";
import { Link } from "react-router-dom";


const roles = [
  "Software Engineer",
  "Full Stack Developer",
  "DevOps Enthusiast",
];

const ProfileSection = () => {
  const [index, setIndex] = useState(0);

  //getting data state; 
  const [homeData, setHomeData] = useState<any | null>(null);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  setIsLoading(true);

  const unsubscribe = listenDynamicContent(
    'home', 
    '7E1fmebGEixv8p2mjJfy',   // or null to listen entire collection
    (data) => {
      setHomeData(data?.content || null);
      setIsLoading(false);
    },
    (error) => {
      console.error("Realtime error:", error);
      setIsLoading(false);
    }
  );

  return () => unsubscribe();
}, []);


  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % roles.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 lg:py-24 space-y-12">
      {/* Main Heading */}
      <div>
        <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
          Hey, I'm {homeData?.name || 'Sumon'}
        </h1>
        <div className="relative h-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={roles[index]}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="absolute"
            >
              <h2 className="text-2xl lg:text-3xl text-gray-600 font-light">
                {roles[index]}
              </h2>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Twitter Follow Button */}
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center mt-8 px-6 py-3 bg-gray-500 text-white rounded-full hover:bg-gray-800 transition-colors duration-200 group"
        >
          <svg
            className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-200"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span className="font-medium">
            Connect with me on X for AI engineering insights & more
          </span>
        </a>
      </div>

      {/* Bio Section */}
      <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
        
        <p dangerouslySetInnerHTML={{ __html: homeData?.aboutMe }}></p>
       
        
      </div>

      {/* Tech Stack */}
      <div className="space-y-4">
        {/* <p className="text-lg text-gray-700">
          My Go-to stack is{" "}
          <span className="font-semibold text-gray-900">
            ReactJS, TypeScript, Python, Flask, NodeJS, Ruby on Rails,
            PostgreSQL, Redis, ShadCN,
          </span>{" "}
          and <span className="font-semibold text-gray-900">Tailwind CSS</span>.
        </p> */}
       
      </div>
      <div className="space-y-4">
        <TechStack/>
      </div>
    {/* Contact and Email */}

    <div className="flex items-center gap-3">
  <Link to="/contact">
    <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-gray-600 shadow h-9 px-4 py-2 text-white  bg-black hover:text-black hover:bg-white">
      <span className="text-sm pr-2">
        <svg
          stroke="currentColor"
          fill="none"
          strokeWidth="2"
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="m-0"
          height="12"
          width="12"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M21 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"></path>
          <path d="M12 7v5l3 3"></path>
        </svg>
      </span>
      Contact
    </button>
  </Link>
  <a href="mailto:sumonahmedjubayer@gmail.com">
    <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-gray-600 bg-neutral-500 shadow hover:bg-primary/90 h-9 px-4 py-2 text-white hover:text-oldsilver">
      <span className="text-sm pr-2">
        <svg
          stroke="currentColor"
          fill="none"
          strokeWidth="2"
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="m-0"
          height="12"
          width="12"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
      </span>
      <span style={{ transition: '0.3s' }}>E-Mail</span>
    </button>
  </a>
</div>

    </div>
  );
};

export default ProfileSection;
