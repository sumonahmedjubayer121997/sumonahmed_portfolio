
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BasicInfoTabProps {
  formData: any;
  onChange: (field: string, value: any) => void;
}

export default function BasicInfoTab({ formData, onChange }: BasicInfoTabProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={(e) => onChange('title', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="version">Version</Label>
          <Input
            type="text"
            id="version"
            name="version"
            value={formData.version}
            onChange={(e) => onChange('version', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => onChange('status', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="type">Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => onChange('type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="web">Web</SelectItem>
              <SelectItem value="mobile">Mobile</SelectItem>
              <SelectItem value="desktop">Desktop</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="duration">Duration</Label>
          <Input
            type="text"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={(e) => onChange('duration', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="order">Order</Label>
          <Input
            type="number"
            id="order"
            name="order"
            value={formData.order}
            onChange={(e) => onChange('order', parseInt(e.target.value) || 0)}
            required
          />
        </div>
      </div>
    </div>
  );
}
