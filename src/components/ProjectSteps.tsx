
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, CheckCircle } from "lucide-react";

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
    <div className={`w-full max-w-3xl mx-auto ${className}`}>
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Development Process
        </h2>
        <p className="text-sm text-muted-foreground">
          Step-by-step journey of how this project was built
        </p>
      </div>
      
      <div className="space-y-2">
        {steps.map((step, index) => (
          <div
            key={index}
            className="group relative"
          >
            <button
              onClick={() => toggle(index)}
              className="w-full p-4 flex items-center gap-3 bg-card hover:bg-accent/50 border border-border rounded-lg transition-all duration-200 text-left"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                {activeIndex === index ? (
                  <CheckCircle className="w-4 h-4 text-primary" />
                ) : (
                  <span className="text-sm font-medium text-primary">{index + 1}</span>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                  {step.title}
                </h3>
              </div>
              
              <motion.div
                animate={{ rotate: activeIndex === index ? 90 : 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex-shrink-0"
              >
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
              </motion.div>
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
                  <div className="px-4 py-4 ml-11 mr-4 text-sm text-muted-foreground leading-relaxed">
                    <div className="border-l-2 border-primary/20 pl-4">
                      {step.description}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
