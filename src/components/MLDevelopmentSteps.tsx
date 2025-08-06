
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Clock, CheckCircle, Circle, AlertCircle, Code2 } from "lucide-react";
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
    description: "Gathered raw data from multiple sources including APIs, databases, and CSV files. Implemented data validation and quality checks.",
    tools: ["Python", "Pandas", "SQL", "APIs"],
    codeExample: `import pandas as pd
import requests

# Fetch data from API
response = requests.get('https://api.example.com/data')
raw_data = response.json()

# Load and combine datasets
df = pd.read_csv('dataset.csv')
df_combined = pd.concat([df, pd.DataFrame(raw_data)])`,
    insight: "💡 Always validate data quality early to catch issues"
  },
  {
    step: 2,
    icon: "🧹",
    title: "Data Cleaning",
    category: "Preprocessing",
    priority: "high",
    duration: "3-4 days",
    status: "completed" as const,
    description: "Handled missing values, removed duplicates, and standardized data formats. Applied outlier detection strategies.",
    tools: ["Pandas", "NumPy", "Scikit-learn"],
    codeExample: `# Handle missing values
df.fillna(method='forward', inplace=True)

# Remove duplicates
df.drop_duplicates(inplace=True)

# Detect and handle outliers
from scipy import stats
z_scores = np.abs(stats.zscore(df.select_dtypes(include=[np.number])))
df_clean = df[(z_scores < 3).all(axis=1)]`,
    insight: "🔍 Removed 15% of records as duplicates"
  },
  {
    step: 3,
    icon: "📊",
    title: "Exploratory Data Analysis",
    category: "Analysis",
    priority: "medium",
    duration: "2-3 days",
    status: "in-progress" as const,
    description: "Visualized feature distributions, correlations, and patterns. Created statistical summaries and identified key insights.",
    tools: ["Matplotlib", "Seaborn", "Plotly"],
    codeExample: `import seaborn as sns
import matplotlib.pyplot as plt

# Correlation heatmap
plt.figure(figsize=(12, 8))
sns.heatmap(df.corr(), annot=True, cmap='coolwarm')

# Feature distributions
df.hist(bins=30, figsize=(15, 10))
plt.tight_layout()`,
    insight: "📈 Strong correlation (0.85) between features X and Y"
  },
  {
    step: 4,
    icon: "⚙️",
    title: "Feature Engineering",
    category: "Preprocessing",
    priority: "high",
    duration: "3-5 days",
    status: "optional" as const,
    description: "Created new features through transformations, encoding categorical variables, and scaling numerical features.",
    tools: ["Scikit-learn", "Feature-engine"],
    codeExample: `from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.feature_selection import SelectKBest, f_classif

# Feature scaling
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_numeric)

# Feature selection
selector = SelectKBest(f_classif, k=10)
X_selected = selector.fit_transform(X_scaled, y)`,
    insight: "🎯 Created 12 new features improving performance by 8%"
  },
  {
    step: 5,
    icon: "🤖",
    title: "Model Building",
    category: "Modeling",
    priority: "high",
    duration: "4-6 days",
    status: "completed" as const,
    description: "Experimented with multiple algorithms including ensemble methods and neural networks. Implemented cross-validation.",
    tools: ["Scikit-learn", "XGBoost", "TensorFlow"],
    codeExample: `from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import GridSearchCV

# Model training with hyperparameter tuning
rf = RandomForestClassifier()
params = {'n_estimators': [100, 200], 'max_depth': [10, 20]}
grid_search = GridSearchCV(rf, params, cv=5)
grid_search.fit(X_train, y_train)`,
    insight: "🏆 Best model: XGBoost with 94.2% accuracy"
  },
  {
    step: 6,
    icon: "📈",
    title: "Model Evaluation",
    category: "Validation",
    priority: "high",
    duration: "2-3 days",
    status: "completed" as const,
    description: "Assessed model performance using appropriate metrics and validated results on holdout datasets.",
    tools: ["Scikit-learn", "MLflow"],
    codeExample: `from sklearn.metrics import classification_report, confusion_matrix

# Model evaluation
y_pred = model.predict(X_test)
print(classification_report(y_test, y_pred))

# Cross-validation scores
scores = cross_val_score(model, X, y, cv=5)
print(f"CV Score: {scores.mean():.3f}")`,
    insight: "📊 F1-Score: 0.92 | Precision: 0.94 | Recall: 0.90"
  },
  {
    step: 7,
    icon: "🚀",
    title: "Model Deployment",
    category: "Production",
    priority: "medium",
    duration: "3-4 days",
    status: "in-progress" as const,
    description: "Deployed the model to production with monitoring and logging. Set up automated retraining pipelines.",
    tools: ["FastAPI", "Docker", "AWS"],
    codeExample: `from fastapi import FastAPI
import joblib

app = FastAPI()
model = joblib.load('model.pkl')

@app.post("/predict")
async def predict(data: dict):
    prediction = model.predict([list(data.values())])
    return {"prediction": prediction[0]}`,
    insight: "🌐 Serving 1000+ predictions/day with 99.9% uptime"
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

  const toggleStep = (stepNumber: number) => {
    setActiveStep(prev => prev === stepNumber ? null : stepNumber);
    setShowCode(null);
  };

  const scrollToStep = (stepNumber: number) => {
    const element = document.getElementById(`step-${stepNumber}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setActiveStep(stepNumber);
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
      case "completed": return "text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-950/20 dark:border-green-800";
      case "in-progress": return "text-blue-600 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-950/20 dark:border-blue-800";
      case "optional": return "text-gray-500 bg-gray-50 border-gray-200 dark:text-gray-400 dark:bg-gray-950/20 dark:border-gray-700";
    }
  };

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
      <div className={`w-full max-w-4xl mx-auto ${className}`}>
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            ML Development Pipeline
          </h2>
          <p className="text-sm text-muted-foreground">
            Click any step to explore the development process
          </p>
        </div>

        {/* Quick Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
            {steps.map((step) => (
              <Tooltip key={step.step}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => scrollToStep(step.step)}
                    className={`relative w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${
                      visibleSteps.has(step.step)
                        ? 'bg-primary text-primary-foreground shadow-md scale-110'
                        : 'bg-background border hover:bg-accent'
                    }`}
                  >
                    {step.icon}
                    <div className="absolute -top-1 -right-1">
                      {getStatusIcon(step.status)}
                    </div>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-xs">
                    <div className="font-medium">{step.title}</div>
                    <div className="text-muted-foreground">{step.category}</div>
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-border">
            <motion.div
              className="absolute top-0 left-0 w-full bg-primary"
              initial={{ height: 0 }}
              animate={{ 
                height: visibleSteps.size > 0 ? `${(Math.max(...visibleSteps) / steps.length) * 100}%` : 0 
              }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <div className="space-y-4">
            {steps.map((step) => (
              <StepWrapper key={step.step} stepNumber={step.step}>
                <div id={`step-${step.step}`} className="relative flex items-start">
                  {/* Timeline dot */}
                  <div className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all ${
                    visibleSteps.has(step.step)
                      ? 'bg-primary text-primary-foreground shadow-lg scale-110' 
                      : 'bg-background border-2 border-border'
                  }`}>
                    <motion.span
                      animate={{ 
                        scale: visibleSteps.has(step.step) ? 1.1 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {step.icon}
                    </motion.span>
                  </div>

                  {/* Step content */}
                  <div className="ml-6 flex-1">
                    <button
                      onClick={() => toggleStep(step.step)}
                      className={`w-full text-left p-4 rounded-lg border transition-all ${
                        activeStep === step.step
                          ? 'bg-accent/50 border-primary/20'
                          : 'bg-card border-border hover:bg-accent/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-muted-foreground">Step {step.step}</span>
                            <Badge variant="outline" className="text-xs">
                              {step.category}
                            </Badge>
                            <Badge className={`text-xs ${getStatusColor(step.status)}`}>
                              {step.status.replace('-', ' ')}
                            </Badge>
                          </div>
                          <h3 className="font-medium text-foreground">
                            {step.title}
                          </h3>
                        </div>
                        
                        <motion.div
                          animate={{ rotate: activeStep === step.step ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        </motion.div>
                      </div>
                    </button>

                    {/* Expanded content */}
                    <AnimatePresence>
                      {activeStep === step.step && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-3 p-4 bg-muted/20 rounded-lg space-y-4">
                            <p className="text-sm text-muted-foreground">
                              {step.description}
                            </p>
                            
                            {/* Insight */}
                            <div className="p-3 bg-primary/5 border border-primary/20 rounded-md">
                              <p className="text-xs font-medium text-primary">
                                {step.insight}
                              </p>
                            </div>
                            
                            {/* Tools */}
                            <div>
                              <h4 className="text-xs font-medium text-foreground mb-2 flex items-center gap-1">
                                🛠️ Tools Used
                              </h4>
                              <div className="flex flex-wrap gap-1">
                                {step.tools.map((tool, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {tool}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {/* Code toggle */}
                            <div>
                              <button
                                onClick={() => setShowCode(showCode === step.step ? null : step.step)}
                                className="flex items-center gap-2 text-xs text-primary hover:text-primary/80 transition-colors"
                              >
                                <Code2 className="w-3 h-3" />
                                {showCode === step.step ? 'Hide Code' : 'Show Code Example'}
                              </button>
                              
                              <AnimatePresence>
                                {showCode === step.step && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden mt-2"
                                  >
                                    <div className="rounded-md overflow-hidden border">
                                      <SyntaxHighlighter
                                        language="python"
                                        style={vscDarkPlus}
                                        customStyle={{
                                          margin: 0,
                                          fontSize: '11px',
                                          background: 'hsl(var(--muted))',
                                        }}
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
