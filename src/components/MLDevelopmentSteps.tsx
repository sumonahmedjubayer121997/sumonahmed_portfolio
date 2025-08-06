
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const mlSteps = [
  {
    step: 1,
    icon: "📥",
    title: "Data Collection",
    category: "Data Acquisition",
    description: "Gathered raw data from multiple sources including APIs, databases, and CSV files. Implemented data validation and quality checks to ensure data integrity.",
    tools: ["Python", "Pandas", "SQL", "API Integration"]
  },
  {
    step: 2,
    icon: "🧹",
    title: "Data Cleaning",
    category: "Preprocessing",
    description: "Handled missing values, removed duplicates, and standardized data formats. Applied outlier detection and treatment strategies to improve data quality.",
    tools: ["Pandas", "NumPy", "Scikit-learn", "Matplotlib"]
  },
  {
    step: 3,
    icon: "📊",
    title: "Exploratory Data Analysis",
    category: "Analysis",
    description: "Visualized feature distributions, correlations, and patterns. Created comprehensive statistical summaries and identified key insights driving model decisions.",
    tools: ["Matplotlib", "Seaborn", "Plotly", "Pandas Profiling"]
  },
  {
    step: 4,
    icon: "⚙️",
    title: "Feature Engineering",
    category: "Preprocessing",
    description: "Created new features through transformations, encoding categorical variables, and scaling numerical features. Applied dimensionality reduction techniques where appropriate.",
    tools: ["Scikit-learn", "Feature-engine", "Category Encoders"]
  },
  {
    step: 5,
    icon: "🤖",
    title: "Model Building",
    category: "Modeling",
    description: "Experimented with multiple algorithms including ensemble methods, neural networks, and traditional ML models. Implemented cross-validation and hyperparameter tuning.",
    tools: ["Scikit-learn", "XGBoost", "TensorFlow", "Optuna"]
  },
  {
    step: 6,
    icon: "📈",
    title: "Model Evaluation",
    category: "Validation",
    description: "Assessed model performance using appropriate metrics, conducted A/B testing, and validated results on holdout datasets. Generated comprehensive evaluation reports.",
    tools: ["Scikit-learn", "MLflow", "Weights & Biases", "Custom Metrics"]
  },
  {
    step: 7,
    icon: "🚀",
    title: "Model Deployment",
    category: "Production",
    description: "Deployed the final model to production with monitoring and logging. Set up automated retraining pipelines and performance tracking dashboards.",
    tools: ["FastAPI", "Docker", "AWS/GCP", "MLflow", "Prometheus"]
  }
];

interface MLDevelopmentStepsProps {
  steps?: typeof mlSteps;
  className?: string;
}

export default function MLDevelopmentSteps({ 
  steps = mlSteps, 
  className = "" 
}: MLDevelopmentStepsProps) {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const toggleStep = (stepNumber: number) => {
    setActiveStep(prev => prev === stepNumber ? null : stepNumber);
  };

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-foreground mb-3">
          ML Development Pipeline
        </h2>
        <p className="text-muted-foreground">
          Interactive timeline of the machine learning development process
        </p>
      </div>

      <div className="relative">
        {/* Vertical Timeline Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-primary/20"></div>

        <div className="space-y-6">
          {steps.map((step) => (
            <div key={step.step} className="relative flex items-start group">
              {/* Timeline Dot */}
              <div className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full border-4 border-background flex items-center justify-center text-2xl transition-all duration-300 ${
                activeStep === step.step 
                  ? 'bg-primary shadow-lg shadow-primary/25 scale-110' 
                  : 'bg-card shadow-md hover:shadow-lg hover:scale-105'
              }`}>
                <motion.span
                  animate={{ 
                    scale: activeStep === step.step ? 1.1 : 1,
                    rotate: activeStep === step.step ? 360 : 0 
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {step.icon}
                </motion.span>
              </div>

              {/* Step Content */}
              <div className="ml-6 flex-1">
                <button
                  onClick={() => toggleStep(step.step)}
                  className={`w-full text-left p-6 rounded-xl border transition-all duration-300 ${
                    activeStep === step.step
                      ? 'bg-primary/5 border-primary/20 shadow-lg'
                      : 'bg-card border-border hover:bg-accent/30 hover:border-accent-foreground/20 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          activeStep === step.step
                            ? 'bg-primary/20 text-primary'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          Step {step.step}
                        </span>
                        <span className="text-xs text-muted-foreground uppercase tracking-wide">
                          {step.category}
                        </span>
                      </div>
                      <h3 className={`text-xl font-semibold transition-colors ${
                        activeStep === step.step ? 'text-primary' : 'text-foreground'
                      }`}>
                        {step.title}
                      </h3>
                    </div>
                    
                    <motion.div
                      animate={{ rotate: activeStep === step.step ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="flex-shrink-0"
                    >
                      <ChevronDown className={`w-5 h-5 transition-colors ${
                        activeStep === step.step ? 'text-primary' : 'text-muted-foreground'
                      }`} />
                    </motion.div>
                  </div>
                </button>

                {/* Expanded Content */}
                <AnimatePresence initial={false}>
                  {activeStep === step.step && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ 
                        height: "auto", 
                        opacity: 1,
                        transition: {
                          height: { duration: 0.4, ease: "easeOut" },
                          opacity: { duration: 0.3, delay: 0.1 }
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
                      <div className="mt-4 p-6 bg-muted/30 rounded-lg border border-muted">
                        <p className="text-foreground leading-relaxed mb-4">
                          {step.description}
                        </p>
                        
                        <div>
                          <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                            🛠️ Tools & Technologies
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {step.tools.map((tool, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full"
                              >
                                {tool}
                              </span>
                            ))}
                          </div>
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
    </div>
  );
}
