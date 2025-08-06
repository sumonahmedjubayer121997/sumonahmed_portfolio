
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Clock, Zap, CheckCircle, Circle, AlertCircle } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
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

interface TimelineStepsProps {
	filteredSteps: Step[];
	activeStep: number | null;
	visibleSteps: Set<number>;
	showCode: number | null;
	onToggleStep: (stepNumber: number) => void;
	onSetShowCode: (stepNumber: number | null) => void;
	onSetVisibleSteps: (setFunction: (prev: Set<number>) => Set<number>) => void;
	getStatusIcon: (status: StepStatus) => JSX.Element;
	getStatusColor: (status: StepStatus) => string;
	getToolTypeColor: (type: string) => string;
	getPriorityColor: (priority: string) => string;
}

export default function TimelineSteps({
	filteredSteps,
	activeStep,
	visibleSteps,
	showCode,
	onToggleStep,
	onSetShowCode,
	onSetVisibleSteps,
	getStatusIcon,
	getStatusColor,
	getToolTypeColor,
	getPriorityColor
}: TimelineStepsProps) {
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

								{/* Step Content */}
								<div className="ml-6 flex-1">
									<button
										onClick={() => onToggleStep(step.step)}
										className={`group relative w-full p-5 bg-background/80 rounded-lg border border-border transition-shadow duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/50 ${
											activeStep === step.step
												? 'shadow-lg ring-1 ring-primary'
												: 'hover:shadow-md'
										}`}
										aria-expanded={activeStep === step.step}
										aria-controls={`step-content-${step.step}`}
									>
										<div className="flex justify-between items-center">
											<div className="flex-1">
												<div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-2 opacity-70 group-hover:opacity-100 transition-opacity">
													<Badge variant="outline" className="text-xs">Step {step.step}</Badge>
													<Badge variant="secondary" className="text-xs uppercase">{step.category}</Badge>
													<Badge className={`text-xs ${getPriorityColor(step.priority)}`}>{step.priority}</Badge>
													<Badge variant="outline" className="text-xs flex items-center">{step.duration}</Badge>
													<Badge className={`text-xs flex items-center ${getStatusColor(step.status)}`}>{step.status.replace('-', ' ')}</Badge>
												</div>
												<h3 className={`text-lg font-semibold truncate transition-colors ${
													activeStep === step.step ? 'text-primary' : 'text-foreground'
												}`}>
													{step.title}
												</h3>
											</div>
											<motion.div
												animate={{ rotate: activeStep === step.step ? 180 : 0 }}
												transition={{ duration: 0.3, ease: "easeOut" }}
												className="ml-4"
											>
												<ChevronDown className={`w-6 h-6 transition-colors ${
													activeStep === step.step ? 'text-primary' : 'text-muted-foreground'
												}`} />
											</motion.div>
										</div>
									</button>

									{/* Expanded Content */}
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
													
													{/* Tools Section */}
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
																onClick={() => onSetShowCode(showCode === step.step ? null : step.step)}
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
	);
}
