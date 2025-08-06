
import EnhancedRichContentEditor from '@/components/editor/EnhancedRichContentEditor';
import { Label } from '@/components/ui/label';

interface ContentTabProps {
  formData: any;
  onChange: (field: string, value: any) => void;
}

export default function ContentTab({ formData, onChange }: ContentTabProps) {
  const handleContentChange = (contentType: string, value: string) => {
    onChange('content', {
      ...formData.content,
      [contentType]: value
    });
  };

  const contentSections = [
    { key: 'about', label: 'About', placeholder: 'Write about your project...' },
    { key: 'features', label: 'Features', placeholder: 'Describe the key features...' },
    { key: 'challenges', label: 'Challenges', placeholder: 'What challenges did you face?...' },
    { key: 'achievements', label: 'Achievements', placeholder: 'What did you accomplish?...' },
    { key: 'accessibility', label: 'Accessibility', placeholder: 'Describe accessibility features...' }
  ];

  return (
    <div className="space-y-8">
      {contentSections.map((section) => (
        <div key={section.key} className="space-y-3">
          <Label className="text-base font-semibold">{section.label}</Label>
          <div className="border rounded-lg overflow-hidden min-h-[300px]">
            <EnhancedRichContentEditor
              content={formData.content[section.key] || ''}
              onChange={(value) => handleContentChange(section.key, value)}
              placeholder={section.placeholder}
              hideManualSave={true}
              autoSave={false}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
