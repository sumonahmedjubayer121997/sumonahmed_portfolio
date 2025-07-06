import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    <div className="max-w-4xl mx-auto px-6 py-12 lg:py-24 space-y-12">
      {/* Main Heading */}
      <div>
        <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
          Hey, I'm Sumon
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
        <p>
          I bring ideas to life through thoughtful engineering{" "}
          <span className="italic text-gray-900 font-medium">(quickly)</span> —
          combining modern frameworks, cloud technologies, and a shipping-first
          mindset, always backed by data and metrics.
        </p>
        {/* <p>
          Currently I am working as a Founding Engineer at{" "}
          <a
            href="https://kay.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-900 font-medium underline hover:text-gray-700 transition-colors duration-200"
          >
            kay.ai
          </a>{" "}
          building AI Agents for Insurances. I have built multiple products in
          past 5 years.{" "}
          <span className="text-gray-900 font-medium">
            Raised $100K funding
          </span>{" "}
          for my startup{" "}
          <a
            href="https://dreamboat.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-900 font-medium underline hover:text-gray-700 transition-colors duration-200"
          >
            Dreamboat.ai
          </a>
          , built{" "}
          <a
            href="https://engagebud.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-900 font-medium underline hover:text-gray-700 transition-colors duration-200"
          >
            Engagebud
          </a>
          ,{" "}
          <a
            href="https://influencerbit.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-900 font-medium underline hover:text-gray-700 transition-colors duration-200"
          >
            Influencerbit
          </a>
          .
        </p> */}
         <p className="text-lg text-gray-700">
          You can talk to me about{" "}
          <span className="font-semibold text-gray-900">
            AI, new ideas, life, or anything else
          </span>
          .
        </p>
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
    </div>
  );
};

export default ProfileSection;
