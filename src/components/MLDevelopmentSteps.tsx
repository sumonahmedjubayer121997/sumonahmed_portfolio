
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, Clock, CheckCircle, Circle, AlertCircle } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
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
      { name: "Python", type: "language" },
      { name: "Pandas", type: "library" },
      { name: "SQL", type: "query" },
      { name: "API Integration", type: "integration" }
    ],
    codeExample: `import pandas as pd
import requests

# Fetch data from API
response = requests.get('https://api.example.com/data')
raw_data = response.json()

# Load and combine datasets
df = pd.read_csv('dataset.csv')
df_combined = pd.concat([df, pd.DataFrame(raw_data)])`,
    insight: "💡 Always validate data quality at this stage to catch issues early"
  },
  {
    step: 2,
    icon: "🧹",
    title: "Data Cleaning",
    category: "Preprocessing",
    priority: "high",
    duration: "3-4 days",
    status: "completed" as const,
    description: "Handled missing values, removed duplicates, and standardized data formats. Applied outlier detection and treatment strategies.",
    tools: [
      { name: "Pandas", type: "library" },
      { name: "NumPy", type: "library" },
      { name: "Scikit-learn", type: "ml" },
      { name: "Matplotlib", type: "visualization" }
    ],
    codeExample: `# Handle missing values
df.fillna(method='forward', inplace=True)

# Remove duplicates
df.drop_duplicates(inplace=True)

# Detect and handle outliers
from scipy import stats
z_scores = np.abs(stats.zscore(df.select_dtypes(include=[np.number])))
df_clean = df[(z_scores < 3).all(axis=1)]`,
    insight: "🔍 Removed 15% of records as duplicates, improving data quality significantly"
  },
  {
    step: 3,
    icon: "📊",
    title: "Exploratory Data Analysis",
    category: "Analysis",
    priority: "medium",
    duration: "2-3 days",
    status: "in-progress" as const,
    description: "Visualized feature distributions, correlations, and patterns. Created comprehensive statistical summaries and identified key insights.",
    tools: [
      { name: "Matplotlib", type: "visualization" },
      { name: "Seaborn", type: "visualization" },
      { name: "Plotly", type: "visualization" },
      { name: "Pandas Profiling", type: "library" }
    ],
    codeExample: `import seaborn as sns
import matplotlib.pyplot as plt

# Correlation heatmap
plt.figure(figsize=(12, 8))
sns.heatmap(df.corr(), annot=True, cmap='coolwarm')

# Feature distributions
df.hist(bins=30, figsize=(15, 10))
plt.tight_layout()`,
    insight: "📈 Discovered strong correlation (0.85) between features X and Y"
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
    tools: [
      { name: "Scikit-learn", type: "ml" },
      { name: "Feature-engine", type: "library" },
      { name: "Category Encoders", type: "library" }
    ],
    codeExample: `from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.feature_selection import SelectKBest, f_classif

# Feature scaling
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_numeric)

# Feature selection
selector = SelectKBest(f_classif, k=10)
X_selected = selector.fit_transform(X_scaled, y)`,
    insight: "🎯 Created 12 new features that improved model performance by 8%"
  },
  {
    step: 5,
    icon: "🤖",
    title: "Model Building",
    category: "Modeling",
    priority: "high",
    duration: "4-6 days",
    status: "completed" as const,
    description: "Experimented with multiple algorithms including ensemble methods, neural networks, and traditional ML models.",
    tools: [
      { name: "Scikit-learn", type: "ml" },
      { name: "XGBoost", type: "ml" },
      { name: "TensorFlow", type: "framework" },
      { name: "Optuna", type: "optimization" }
    ],
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
    description: "Assessed model performance using appropriate metrics, conducted A/B testing, and validated results on holdout datasets.",
    tools: [
      { name: "Scikit-learn", type: "ml" },
      { name: "MLflow", type: "mlops" },
      { name: "Weights & Biases", type: "mlops" },
      { name: "Custom Metrics", type: "custom" }
    ],
    codeExample: `from sklearn.metrics import classification_report, confusion_matrix

# Model evaluation
y_pred = model.predict(X_test)
print(classification_report(y_test, y_pred))

# Cross-validation scores
scores = cross_val_score(model, X, y, cv=5)
print(f"CV Score: {scores.mean():.3f} (+/- {scores.std() * 2:.3f})")`,
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
    description: "Deployed the final model to production with monitoring and logging. Set up automated retraining pipelines.",
    tools: [
      { name: "FastAPI", type: "framework" },
      { name: "Docker", type: "devops" },
      { name: "AWS/GCP", type: "cloud" },
      { name: "MLflow", type: "mlops" }
    ],
    codeExample: `from fastapi import FastAPI
import joblib

app = FastAPI()
model = joblib.load('model.pkl')

@app.post("/predict")
async def predict(data: dict):
    prediction = model.predict([list(data.values())])
    return {"prediction": prediction[0]}`,
    insight: "🌐 Live API serving 1000+ predictions/day with 99.9% uptime"
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
  const [showCode, setShowCode] = useState<number | null>(null);

  const toggleStep = (stepNumber: number) => {
    setActiveStep(prev => prev === stepNumber ? null : stepNumber);
    setShowCode(null);
  };

  const getStatusIcon = (status: StepStatus) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case "in-progress": return <Circle className="w-4 h-4 text-blue-500 animate-pulse" />;
      case "optional": return <AlertCircle className="w-4 h-4 text-amber-500" />;
    }
  };

  const getStatusColor = (status: StepStatus) => {
    switch (status) {
      case "completed": return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800";
      case "in-progress": return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800";
      case "optional": return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800";
    }
  };

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-foreground mb-3">
          ML Development Pipeline
        </h2>
        <p className="text-muted-foreground text-lg">
          Interactive timeline of the machine learning development process
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border"></div>

        <div className="space-y-8">
          {steps.map((step, index) => (
            <div key={step.step} className="relative">
              {/* Timeline Dot */}
              <div className="absolute left-6 w-4 h-4 bg-background border-2 border-primary rounded-full z-10 flex items-center justify-center">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
              </div>

              {/* Arrow Connector */}
              {index < steps.length - 1 && (
                <div className="absolute left-10 top-8 w-6 h-6 text-muted-foreground/40">
                  <ChevronDown className="w-4 h-4" />
                </div>
              )}

              {/* Step Card */}
              <div className="ml-16">
                <button
                  onClick={() => toggleStep(step.step)}
                  className="w-full text-left group"
                  aria-expanded={activeStep === step.step}
                >
                  <div className={`p-6 rounded-lg border transition-all duration-200 hover:shadow-md ${
                    activeStep === step.step 
                      ? 'bg-accent/50 border-primary/30 shadow-sm' 
                      : 'bg-card border-border hover:bg-accent/30'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-2xl">{step.icon}</span>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-lg font-semibold text-foreground">
                              {step.title}
                            </h3>
                            <Badge className={`text-xs border ${getStatusColor(step.status)}`}>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(step.status)}
                                <span className="capitalize">{step.status.replace('-', ' ')}</span>
                              </div>
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {step.duration}
                            </span>
                            <span>{step.category}</span>
                          </div>
                        </div>
                      </div>
                      
                      <motion.div
                        animate={{ rotate: activeStep === step.step ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-muted-foreground"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </motion.div>
                    </div>
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
                          height: { duration: 0.3, ease: "easeOut" },
                          opacity: { duration: 0.2, delay: 0.1 }
                        }
                      }}
                      exit={{ 
                        height: 0, 
                        opacity: 0,
                        transition: {
                          height: { duration: 0.2, ease: "easeIn" },
                          opacity: { duration: 0.1 }
                        }
                      }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 p-6 bg-muted/30 rounded-lg border border-muted space-y-6">
                        {/* Description */}
                        <p className="text-foreground leading-relaxed">
                          {step.description}
                        </p>
                        
                        {/* Insight */}
                        <div className="p-4 bg-primary/5 border border-primary/10 rounded-md">
                          <p className="text-sm text-primary font-medium">
                            {step.insight}
                          </p>
                        </div>
                        
                        {/* Tools */}
                        <div>
                          <h4 className="text-sm font-semibold text-foreground mb-3">
                            🛠️ Tools Used
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {step.tools.map((tool, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tool.name}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Code Example */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-semibold text-foreground">
                              💻 Code Example
                            </h4>
                            <button
                              onClick={() => setShowCode(showCode === step.step ? null : step.step)}
                              className="text-xs text-primary hover:text-primary/80 transition-colors"
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
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="rounded-md overflow-hidden border border-border/50">
                                  <SyntaxHighlighter
                                    language="python"
                                    style={vscDarkPlus}
                                    customStyle={{
                                      margin: 0,
                                      fontSize: '13px',
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
          ))}
        </div>
      </div>
    </div>
  );
}
