
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PythonIcon from "./icon/PythonIcon";
import FlaskIcon from "./icon/FlaskIcon";
import DjangoIcon from "./icon/DjangoIcon";
import JavaScriptIcon from "./icon/JavascriptIcon";
import TechStack from "./icon/TechStack";

const roles = [
  "Software Engineer",
  "Full Stack Developer",
  "DevOps Enthusiast",
];

const ProfileSection = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % roles.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-24 space-y-8 sm:space-y-12">
      {/* Main Heading */}
      <div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
          Hey, I'm Sumon
        </h1>
        <div className="relative h-8 sm:h-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={roles[index]}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="absolute"
            >
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-600 font-light">
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
          className="inline-flex items-center mt-6 sm:mt-8 px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors duration-200 group text-sm sm:text-base"
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 group-hover:scale-110 transition-transform duration-200"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span className="font-medium">
            <span className="hidden sm:inline">Connect with me on X for AI engineering insights & more</span>
            <span className="sm:hidden">Connect on X</span>
          </span>
        </a>
      </div>

      {/* Bio Section */}
      <div className="space-y-4 sm:space-y-6 text-base sm:text-lg text-gray-700 leading-relaxed">
        <p>
          I bring ideas to life through thoughtful engineering{" "}
          <span className="italic text-gray-900 font-medium">(quickly)</span> —
          combining modern frameworks, cloud technologies, and a shipping-first
          mindset, always backed by data and metrics.
        </p>
        <p className="text-base sm:text-lg text-gray-700">
          You can talk to me about{" "}
          <span className="font-semibold text-gray-900">
            AI, new ideas, life, or anything else
          </span>
          .
        </p>
      </div>

      {/* Tech Stack */}
      <div className="space-y-4">
        <TechStack/>
      </div>
    </div>
  );
};

export default ProfileSection;
