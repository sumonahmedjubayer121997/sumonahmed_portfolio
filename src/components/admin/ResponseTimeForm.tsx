
import React from "react";
import { Input } from "@/components/ui/input";
import RichContentEditor from "@/components/RichContentEditor";

interface ResponseTimeItem {
  id: string;
  platform: string;
  timeframe: string;
  description?: string;
  sortOrder: number;
  isVisible: boolean;
  created_at: string;
  updated_at: string;
}

interface ResponseTimeFormData {
  platform: string;
  timeframe: string;
  description: string;
  sortOrder: number;
  isVisible: boolean;
}

interface ResponseTimeFormProps {
  formData: ResponseTimeFormData;
  setFormData: React.Dispatch<React.SetStateAction<ResponseTimeFormData>>;
  responseTimes: ResponseTimeItem[];
}

const ResponseTimeForm: React.FC<ResponseTimeFormProps> = ({ formData, setFormData, responseTimes }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Platform *</label>
          <Input
            value={formData.platform}
            onChange={(e) => setFormData(prev => ({ ...prev, platform: e.target.value }))}
            placeholder="e.g., X (Twitter), Email, LinkedIn"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Sort Order</label>
          <Input
            type="number"
            value={formData.sortOrder}
            onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
            min="0"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Timeframe *</label>
        <Input
          value={formData.timeframe}
          onChange={(e) => setFormData(prev => ({ ...prev, timeframe: e.target.value }))}
          placeholder="e.g., Usually within 24 hours, Within 48 hours on weekdays"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <RichContentEditor
          initialContent={formData.description}
          onSave={(content) => setFormData(prev => ({ ...prev, description: content }))}
          placeholder="Additional details about response times or conditions"
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="responseTimeVisible"
          checked={formData.isVisible}
          onChange={(e) => setFormData(prev => ({ ...prev, isVisible: e.target.checked }))}
        />
        <label htmlFor="responseTimeVisible" className="text-sm font-medium">
          Visible on website
        </label>
      </div>
    </div>
  );
};

export default ResponseTimeForm;
