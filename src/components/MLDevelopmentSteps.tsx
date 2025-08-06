
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Clock, Zap, CheckCircle, Circle, AlertCircle } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

const mlSteps = [
  {
    step: 1,
    icon: "📥",
    title: "Data Collection",
    category: "Data Acquisition",
    priority: "high",
    duration: "2-3 days",
    status: "completed" as const,
    description: "Gathered raw data from multiple sources including APIs, databases, and CSV files. Implemented data validation and quality checks to ensure data integrity.",
    tools: [
      { name: "Python", usage: "Primary programming language for data collection scripts", type: "language" },
      { name: "Pandas", usage: "Data manipulation and CSV handling", type: "library" },
      { name: "SQL", usage: "Database queries and data extraction", type: "query" },
      { name: "API Integration", usage: "REST API data fetching and pagination", type: "integration" }
    ],
    codeExample: `import pandas as pd
import requests

# Fetch data from API
response = requests.get('https://api.example.com/data')
raw_data = response.json()

# Load and combine datasets
df = pd.read_csv('dataset.csv')
df_combined = pd.concat([df, pd.DataFrame(raw_data)])`,
    media: {
      type: "tip",
      content: "💡 Pro tip: Always validate data quality at this stage to catch issues early"
    }
  },
  {
    step: 2,
    icon: "🧹",
    title: "Data Cleaning",
    category: "Preprocessing",
    priority: "high",
    duration: "3-4 days",
    status: "completed" as const,
    description: "Handled missing values, removed duplicates, and standardized data formats. Applied outlier detection and treatment strategies to improve data quality.",
    tools: [
      { name: "Pandas", usage: "Data cleaning and preprocessing operations", type: "library" },
      { name: "NumPy", usage: "Numerical operations and array manipulations", type: "library" },
      { name: "Scikit-learn", usage: "Outlier detection and data preprocessing", type: "ml" },
      { name: "Matplotlib", usage: "Visualization of data quality issues", type: "visualization" }
    ],
    codeExample: `# Handle missing values
df.fillna(method='forward', inplace=True)

# Remove duplicates
df.drop_duplicates(inplace=True)

# Detect and handle outliers
from scipy import stats
z_scores = np.abs(stats.zscore(df.select_dtypes(include=[np.number])))
df_clean = df[(z_scores < 3).all(axis=1)]`,
    media: {
      type: "stat",
      content: "🔍 Removed 15% of records as duplicates, improving data quality significantly"
    }
  },
  {
    step: 3,
    icon: "📊",
    title: "Exploratory Data Analysis",
    category: "Analysis",
    priority: "medium",
    duration: "2-3 days",
    status: "in-progress" as const,
    description: "Visualized feature distributions, correlations, and patterns. Created comprehensive statistical summaries and identified key insights driving model decisions.",
    tools: [
      { name: "Matplotlib", usage: "Statistical plots and data visualization", type: "visualization" },
      { name: "Seaborn", usage: "Advanced statistical visualizations", type: "visualization" },
      { name: "Plotly", usage: "Interactive charts and dashboards", type: "visualization" },
      { name: "Pandas Profiling", usage: "Automated EDA reports", type: "library" }
    ],
    codeExample: `import seaborn as sns
import matplotlib.pyplot as plt

# Correlation heatmap
plt.figure(figsize=(12, 8))
sns.heatmap(df.corr(), annot=True, cmap='coolwarm')

# Feature distributions
df.hist(bins=30, figsize=(15, 10))
plt.tight_layout()`,
    media: {
      type: "insight",
      content: "📈 Discovered strong correlation (0.85) between features X and Y"
    }
  },
  {
    step: 4,
    icon: "⚙️",
    title: "Feature Engineering",
    category: "Preprocessing",
    priority: "high",
    duration: "3-5 days",
    status: "optional" as const,
    description: "Created new features through transformations, encoding categorical variables, and scaling numerical features. Applied dimensionality reduction techniques where appropriate.",
    tools: [
      { name: "Scikit-learn", usage: "Feature scaling and encoding transformations", type: "ml" },
      { name: "Feature-engine", usage: "Advanced feature engineering pipelines", type: "library" },
      { name: "Category Encoders", usage: "Categorical variable encoding strategies", type: "library" }
    ],
    codeExample: `from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.feature_selection import SelectKBest, f_classif

# Feature scaling
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_numeric)

# Feature selection
selector = SelectKBest(f_classif, k=10)
X_selected = selector.fit_transform(X_scaled, y)`,
    media: {
      type: "achievement",
      content: "🎯 Created 12 new features that improved model performance by 8%"
    }
  },
  {
    step: 5,
    icon: "🤖",
    title: "Model Building",
    category: "Modeling",
    priority: "high",
    duration: "4-6 days",
    status: "completed" as const,
    description: "Experimented with multiple algorithms including ensemble methods, neural networks, and traditional ML models. Implemented cross-validation and hyperparameter tuning.",
    tools: [
      { name: "Scikit-learn", usage: "Traditional ML algorithms and model selection", type: "ml" },
      { name: "XGBoost", usage: "Gradient boosting for high performance", type: "ml" },
      { name: "TensorFlow", usage: "Deep learning model development", type: "framework" },
      { name: "Optuna", usage: "Hyperparameter optimization", type: "optimization" }
    ],
    codeExample: `from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import GridSearchCV

# Model training with hyperparameter tuning
rf = RandomForestClassifier()
params = {'n_estimators': [100, 200], 'max_depth': [10, 20]}
grid_search = GridSearchCV(rf, params, cv=5)
grid_search.fit(X_train, y_train)`,
    media: {
      type: "performance",
      content: "🏆 Best model: XGBoost with 94.2% accuracy"
    }
  },
  {
    step: 6,
    icon: "📈",
    title: "Model Evaluation",
    category: "Validation",
    priority: "high",
    duration: "2-3 days",
    status: "completed" as const,
    description: "Assessed model performance using appropriate metrics, conducted A/B testing, and validated results on holdout datasets. Generated comprehensive evaluation reports.",
    tools: [
      { name: "Scikit-learn", usage: "Model evaluation metrics and validation", type: "ml" },
      { name: "MLflow", usage: "Experiment tracking and model versioning", type: "mlops" },
      { name: "Weights & Biases", usage: "Advanced experiment monitoring", type: "mlops" },
      { name: "Custom Metrics", usage: "Domain-specific evaluation criteria", type: "custom" }
    ],
    codeExample: `from sklearn.metrics import classification_report, confusion_matrix

# Model evaluation
y_pred = model.predict(X_test)
print(classification_report(y_test, y_pred))

# Cross-validation scores
scores = cross_val_score(model, X, y, cv=5)
print(f"CV Score: {scores.mean():.3f} (+/- {scores.std() * 2:.3f})")`,
    media: {
      type: "metric",
      content: "📊 F1-Score: 0.92 | Precision: 0.94 | Recall: 0.90"
    }
  },
  {
    step: 7,
    icon: "🚀",
    title: "Model Deployment",
    category: "Production",
    priority: "medium",
    duration: "3-4 days",
    status: "in-progress" as const,
    description: "Deployed the final model to production with monitoring and logging. Set up automated retraining pipelines and performance tracking dashboards.",
    tools: [
      { name: "FastAPI", usage: "REST API development for model serving", type: "framework" },
      { name: "Docker", usage: "Containerization and deployment", type: "devops" },
      { name: "AWS/GCP", usage: "Cloud infrastructure and scaling", type: "cloud" },
      { name: "MLflow", usage: "Model registry and deployment tracking", type: "mlops" },
      { name: "Prometheus", usage: "Performance monitoring and alerting", type: "monitoring" }
    ],
    codeExample: `from fastapi import FastAPI
import joblib

app = FastAPI()
model = joblib.load('model.pkl')

@app.post("/predict")
async def predict(data: dict):
    prediction = model.predict([list(data.values())])
    return {"prediction": prediction[0]}`,
    media: {
      type: "deployment",
      content: "🌐 Live API serving 1000+ predictions/day with 99.9% uptime"
    }
  }
];

type StepStatus = "completed" | "in-progress" | "optional";

interface MLDevelopmentStepsProps {
  steps?: typeof mlSteps;
  className?: string;
}

export default function MLDevelopmentSteps({ 
  steps = mlSteps, 
  className = "" 
}: MLDevelopmentStepsProps) {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [visibleSteps, setVisibleSteps] = useState<Set<number>>(new Set());
  const [showCode, setShowCode] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const toggleStep = (stepNumber: number) => {
    setActiveStep(prev => prev === stepNumber ? null : stepNumber);
    setShowCode(null);
  };

  const scrollToStep = (stepNumber: number) => {
    const element = document.getElementById(`step-${stepNumber}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (activeStep !== stepNumber) {
        setActiveStep(stepNumber);
      }
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400";
      case "medium": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400";
      default: return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400";
    }
  };

  const getStatusIcon = (status: StepStatus) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "in-progress": return <Circle className="w-4 h-4 text-blue-500 animate-pulse" />;
      case "optional": return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: StepStatus) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "in-progress": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "optional": return "bg-gray-100 text-gray-600 dark:bg-gray-800/20 dark:text-gray-400";
    }
  };

  const getToolTypeColor = (type: string) => {
    const colors = {
      language: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
      library: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
      ml: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
      visualization: "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400",
      framework: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
      mlops: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400",
      default: "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400"
    };
    return colors[type as keyof typeof colors] || colors.default;
  };

  const filteredSteps = steps.filter(step => 
    filter === "all" || step.category.toLowerCase().includes(filter.toLowerCase())
  );

  const categories = ["all", "preprocessing", "analysis", "modeling", "validation", "production"];

  // Step wrapper with intersection observer
  const StepWrapper = ({ children, stepNumber }: { children: React.ReactNode, stepNumber: number }) => {
    const { ref, inView } = useInView({
      threshold: 0.3,
      triggerOnce: false,
    });

    useEffect(() => {
      if (inView) {
        setVisibleSteps(prev => new Set([...prev, stepNumber]));
      } else {
        setVisibleSteps(prev => {
          const newSet = new Set(prev);
          newSet.delete(stepNumber);
          return newSet;
        });
      }
    }, [inView, stepNumber]);

    return <div ref={ref}>{children}</div>;
  };

  return (
    <TooltipProvider>
      <div className={`w-full max-w-5xl mx-auto ${className}`}>
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-3">
            ML Development Pipeline
          </h2>
          <p className="text-muted-foreground mb-6">
            Interactive timeline of the machine learning development process
          </p>
          
          {/* Icon Legend */}
          <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground mb-4">
            <span>📥 Data Collection</span>
            <span>🧹 Data Cleaning</span>
            <span>📊 Analysis</span>
            <span>⚙️ Feature Engineering</span>
            <span>🤖 Model Training</span>
            <span>📈 Evaluation</span>
            <span>🚀 Deployment</span>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  filter === category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-accent'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Icons */}
        <div className="flex justify-center mb-8 bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-border/50">
          <div className="flex items-center space-x-1 overflow-x-auto">
            {filteredSteps.map((step) => (
              <Tooltip key={step.step}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => scrollToStep(step.step)}
                    className={`relative flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center text-xl transition-all duration-300 ${
                      visibleSteps.has(step.step)
                        ? 'border-primary bg-primary shadow-lg shadow-primary/25 scale-110'
                        : activeStep === step.step
                        ? 'border-primary/60 bg-primary/10 scale-105'
                        : 'border-border bg-background hover:border-primary/30 hover:bg-accent/30'
                    }`}
                    aria-label={`Go to ${step.title}`}
                  >
                    <motion.span
                      animate={{ 
                        scale: visibleSteps.has(step.step) ? 1.1 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {step.icon}
                    </motion.span>
                    
                    {/* Status indicator */}
                    <div className="absolute -top-1 -right-1">
                      {getStatusIcon(step.status)}
                    </div>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-center">
                    <div className="font-medium">{step.title}</div>
                    <div className="text-xs text-muted-foreground">{step.category}</div>
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>

        <div className="relative">
          {/* Enhanced Timeline Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-border via-border to-border/20">
            {/* Progress indicator */}
            <motion.div
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-primary to-primary/60"
              initial={{ height: 0 }}
              animate={{ 
                height: visibleSteps.size > 0 ? `${(Math.max(...visibleSteps) / filteredSteps.length) * 100}%` : 0 
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>

          <div className="space-y-6">
            {filteredSteps.map((step) => (
              <StepWrapper key={step.step} stepNumber={step.step}>
                <div id={`step-${step.step}`} className="relative flex items-start group">
                  {/* Enhanced Timeline Dot */}
                  <div className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full border-4 border-background flex items-center justify-center text-2xl transition-all duration-300 ${
                    visibleSteps.has(step.step)
                      ? 'bg-primary shadow-lg shadow-primary/25 scale-110' 
                      : activeStep === step.step
                      ? 'bg-primary/80 shadow-lg shadow-primary/20 scale-105'
                      : 'bg-card shadow-md hover:shadow-lg hover:scale-105'
                  }`}>
                    <motion.span
                      animate={{ 
                        scale: visibleSteps.has(step.step) ? 1.1 : 1,
                        rotate: visibleSteps.has(step.step) ? 360 : 0 
                      }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      {step.icon}
                    </motion.span>
                  </div>

                  {/* Enhanced Step Content */}
                  <div className="ml-6 flex-1">
                    <button
                      onClick={() => toggleStep(step.step)}
                      className={`w-full text-left p-6 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                        activeStep === step.step
                          ? 'bg-primary/5 border-primary/20 shadow-lg'
                          : 'bg-card border-border hover:bg-accent/30 hover:border-accent-foreground/20 shadow-sm hover:shadow-md'
                      }`}
                      aria-expanded={activeStep === step.step}
                      aria-controls={`step-content-${step.step}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3 flex-wrap">
                            <Badge variant="outline" className="text-xs">
                              Step {step.step}
                            </Badge>
                            <Badge variant="secondary" className="text-xs uppercase tracking-wide">
                              {step.category}
                            </Badge>
                            <Badge className={`text-xs ${getPriorityColor(step.priority)}`}>
                              <Zap className="w-3 h-3 inline mr-1" />
                              {step.priority}
                            </Badge>
                            <Badge variant="outline" className="text-xs flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {step.duration}
                            </Badge>
                            <Badge className={`text-xs flex items-center ${getStatusColor(step.status)}`}>
                              {getStatusIcon(step.status)}
                              <span className="ml-1 capitalize">{step.status.replace('-', ' ')}</span>
                            </Badge>
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

                    {/* Enhanced Expanded Content */}
                    <AnimatePresence initial={false}>
                      {activeStep === step.step && (
                        <motion.div
                          id={`step-content-${step.step}`}
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
                          <div className="mt-4 p-6 bg-muted/30 rounded-lg border border-muted space-y-6">
                            <p className="text-foreground leading-relaxed">
                              {step.description}
                            </p>
                            
                            {/* Media/Insight Box */}
                            {step.media && (
                              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                                <p className="text-sm font-medium text-primary">
                                  {step.media.content}
                                </p>
                              </div>
                            )}
                            
                            {/* Enhanced Tools Section */}
                            <div>
                              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                                🛠️ Tools & Technologies
                              </h4>
                              <div className="grid gap-3 md:grid-cols-2">
                                {step.tools.map((tool, index) => (
                                  <div
                                    key={index}
                                    className="p-3 bg-background/50 rounded-lg border border-border/50 hover:bg-accent/20 transition-colors"
                                  >
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-medium text-primary text-sm">
                                        {tool.name}
                                      </span>
                                      <Badge className={`text-xs ${getToolTypeColor(tool.type)}`}>
                                        {tool.type}
                                      </Badge>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      ✨ {tool.usage}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Code Example Section */}
                            <div>
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                  💻 Code Example
                                </h4>
                                <button
                                  onClick={() => setShowCode(showCode === step.step ? null : step.step)}
                                  className="text-xs text-primary hover:text-primary/80 transition-colors"
                                  aria-expanded={showCode === step.step}
                                >
                                  {showCode === step.step ? 'Hide Code' : 'Show Code'}
                                </button>
                              </div>
                              
                              <AnimatePresence>
                                {showCode === step.step && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="rounded-lg overflow-hidden border border-border/50">
                                      <SyntaxHighlighter
                                        language="python"
                                        style={vscDarkPlus}
                                        customStyle={{
                                          margin: 0,
                                          fontSize: '12px',
                                          background: 'hsl(var(--muted))',
                                        }}
                                        showLineNumbers
                                      >
                                        {step.codeExample}
                                      </SyntaxHighlighter>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </StepWrapper>
            ))}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
