
import { motion } from "framer-motion";
import { CheckCircle, Circle, AlertCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

type StepStatus = "completed" | "in-progress" | "optional";

interface Step {
	step: number;
	icon: string;
	title: string;
	category: string;
	priority: string;
	duration: string;
	status: StepStatus;
	description: string;
	tools: Array<{ name: string; usage: string; type: string }>;
	codeExample: string;
	media: {
		type: string;
		content: string;
	};
}

interface MLStepNavigationProps {
	filteredSteps: Step[];
	activeStep: number | null;
	visibleSteps: Set<number>;
	onStepClick: (stepNumber: number) => void;
	getPriorityColor: (priority: string) => string;
	getStatusColor: (status: StepStatus) => string;
	getToolTypeColor: (type: string) => string;
}

const getStatusIcon = (status: StepStatus) => {
	switch (status) {
		case "completed": return <CheckCircle className="w-4 h-4 text-green-500" />;
		case "in-progress": return <Circle className="w-4 h-4 text-blue-500 animate-pulse" />;
		case "optional": return <AlertCircle className="w-4 h-4 text-gray-400" />;
	}
};

export default function MLStepNavigation({
	filteredSteps,
	activeStep,
	visibleSteps,
	onStepClick,
	getPriorityColor,
	getStatusColor,
	getToolTypeColor
}: MLStepNavigationProps) {
	return (
		<div className="mb-8">
			<div className="bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-border/50 shadow-lg">
				<h3 className="text-sm font-semibold text-foreground mb-3 flex items-center justify-center gap-2">
					<span className="text-primary">🗺️</span>
					Development Pipeline Navigation
					{activeStep === null && (
						<span className="text-xs text-muted-foreground font-normal ml-2">
							(Click any step to explore)
						</span>
					)}
				</h3>
				
				<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
					{filteredSteps.map((step) => (
						<Tooltip key={step.step}>
							<TooltipTrigger asChild>
								<motion.button
									onClick={() => onStepClick(step.step)}
									className={`relative group p-3 rounded-lg border-2 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
										activeStep === step.step
											? 'border-primary bg-primary/20 shadow-lg'
											: visibleSteps.has(step.step)
											? 'border-primary bg-primary/10'
											: 'border-border/50 bg-background/50 hover:border-primary/30 hover:bg-accent/20'
									}`}
									whileHover={{ y: -2 }}
									whileTap={{ scale: 0.95 }}
								>
									{/* Step Number Badge */}
									<div className="absolute -top-2 -left-2 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
										{step.step}
									</div>

									{/* Main Icon */}
									<div className="flex flex-col items-center space-y-1">
										<div className="text-2xl mb-1">
											{step.icon}
										</div>
										<div className="text-xs font-medium text-foreground text-center leading-tight">
											{step.title}
										</div>
									</div>

									{/* Status Indicator */}
									<div className="absolute -top-1 -right-1 p-0.5 bg-background rounded-full border border-border/30">
										{getStatusIcon(step.status)}
									</div>
								</motion.button>
							</TooltipTrigger>
							
							<TooltipContent side="bottom" className="max-w-80 p-4">
								<div className="space-y-3">
									<div className="text-center">
										<div className="font-bold text-lg">{step.title}</div>
										<div className="text-sm text-muted-foreground">{step.category}</div>
									</div>
									
									<div className="text-sm">{step.description}</div>
									
									<div className="flex flex-wrap gap-1 justify-center">
										<Badge variant="outline" className="text-xs">⏱️ {step.duration}</Badge>
										<Badge className={`text-xs ${getPriorityColor(step.priority)}`}>{step.priority}</Badge>
										<Badge className={`text-xs ${getStatusColor(step.status)}`}>{step.status.replace('-', ' ')}</Badge>
									</div>
									
									{step.media && (
										<div className="p-2 bg-primary/5 border border-primary/20 rounded text-xs font-medium text-primary text-center">
											{step.media.content}
										</div>
									)}
									
									<div>
										<div className="text-xs font-semibold mb-1">🛠️ Key Tools:</div>
										<div className="flex flex-wrap gap-1">
											{step.tools.slice(0, 3).map((tool, i) => (
												<Badge key={i} className={`text-xs ${getToolTypeColor(tool.type)}`}>
													{tool.name}
												</Badge>
											))}
											{step.tools.length > 3 && (
												<Badge variant="outline" className="text-xs">+{step.tools.length - 3}</Badge>
											)}
										</div>
									</div>
								</div>
							</TooltipContent>
						</Tooltip>
					))}
				</div>
			</div>
		</div>
	);
}
