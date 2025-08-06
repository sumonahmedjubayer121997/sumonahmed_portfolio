
import { Label } from '@/components/ui/label';
import ScreenshotUploader from '../ScreenshotUploader';
import TechnologySelector from '../TechnologySelector';

interface MediaTechTabProps {
  formData: any;
  onChange: (field: string, value: any) => void;
}

export default function MediaTechTab({ formData, onChange }: MediaTechTabProps) {
  return (
    <div className="space-y-6">
      {/* Screenshots Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Screenshots</h3>
        <ScreenshotUploader
          screenshots={formData.screenshots}
          onScreenshotsChange={(newScreenshots) => onChange('screenshots', newScreenshots)}
        />
      </div>

      {/* Technologies Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Technologies</h3>
        <TechnologySelector
          selectedTechnologies={formData.technologies}
          onTechnologiesChange={(newTechnologies) => onChange('technologies', newTechnologies)}
        />
      </div>
    </div>
  );
}
