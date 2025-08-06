
import { useState, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import FlowchartNode from './FlowchartNode';
import StepDetailModal from './StepDetailModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const dummySteps = [
  {
    id: "1",
    title: "Project Planning & Architecture",
    description: "Analyzed requirements, designed system architecture, and created wireframes. Selected appropriate tech stack including React, TypeScript, and Firebase for optimal performance and scalability."
  },
  {
    id: "2", 
    title: "Frontend Development & UI/UX",
    description: "Built responsive user interface with React components, implemented routing with React Router, and created a cohesive design system using Tailwind CSS and shadcn/ui components."
  },
  {
    id: "3",
    title: "Backend Integration & Database", 
    description: "Integrated Firebase services including Firestore for data storage, Authentication for user management, and Storage for file handling. Implemented real-time data synchronization."
  },
  {
    id: "4",
    title: "Testing & Deployment",
    description: "Conducted comprehensive testing across different devices and browsers. Set up CI/CD pipeline and deployed the application with proper environment configuration and performance optimization."
  }
];

interface ProjectFlowchartProps {
  steps?: Array<{ id: string; title: string; description: string }>;
  className?: string;
}

export default function ProjectFlowchart({ steps = dummySteps, className = "" }: ProjectFlowchartProps) {
  const [selectedStep, setSelectedStep] = useState<{ title: string; description: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNodeClick = useCallback((stepData: { title: string; description: string }) => {
    setSelectedStep(stepData);
    setIsModalOpen(true);
  }, []);

  const nodeTypes = useMemo(() => ({
    flowchartNode: FlowchartNode,
  }), []);

  const initialNodes: Node[] = useMemo(() => 
    steps.map((step, index) => ({
      id: step.id,
      type: 'flowchartNode',
      position: { x: 0, y: index * 120 },
      data: {
        title: step.title,
        description: step.description,
        onClick: handleNodeClick,
      },
    })), [steps, handleNodeClick]
  );

  const initialEdges: Edge[] = useMemo(() => 
    steps.slice(0, -1).map((_, index) => ({
      id: `e${index + 1}-${index + 2}`,
      source: `${index + 1}`,
      target: `${index + 2}`,
      type: 'smoothstep',
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: 'hsl(var(--primary))',
      },
      style: {
        stroke: 'hsl(var(--primary))',
        strokeWidth: 2,
      },
    })), [steps]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">🛠️</span>
          Development Process
        </CardTitle>
        <p className="text-muted-foreground">
          Click on any step to learn more about the development process
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[500px] w-full border border-border rounded-lg overflow-hidden">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            attributionPosition="bottom-left"
            className="bg-background"
          >
            <Controls 
              className="!bg-background !border-border"
              showZoom={true}
              showFitView={true}
              showInteractive={false}
            />
            <Background 
              color="hsl(var(--muted-foreground))" 
              variant="dots" 
              gap={20} 
              size={1}
              className="opacity-30"
            />
          </ReactFlow>
        </div>

        <StepDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={selectedStep?.title || ''}
          description={selectedStep?.description || ''}
        />
      </CardContent>
    </Card>
  );
}
