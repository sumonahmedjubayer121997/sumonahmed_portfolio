
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";

const dummySteps = [
  {
    title: "Project Planning & Architecture",
    description: "Analyzed requirements, designed system architecture, and created wireframes. Selected appropriate tech stack including React, TypeScript, and Firebase for optimal performance and scalability."
  },
  {
    title: "Frontend Development & UI/UX",
    description: "Built responsive user interface with React components, implemented routing with React Router, and created a cohesive design system using Tailwind CSS and shadcn/ui components."
  },
  {
    title: "Backend Integration & Database",
    description: "Integrated Firebase services including Firestore for data storage, Authentication for user management, and Storage for file handling. Implemented real-time data synchronization."
  },
  {
    title: "Testing & Deployment",
    description: "Conducted comprehensive testing across different devices and browsers. Set up CI/CD pipeline and deployed the application with proper environment configuration and performance optimization."
  }
];

interface ProjectStepsProps {
  steps?: Array<{ title: string; description: string }>;
  className?: string;
}

export default function ProjectSteps({ steps = dummySteps, className = "" }: ProjectStepsProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          🛠️ Development Process
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Explore the step-by-step process of how this project was built
        </p>
      </div>
      
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div
            key={index}
            className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm"
          >
            <button
              onClick={() => toggle(index)}
              className="w-full text-left px-4 py-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center justify-between group"
            >
              <span className="font-medium text-gray-900 dark:text-white">
                <span className="inline-block w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold mr-3 text-center leading-6">
                  {index + 1}
                </span>
                {step.title}
              </span>
              <ChevronDown 
                className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                  activeIndex === index ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence initial={false}>
              {activeIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ 
                    height: "auto", 
                    opacity: 1,
                    transition: {
                      height: { duration: 0.3, ease: "easeOut" },
                      opacity: { duration: 0.2, delay: 0.1 }
                    }
                  }}
                  exit={{ 
                    height: 0, 
                    opacity: 0,
                    transition: {
                      height: { duration: 0.3, ease: "easeIn" },
                      opacity: { duration: 0.2 }
                    }
                  }}
                  className="overflow-hidden"
                >
                  <div className="px-4 py-4 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                    <p className="leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </Card>
  );
}
