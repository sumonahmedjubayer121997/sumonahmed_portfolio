
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LinksTabProps {
  formData: any;
  onChange: (field: string, value: any) => void;
}

export default function LinksTab({ formData, onChange }: LinksTabProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Project Links</h3>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="demoLink">Demo Link</Label>
          <Input
            type="url"
            id="demoLink"
            name="demoLink"
            value={formData.demoLink}
            onChange={(e) => onChange('demoLink', e.target.value)}
            placeholder="https://example.com/demo"
          />
        </div>
        <div>
          <Label htmlFor="codeLink">Code Link</Label>
          <Input
            type="url"
            id="codeLink"
            name="codeLink"
            value={formData.codeLink}
            onChange={(e) => onChange('codeLink', e.target.value)}
            placeholder="https://github.com/username/repo"
          />
        </div>
        <div>
          <Label htmlFor="downloadLink">Download Link</Label>
          <Input
            type="url"
            id="downloadLink"
            name="downloadLink"
            value={formData.downloadLink}
            onChange={(e) => onChange('downloadLink', e.target.value)}
            placeholder="https://example.com/download"
          />
        </div>
      </div>
    </div>
  );
}
