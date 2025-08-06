
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
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

interface MLStepContentProps {
	step: Step;
	isActive: boolean;
	onToggle: (stepNumber: number) => void;
	getPriorityColor: (priority: string) => string;
	getStatusColor: (status: StepStatus) => string;
	getToolTypeColor: (type: string) => string;
}

export default function MLStepContent({
	step,
	isActive,
	onToggle,
	getPriorityColor,
	getStatusColor,
	getToolTypeColor
}: MLStepContentProps) {
	const [showCode, setShowCode] = useState(false);

	return (
		<div className="ml-6 flex-1">
			<button
				onClick={() => onToggle(step.step)}
				className={`group relative w-full p-5 bg-background/80 rounded-lg border border-border transition-shadow duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/50 ${
					isActive
						? 'shadow-lg ring-1 ring-primary'
						: 'hover:shadow-md'
				}`}
				aria-expanded={isActive}
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
							isActive ? 'text-primary' : 'text-foreground'
						}`}>
							{step.title}
						</h3>
					</div>
					<motion.div
						animate={{ rotate: isActive ? 180 : 0 }}
						transition={{ duration: 0.3, ease: "easeOut" }}
						className="ml-4"
					>
						<ChevronDown className={`w-6 h-6 transition-colors ${
							isActive ? 'text-primary' : 'text-muted-foreground'
						}`} />
					</motion.div>
				</div>
			</button>

			{/* Expanded Content */}
			<AnimatePresence initial={false}>
				{isActive && (
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
										onClick={() => setShowCode(!showCode)}
										className="text-xs text-primary hover:text-primary/80 transition-colors"
										aria-expanded={showCode}
									>
										{showCode ? 'Hide Code' : 'Show Code'}
									</button>
								</div>
								
								<AnimatePresence>
									{showCode && (
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
	);
}
