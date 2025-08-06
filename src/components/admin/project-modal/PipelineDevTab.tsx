
import { Label } from '@/components/ui/label';
import DevelopmentPipelineEditor from '../DevelopmentPipelineEditor';

interface PipelineDevTabProps {
  formData: any;
  onChange: (field: string, value: any) => void;
}

export default function PipelineDevTab({ formData, onChange }: PipelineDevTabProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Development Pipeline</h3>
        <p className="text-sm text-muted-foreground">
          Add custom development steps for this project. Leave empty to use the default ML pipeline.
        </p>
      </div>
      <DevelopmentPipelineEditor
        steps={formData.developmentPipeline}
        onChange={(steps) => onChange('developmentPipeline', steps)}
      />
    </div>
  );
}
