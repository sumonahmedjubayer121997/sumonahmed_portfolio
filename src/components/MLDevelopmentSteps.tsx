
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, CheckCircle2 } from "lucide-react";

const mlSteps = [
  {
    id: 1,
    title: "Data Collection & Understanding",
    icon: "📊",
    description: "Gather and explore the dataset to understand its structure, quality, and potential insights.",
    details: "Analyze data types, missing values, distributions, and correlations. Document data sources and collection methods.",
    status: "completed" as const
  },
  {
    id: 2,
    title: "Data Preprocessing & Cleaning",
    icon: "🧹",
    description: "Clean and prepare the data for machine learning algorithms.",
    details: "Handle missing values, remove duplicates, normalize data, and engineer relevant features for better model performance.",
    status: "completed" as const
  },
  {
    id: 3,
    title: "Model Development & Training",
    icon: "🤖",
    description: "Select appropriate algorithms and train machine learning models.",
    details: "Compare multiple algorithms, tune hyperparameters, and implement cross-validation to ensure robust model performance.",
    status: "completed" as const
  },
  {
    id: 4,
    title: "Model Evaluation & Validation",
    icon: "📈",
    description: "Assess model performance using various metrics and validation techniques.",
    details: "Evaluate precision, recall, accuracy, and other relevant metrics. Test on unseen data to validate generalization.",
    status: "completed" as const
  },
  {
    id: 5,
    title: "Deployment & Monitoring",
    icon: "🚀",
    description: "Deploy the model to production and set up monitoring systems.",
    details: "Implement the model in a production environment with proper monitoring, logging, and performance tracking.",
    status: "in-progress" as const
  }
];

export default function MLDevelopmentSteps() {
  const [openStep, setOpenStep] = useState<number | null>(null);

  const toggleStep = (stepId: number) => {
    setOpenStep(openStep === stepId ? null : stepId);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "in-progress":
        return <div className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />;
      default:
        return <div className="w-4 h-4 rounded-full border-2 border-gray-300" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          ML Development Process
        </h2>
        <p className="text-muted-foreground">
          Step-by-step machine learning development workflow
        </p>
      </div>

      <div className="space-y-3">
        {mlSteps.map((step, index) => (
          <div key={step.id} className="relative">
            {/* Connecting line */}
            {index < mlSteps.length - 1 && (
              <div className="absolute left-6 top-12 w-px h-8 bg-border" />
            )}
            
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleStep(step.id)}
                className="w-full p-4 text-left hover:bg-accent/50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
                aria-expanded={openStep === step.id}
              >
                <div className="flex items-center gap-4">
                  {/* Step icon and status */}
                  <div className="flex items-center gap-2">
                    <span className="text-xl" role="img" aria-label={step.title}>
                      {step.icon}
                    </span>
                    {getStatusIcon(step.status)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground mb-1">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {step.description}
                    </p>
                  </div>

                  {/* Expand icon */}
                  <motion.div
                    animate={{ rotate: openStep === step.id ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </motion.div>
                </div>
              </button>

              {/* Expanded content */}
              <AnimatePresence>
                {openStep === step.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-0">
                      <div className="ml-8 pl-4 border-l-2 border-primary/20">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {step.details}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
