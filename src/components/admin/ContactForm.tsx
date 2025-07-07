
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ContactItem {
  id: string;
  type: 'email' | 'phone' | 'twitter' | 'linkedin' | 'github' | 'other';
  displayText: string;
  url?: string;
  notes?: string;
  sortOrder: number;
  isVisible: boolean;
  icon?: string;
  created_at: string;
  updated_at: string;
}

interface ContactFormData {
  type: 'email' | 'phone' | 'twitter' | 'linkedin' | 'github' | 'other';
  displayText: string;
  url: string;
  notes: string;
  sortOrder: number;
  isVisible: boolean;
}

interface ContactFormProps {
  formData: ContactFormData;
  setFormData: React.Dispatch<React.SetStateAction<ContactFormData>>;
  contacts: ContactItem[];
}

const ContactForm: React.FC<ContactFormProps> = ({ formData, setFormData, contacts }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Contact Type</label>
          <Select value={formData.type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="phone">Phone</SelectItem>
              <SelectItem value="twitter">Twitter</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
              <SelectItem value="github">GitHub</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
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
        <label className="block text-sm font-medium mb-2">Display Text *</label>
        <Input
          value={formData.displayText}
          onChange={(e) => setFormData(prev => ({ ...prev, displayText: e.target.value }))}
          placeholder="e.g., Email, Phone, LinkedIn Profile"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          {formData.type === 'email' ? 'Email Address' : 
           formData.type === 'phone' ? 'Phone Number' : 'URL'}
        </label>
        <Input
          value={formData.url}
          onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
          placeholder={
            formData.type === 'email' ? 'user@email.com' :
            formData.type === 'phone' ? '+1234567890' :
            'https://example.com'
          }
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Notes</label>
        <Textarea
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="e.g., Fastest response - usually within 24 hours"
          rows={3}
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isVisible"
          checked={formData.isVisible}
          onChange={(e) => setFormData(prev => ({ ...prev, isVisible: e.target.checked }))}
        />
        <label htmlFor="isVisible" className="text-sm font-medium">
          Visible on website
        </label>
      </div>
    </div>
  );
};

export default ContactForm;
