
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Github, Linkedin, Phone, Twitter } from "lucide-react";

interface ContactItem {
  id: string;
  type: 'email' | 'phone' | 'twitter' | 'linkedin' | 'github' | 'other';
  displayText: string;
  url?: string;
  notes?: string;
  sortOrder: number;
  isVisible: boolean;
}

interface ResponseTimeItem {
  id: string;
  platform: string;
  timeframe: string;
  description?: string;
  sortOrder: number;
  isVisible: boolean;
}

interface ContactPreviewProps {
  contacts: ContactItem[];
  responseTimes: ResponseTimeItem[];
}

const ContactPreview: React.FC<ContactPreviewProps> = ({ contacts, responseTimes }) => {
  const getContactIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="w-5 h-5" />;
      case 'phone': return <Phone className="w-5 h-5" />;
      case 'twitter': return <Twitter className="w-5 h-5" />;
      case 'linkedin': return <Linkedin className="w-5 h-5" />;
      case 'github': return <Github className="w-5 h-5" />;
      default: return <Mail className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Contact Section Preview</CardTitle>
          <p className="text-sm text-gray-600">This is how your contact section will appear on the website</p>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Let's Connect</h2>
            <div className="space-y-4 mb-8">
              {contacts.map((contact) => (
                <Card key={contact.id} className="hover:shadow-md transition-shadow duration-200">
                  <CardContent className="flex items-center p-4">
                    <div className="text-gray-500 mr-3">
                      {getContactIcon(contact.type)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{contact.displayText}</p>
                      {contact.url && (
                        <p className="text-gray-600 text-sm">{contact.url}</p>
                      )}
                      {contact.notes && (
                        <p className="text-sm text-gray-500 mt-1">{contact.notes}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {responseTimes.length > 0 && (
              <div className="bg-white rounded-lg p-6 border">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Response Times
                </h3>
                <div className="space-y-2 text-sm">
                  {responseTimes.map((rt) => (
                    <p key={rt.id} className="text-gray-700">
                      <span className="font-medium">{rt.platform}:</span> {rt.timeframe}
                    </p>
                  ))}
                  {responseTimes.some(rt => rt.description) && (
                    <div className="mt-4 pt-2 border-t border-gray-200">
                      {responseTimes
                        .filter(rt => rt.description)
                        .map((rt) => (
                          <p key={`desc-${rt.id}`} className="text-gray-600 text-xs">
                            {rt.description}
                          </p>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactPreview;
