import { useState } from "react";
import { motion } from "framer-motion";
import { TooltipProvider } from "@/components/ui/tooltip";
import MLStepNavigation from "./MLStepNavigation";
import MLStepTimeline from "./MLStepTimeline";

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
	const [filter, setFilter] = useState<string>("all");

	const toggleStep = (stepNumber: number) => {
		const newActiveStep = activeStep === stepNumber ? null : stepNumber;
		setActiveStep(newActiveStep);
		
		if (newActiveStep !== null) {
			setVisibleSteps(new Set([newActiveStep]));
		} else {
			setVisibleSteps(new Set());
		}
	};

	const resetView = () => {
		setActiveStep(null);
		setVisibleSteps(new Set());
	};

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case "high": return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400";
			case "medium": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400";
			default: return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400";
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
				</div>

				{/* Category Filter */}
				<div className="flex justify-center mb-8">
					<div className="flex flex-wrap gap-2 items-center">
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
						
						{/* Reset View Button */}
						{activeStep !== null && (
							<motion.button
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.8 }}
								onClick={resetView}
								className="ml-3 px-3 py-1 text-sm rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors flex items-center gap-1"
							>
								↺ Reset View
							</motion.button>
						)}
					</div>
				</div>

				<MLStepNavigation
					filteredSteps={filteredSteps}
					activeStep={activeStep}
					visibleSteps={visibleSteps}
					onStepClick={toggleStep}
					getPriorityColor={getPriorityColor}
					getStatusColor={getStatusColor}
					getToolTypeColor={getToolTypeColor}
				/>

				<MLStepTimeline
					filteredSteps={filteredSteps}
					activeStep={activeStep}
					visibleSteps={visibleSteps}
					onToggleStep={toggleStep}
					onSetVisibleSteps={setVisibleSteps}
					getPriorityColor={getPriorityColor}
					getStatusColor={getStatusColor}
					getToolTypeColor={getToolTypeColor}
				/>
			</div>
		</TooltipProvider>
	);
}
