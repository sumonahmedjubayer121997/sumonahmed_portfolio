
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import MLStepContent from "./MLStepContent";

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

interface MLStepTimelineProps {
	filteredSteps: Step[];
	activeStep: number | null;
	visibleSteps: Set<number>;
	onToggleStep: (stepNumber: number) => void;
	onSetVisibleSteps: (setFunction: (prev: Set<number>) => Set<number>) => void;
	getPriorityColor: (priority: string) => string;
	getStatusColor: (status: StepStatus) => string;
	getToolTypeColor: (type: string) => string;
}

export default function MLStepTimeline({
	filteredSteps,
	activeStep,
	visibleSteps,
	onToggleStep,
	onSetVisibleSteps,
	getPriorityColor,
	getStatusColor,
	getToolTypeColor
}: MLStepTimelineProps) {
	// Step wrapper with intersection observer
	const StepWrapper = ({ children, stepNumber }: { children: React.ReactNode, stepNumber: number }) => {
		const { ref, inView } = useInView({
			threshold: 0.3,
			triggerOnce: false,
		});

		useEffect(() => {
			// Only auto-update visible steps if no step is manually active
			if (activeStep === null) {
				if (inView) {
					onSetVisibleSteps(prev => new Set([...prev, stepNumber]));
				} else {
					onSetVisibleSteps(prev => {
						const newSet = new Set(prev);
						newSet.delete(stepNumber);
						return newSet;
					});
				}
			}
		}, [inView, stepNumber, activeStep]);

		return <div ref={ref}>{children}</div>;
	};

	return (
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
				{filteredSteps
					.filter(step => activeStep === step.step || visibleSteps.has(step.step))
					.map((step) => (
						<StepWrapper key={step.step} stepNumber={step.step}>
							<div id={`step-${step.step}`} className="relative flex items-start group">
								{/* Enhanced Timeline Dot */}
								<div className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full border-4 border-background flex items-center justify-center text-2xl transition-all duration-300 ${
									activeStep === step.step
										? 'bg-primary shadow-xl shadow-primary/40 scale-125 ring-2 ring-primary/30' 
										: visibleSteps.has(step.step)
										? 'bg-primary shadow-lg shadow-primary/25 scale-110'
										: 'bg-card shadow-md hover:shadow-lg hover:scale-105'
								}`}>
									<motion.span
										animate={{ 
											scale: activeStep === step.step ? 1.2 : visibleSteps.has(step.step) ? 1.1 : 1,
											rotate: activeStep === step.step ? 360 : visibleSteps.has(step.step) ? 180 : 0 
										}}
										transition={{ duration: 0.4, ease: "easeOut" }}
									>
										{step.icon}
									</motion.span>
								</div>

								<MLStepContent
									step={step}
									isActive={activeStep === step.step}
									onToggle={onToggleStep}
									getPriorityColor={getPriorityColor}
									getStatusColor={getStatusColor}
									getToolTypeColor={getToolTypeColor}
								/>
							</div>
						</StepWrapper>
					))}
			</div>
		</div>
	);
}
