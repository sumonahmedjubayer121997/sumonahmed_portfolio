
import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card } from '@/components/ui/card';

interface FlowchartNodeProps {
  data: {
    title: string;
    description: string;
    onClick: (data: { title: string; description: string }) => void;
  };
  selected?: boolean;
}

const FlowchartNode = memo(({ data, selected }: FlowchartNodeProps) => {
  return (
    <Card 
      className={`
        px-4 py-3 min-w-[180px] max-w-[200px] cursor-pointer 
        transition-all duration-200 hover:shadow-lg
        ${selected ? 'ring-2 ring-primary shadow-lg' : ''}
        bg-background border-border hover:border-primary/50
      `}
      onClick={() => data.onClick({ title: data.title, description: data.description })}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-primary/60 !border-primary"
      />
      
      <div className="text-center">
        <h4 className="font-medium text-sm text-foreground leading-tight">
          {data.title}
        </h4>
      </div>
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-primary/60 !border-primary"
      />
    </Card>
  );
});

FlowchartNode.displayName = 'FlowchartNode';

export default FlowchartNode;
