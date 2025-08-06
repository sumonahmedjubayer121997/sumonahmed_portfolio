
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
        <div className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl blur-xl"></div>
            <div className="relative bg-gradient-to-br from-background/80 to-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50 shadow-2xl">
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center gap-3 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                  <span className="text-2xl">🧠</span>
                  <span className="text-sm font-medium text-primary">AI/ML Development</span>
                </div>
              </div>
              
              <h2 className="text-4xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent mb-4">
                ML Development Pipeline
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Interactive timeline showcasing the complete machine learning development journey from data collection to production deployment
              </p>
              
              {/* Enhanced Stats */}
              <div className="flex justify-center gap-6 mt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">7</div>
                  <div className="text-xs text-muted-foreground">Steps</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">94.2%</div>
                  <div className="text-xs text-muted-foreground">Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">20+</div>
                  <div className="text-xs text-muted-foreground">Tools</div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Enhanced Icon Legend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8"
          >
            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-border/50 shadow-lg">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="text-primary">📋</span>
                Pipeline Overview
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {[
                  { icon: '📥', label: 'Data Collection', color: 'bg-blue-500' },
                  { icon: '🧹', label: 'Data Cleaning', color: 'bg-green-500' },
                  { icon: '📊', label: 'Analysis', color: 'bg-purple-500' },
                  { icon: '⚙️', label: 'Feature Eng.', color: 'bg-orange-500' },
                  { icon: '🤖', label: 'Model Training', color: 'bg-red-500' },
                  { icon: '📈', label: 'Evaluation', color: 'bg-indigo-500' },
                  { icon: '🚀', label: 'Deployment', color: 'bg-pink-500' }
                ].map((item, index) => (
                  <div key={index} className="flex flex-col items-center p-2 rounded-lg hover:bg-accent/20 transition-colors">
                    <div className={`w-8 h-8 rounded-full ${item.color}/10 flex items-center justify-center mb-1 border border-${item.color}/20`}>
                      <span className="text-lg">{item.icon}</span>
                    </div>
                    <span className="text-xs text-muted-foreground text-center leading-tight">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Enhanced Category Filter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center mb-10"
        >
          <div className="bg-card/70 backdrop-blur-sm rounded-2xl p-2 border border-border/50 shadow-lg">
            <div className="flex flex-wrap gap-1">
              {categories.map(category => (
                <motion.button
                  key={category}
                  onClick={() => setFilter(category)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 ${
                    filter === category
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                  }`}
                >
                  {filter === category && (
                    <motion.div
                      layoutId="activeCategory"
                      className="absolute inset-0 bg-primary rounded-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <span className="capitalize">{category}</span>
                    {filter === category && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-xs"
                      >
                        ✓
                      </motion.span>
                    )}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Enhanced Navigation Icons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-center mb-12"
        >
          <div className="relative bg-gradient-to-r from-card/50 via-card/70 to-card/50 backdrop-blur-lg rounded-2xl p-6 border border-border/50 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-2xl"></div>
            
            <div className="relative">
              <h3 className="text-center text-sm font-semibold text-foreground mb-4 flex items-center justify-center gap-2">
                <span className="text-primary">🎯</span>
                Quick Navigation
              </h3>
              
              <div className="flex items-center justify-center">
                <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                  {filteredSteps.map((step, index) => (
                    <div key={step.step} className="flex items-center">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.button
                            onClick={() => scrollToStep(step.step)}
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className={`relative flex-shrink-0 w-14 h-14 rounded-2xl border-2 flex items-center justify-center text-xl transition-all duration-300 ${
                              visibleSteps.has(step.step)
                                ? 'border-primary bg-primary shadow-xl shadow-primary/30 scale-110'
                                : activeStep === step.step
                                ? 'border-primary/60 bg-primary/10 scale-105 shadow-lg'
                                : 'border-border bg-background/80 hover:border-primary/40 hover:bg-accent/40 hover:shadow-lg'
                            }`}
                            aria-label={`Go to ${step.title}`}
                          >
                            <motion.span
                              animate={{ 
                                scale: visibleSteps.has(step.step) ? 1.2 : 1,
                                rotate: visibleSteps.has(step.step) ? [0, 10, -10, 0] : 0
                              }}
                              transition={{ 
                                duration: visibleSteps.has(step.step) ? 0.5 : 0.3,
                                ease: "easeOut" 
                              }}
                            >
                              {step.icon}
                            </motion.span>
                            
                            {/* Enhanced Status indicator */}
                            <motion.div 
                              className="absolute -top-1 -right-1"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.2 }}
                            >
                              {getStatusIcon(step.status)}
                            </motion.div>
                            
                            {/* Progress ring */}
                            {visibleSteps.has(step.step) && (
                              <motion.div
                                className="absolute inset-0 rounded-2xl border-2 border-primary/30"
                                initial={{ scale: 1, opacity: 1 }}
                                animate={{ scale: 1.3, opacity: 0 }}
                                transition={{ duration: 1, repeat: Infinity }}
                              />
                            )}
                          </motion.button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <div className="text-center">
                            <div className="font-medium">{step.title}</div>
                            <div className="text-xs text-muted-foreground">{step.category}</div>
                            <div className="text-xs text-primary mt-1">
                              {step.status === 'completed' ? '✅ Complete' : 
                               step.status === 'in-progress' ? '🔄 In Progress' : '⭕ Optional'}
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                      
                      {/* Connection line */}
                      {index < filteredSteps.length - 1 && (
                        <motion.div
                          className={`w-8 h-0.5 mx-1 transition-colors duration-500 ${
                            visibleSteps.has(step.step) && visibleSteps.has(filteredSteps[index + 1].step)
                              ? 'bg-primary'
                              : 'bg-border'
                          }`}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ delay: index * 0.1 }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Progress indicator */}
              <div className="mt-4 text-center">
                <div className="text-xs text-muted-foreground mb-2">Progress</div>
                <div className="w-full bg-muted rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${(visibleSteps.size / filteredSteps.length) * 100}%` 
                    }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {visibleSteps.size} of {filteredSteps.length} steps completed
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="relative">
          {/* Enhanced Timeline Line with Glow Effect */}
          <div className="absolute left-7 top-0 bottom-0 w-1 bg-gradient-to-b from-border via-border to-border/20 rounded-full">
            {/* Animated progress indicator with glow */}
            <motion.div
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-primary via-primary/80 to-primary/60 rounded-full shadow-lg shadow-primary/25"
              initial={{ height: 0 }}
              animate={{ 
                height: visibleSteps.size > 0 ? `${(Math.max(...visibleSteps) / filteredSteps.length) * 100}%` : 0 
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
            
            {/* Animated pulse at the end of progress */}
            {visibleSteps.size > 0 && (
              <motion.div
                className="absolute w-3 h-3 bg-primary rounded-full -left-1 shadow-lg shadow-primary/50"
                style={{ 
                  top: `${(Math.max(...visibleSteps) / filteredSteps.length) * 100}%`,
                  marginTop: '-6px'
                }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </div>

          <div className="space-y-8">
            {filteredSteps.map((step, index) => (
              <StepWrapper key={step.step} stepNumber={step.step}>
                <motion.div 
                  id={`step-${step.step}`} 
                  className="relative flex items-start group"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  {/* Enhanced Timeline Dot with Floating Animation */}
                  <motion.div 
                    className={`relative z-10 flex-shrink-0 w-14 h-14 rounded-2xl border-4 border-background flex items-center justify-center text-2xl transition-all duration-500 ${
                      visibleSteps.has(step.step)
                        ? 'bg-gradient-to-br from-primary to-primary/80 shadow-2xl shadow-primary/40 scale-115' 
                        : activeStep === step.step
                        ? 'bg-gradient-to-br from-primary/90 to-primary/70 shadow-xl shadow-primary/30 scale-110'
                        : 'bg-gradient-to-br from-card to-card/80 shadow-lg hover:shadow-xl hover:scale-105 hover:bg-gradient-to-br hover:from-accent hover:to-accent/80'
                    }`}
                    whileHover={{ y: -2 }}
                    animate={{
                      y: visibleSteps.has(step.step) ? [-2, 2, -2] : 0,
                    }}
                    transition={{
                      y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                      scale: { duration: 0.3 }
                    }}
                  >
                    <motion.span
                      animate={{ 
                        scale: visibleSteps.has(step.step) ? 1.1 : 1,
                        rotate: visibleSteps.has(step.step) ? [0, 5, -5, 0] : 0 
                      }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                      {step.icon}
                    </motion.span>
                    
                    {/* Glowing ring animation for active steps */}
                    {visibleSteps.has(step.step) && (
                      <motion.div
                        className="absolute inset-0 rounded-2xl border-2 border-primary/50"
                        animate={{ scale: [1, 1.2, 1], opacity: [1, 0.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </motion.div>

                  {/* Enhanced Step Content with Better Spacing */}
                  <div className="ml-8 flex-1">
                    <motion.button
                      onClick={() => toggleStep(step.step)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`w-full text-left p-8 rounded-2xl border-2 transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                        activeStep === step.step
                          ? 'bg-gradient-to-br from-primary/8 via-primary/5 to-primary/8 border-primary/30 shadow-2xl shadow-primary/10'
                          : 'bg-gradient-to-br from-card/90 to-card/70 border-border/50 hover:border-primary/20 hover:bg-gradient-to-br hover:from-accent/30 hover:to-accent/20 shadow-lg hover:shadow-xl'
                      }`}
                      aria-expanded={activeStep === step.step}
                      aria-controls={`step-content-${step.step}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-4 flex-wrap">
                            <Badge variant="outline" className="text-sm font-semibold px-3 py-1 bg-primary/10 border-primary/30">
                              Step {step.step}
                            </Badge>
                            <Badge variant="secondary" className="text-sm uppercase tracking-wider font-medium bg-secondary/80">
                              {step.category}
                            </Badge>
                            <Badge className={`text-sm font-medium ${getPriorityColor(step.priority)}`}>
                              <Zap className="w-4 h-4 inline mr-1" />
                              {step.priority} priority
                            </Badge>
                            <Badge variant="outline" className="text-sm flex items-center bg-muted/50">
                              <Clock className="w-4 h-4 mr-1" />
                              {step.duration}
                            </Badge>
                            <Badge className={`text-sm flex items-center font-medium ${getStatusColor(step.status)}`}>
                              {getStatusIcon(step.status)}
                              <span className="ml-1 capitalize">{step.status.replace('-', ' ')}</span>
                            </Badge>
                          </div>
                          <h3 className={`text-2xl font-bold transition-colors mb-2 ${
                            activeStep === step.step ? 'text-primary' : 'text-foreground'
                          }`}>
                            {step.title}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {step.description.substring(0, 120)}...
                          </p>
                        </div>
                        
                        <motion.div
                          animate={{ rotate: activeStep === step.step ? 180 : 0 }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                          className="flex-shrink-0 ml-4"
                        >
                          <div className={`p-2 rounded-full transition-colors ${
                            activeStep === step.step 
                              ? 'bg-primary/20 text-primary' 
                              : 'bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                          }`}>
                            <ChevronDown className="w-6 h-6" />
                          </div>
                        </motion.div>
                      </div>
                    </motion.button>

                    {/* Enhanced Expanded Content with Better Organization */}
                    <AnimatePresence initial={false}>
                      {activeStep === step.step && (
                        <motion.div
                          id={`step-content-${step.step}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ 
                            height: "auto", 
                            opacity: 1,
                            transition: {
                              height: { duration: 0.5, ease: "easeOut" },
                              opacity: { duration: 0.4, delay: 0.1 }
                            }
                          }}
                          exit={{ 
                            height: 0, 
                            opacity: 0,
                            transition: {
                              height: { duration: 0.4, ease: "easeIn" },
                              opacity: { duration: 0.3 }
                            }
                          }}
                          className="overflow-hidden"
                        >
                          <div className="mt-6 p-8 bg-gradient-to-br from-muted/40 via-muted/30 to-muted/40 rounded-2xl border border-muted/50 space-y-8 backdrop-blur-sm">
                            <motion.div
                              initial={{ y: 20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.2 }}
                            >
                              <p className="text-foreground leading-relaxed text-lg">
                                {step.description}
                              </p>
                            </motion.div>
                            
                            {/* Enhanced Media/Insight Box */}
                            {step.media && (
                              <motion.div 
                                className="relative p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-2 border-primary/20 rounded-2xl overflow-hidden"
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-50"></div>
                                <div className="relative flex items-center gap-3">
                                  <div className="p-2 bg-primary/20 rounded-full">
                                    <span className="text-lg">💡</span>
                                  </div>
                                  <p className="text-primary font-semibold text-lg">
                                    {step.media.content}
                                  </p>
                                </div>
                              </motion.div>
                            )}
                            
                            {/* Enhanced Tools Section with Grid Layout */}
                            <motion.div
                              initial={{ y: 20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.4 }}
                            >
                              <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                  <span className="text-xl">🛠️</span>
                                </div>
                                <h4 className="text-lg font-bold text-foreground">
                                  Tools & Technologies
                                </h4>
                              </div>
                              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {step.tools.map((tool, toolIndex) => (
                                  <motion.div
                                    key={toolIndex}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.5 + toolIndex * 0.1 }}
                                    whileHover={{ scale: 1.03, y: -2 }}
                                    className="group p-5 bg-gradient-to-br from-background/80 to-card/60 rounded-xl border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg backdrop-blur-sm"
                                  >
                                    <div className="flex items-center gap-3 mb-3">
                                      <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                                        <span className="text-sm font-bold text-primary">
                                          {tool.name.charAt(0)}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="font-semibold text-primary text-base block">
                                          {tool.name}
                                        </span>
                                        <Badge className={`text-xs ${getToolTypeColor(tool.type)}`}>
                                          {tool.type}
                                        </Badge>
                                      </div>
                                    </div>
                                    <div className="text-sm text-muted-foreground leading-relaxed">
                                      <span className="text-primary mr-1">→</span>
                                      {tool.usage}
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </motion.div>

                            {/* Enhanced Code Example Section */}
                            <motion.div
                              initial={{ y: 20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.6 }}
                            >
                              <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-primary/10 rounded-lg">
                                    <span className="text-xl">💻</span>
                                  </div>
                                  <h4 className="text-lg font-bold text-foreground">
                                    Code Example
                                  </h4>
                                </div>
                                <motion.button
                                  onClick={() => setShowCode(showCode === step.step ? null : step.step)}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors border border-primary/20 hover:border-primary/30"
                                  aria-expanded={showCode === step.step}
                                >
                                  <span className="text-sm font-medium">
                                    {showCode === step.step ? 'Hide Code' : 'Show Code'}
                                  </span>
                                  <motion.span
                                    animate={{ rotate: showCode === step.step ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    ▼
                                  </motion.span>
                                </motion.button>
                              </div>
                              
                              <AnimatePresence>
                                {showCode === step.step && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="rounded-2xl overflow-hidden border-2 border-border/50 shadow-lg">
                                      <div className="bg-muted/80 px-4 py-2 border-b border-border/50 flex items-center gap-2">
                                        <div className="flex gap-1">
                                          <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                          <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                        </div>
                                        <span className="text-xs text-muted-foreground ml-2">
                                          Step {step.step} - {step.title.toLowerCase().replace(' ', '_')}.py
                                        </span>
                                      </div>
                                      <SyntaxHighlighter
                                        language="python"
                                        style={vscDarkPlus}
                                        customStyle={{
                                          margin: 0,
                                          fontSize: '14px',
                                          background: 'hsl(var(--muted))',
                                          padding: '1.5rem',
                                        }}
                                        showLineNumbers
                                        lineNumberStyle={{
                                          color: 'hsl(var(--muted-foreground))',
                                          fontSize: '12px'
                                        }}
                                      >
                                        {step.codeExample}
                                      </SyntaxHighlighter>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </StepWrapper>
            ))}
          </div>
        </div>

        {/* Enhanced Floating Action Button */}
        <motion.div
          className="fixed bottom-8 right-8 z-50"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="relative">
            <motion.button
              onClick={() => {
                const nextStep = filteredSteps.find(step => !visibleSteps.has(step.step));
                if (nextStep) scrollToStep(nextStep.step);
                else scrollToStep(1);
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-14 h-14 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-2xl shadow-2xl shadow-primary/30 flex items-center justify-center transition-all duration-300 hover:shadow-3xl hover:shadow-primary/40 backdrop-blur-sm border border-primary/20"
              aria-label="Navigate to next step"
            >
              <motion.span
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-xl"
              >
                🚀
              </motion.span>
            </motion.button>
            
            {/* Progress ring around FAB */}
            <svg className="absolute inset-0 w-14 h-14 -rotate-90">
              <circle
                cx="28"
                cy="28"
                r="26"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-primary/20"
              />
              <motion.circle
                cx="28"
                cy="28"
                r="26"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-primary"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 26}`}
                strokeDashoffset={`${2 * Math.PI * 26 * (1 - visibleSteps.size / filteredSteps.length)}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 26 }}
                animate={{ 
                  strokeDashoffset: 2 * Math.PI * 26 * (1 - visibleSteps.size / filteredSteps.length)
                }}
                transition={{ duration: 0.5 }}
              />
            </svg>
          </div>
        </motion.div>

        {/* Enhanced Summary Footer */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-16 p-8 bg-gradient-to-br from-card/80 via-card/60 to-card/80 backdrop-blur-lg rounded-3xl border border-border/50 shadow-2xl"
        >
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-foreground mb-2 flex items-center justify-center gap-3">
              <span className="text-3xl">🎯</span>
              Pipeline Summary
            </h3>
            <p className="text-muted-foreground">
              Complete overview of the ML development journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl border border-green-200 dark:border-green-800/30">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                {steps.filter(s => s.status === 'completed').length}
              </div>
              <div className="text-sm text-green-700 dark:text-green-300 font-medium">Completed</div>
              <div className="text-xs text-green-600 dark:text-green-400 mt-1">Ready for production</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl border border-blue-200 dark:border-blue-800/30">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                {steps.filter(s => s.status === 'in-progress').length}
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300 font-medium">In Progress</div>
              <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">Currently working</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 rounded-2xl border border-gray-200 dark:border-gray-800/30">
              <div className="text-3xl font-bold text-gray-600 dark:text-gray-400 mb-1">
                {steps.filter(s => s.status === 'optional').length}
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">Optional</div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Enhancement steps</div>
            </div>
          </div>
          
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              <span className="text-sm text-primary font-medium">94.2% Model Accuracy</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-full border border-green-500/20">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">Production Ready</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full border border-blue-500/20">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">20+ Tools Used</span>
            </div>
          </div>
        </motion.div>
      </div>
    </TooltipProvider>
  );
}
