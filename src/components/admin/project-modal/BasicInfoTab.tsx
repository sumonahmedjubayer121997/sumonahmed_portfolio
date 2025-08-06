
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BasicInfoTabProps {
  formData: any;
  onChange: (field: string, value: any) => void;
}

export default function BasicInfoTab({ formData, onChange }: BasicInfoTabProps) {
  return (
    <div className="space-y-6 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium">
            Title <span className="text-red-500">*</span>
          </Label>
          <Input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={(e) => onChange('title', e.target.value)}
            placeholder="Enter project title"
            className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="version" className="text-sm font-medium">
            Version <span className="text-red-500">*</span>
          </Label>
          <Input
            type="text"
            id="version"
            name="version"
            value={formData.version}
            onChange={(e) => onChange('version', e.target.value)}
            placeholder="e.g., v1.0.0"
            className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status" className="text-sm font-medium">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => onChange('status', value)}
          >
            <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20">
              <SelectValue placeholder="Select project status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="type" className="text-sm font-medium">Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => onChange('type', value)}
          >
            <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20">
              <SelectValue placeholder="Select project type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="web">Web Application</SelectItem>
              <SelectItem value="mobile">Mobile Application</SelectItem>
              <SelectItem value="desktop">Desktop Application</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="duration" className="text-sm font-medium">
            Duration <span className="text-red-500">*</span>
          </Label>
          <Input
            type="text"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={(e) => onChange('duration', e.target.value)}
            placeholder="e.g., 3 months"
            className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="order" className="text-sm font-medium">Display Order</Label>
          <Input
            type="number"
            id="order"
            name="order"
            value={formData.order}
            onChange={(e) => onChange('order', parseInt(e.target.value) || 0)}
            placeholder="0"
            className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            min="0"
          />
          <p className="text-xs text-muted-foreground">
            Lower numbers appear first in the project list
          </p>
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
        <p className="font-medium mb-1">Auto-save Information:</p>
        <p>• Changes to existing projects are automatically saved after 2 seconds</p>
        <p>• New projects need to be saved manually using the "Create Project" button</p>
        <p>• Required fields are marked with a red asterisk (*)</p>
      </div>
    </div>
  );
}
