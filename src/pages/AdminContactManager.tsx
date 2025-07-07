
import React, { useState, useEffect } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Mail, 
  Github, 
  Linkedin, 
  Phone, 
  Search, 
  Filter,
  Archive,
  Trash2,
  Check,
  Clock,
  AlertTriangle,
  MessageSquare,
  Settings,
  BarChart3,
  Download,
  Reply,
  Eye
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ContactMessage {
  id: string;
  sender_name: string;
  sender_email?: string;
  sender_username?: string;
  platform: 'email' | 'twitter' | 'linkedin' | 'github' | 'phone';
  subject?: string;
  message: string;
  status: 'new' | 'replied' | 'pending' | 'resolved' | 'spam' | 'archived';
  admin_notes?: string;
  created_at: string;
  updated_at: string;
  replied_at?: string;
}

interface ContactSettings {
  contact_info: {
    email: string;
    phone: string;
    twitter_url: string;
    linkedin_url: string;
    github_url: string;
  };
  response_times: {
    twitter: string;
    email: string;
    general: string;
  };
  welcome_message: {
    headline: string;
    description: string;
  };
}

const AdminContactManager = () => {
  const { isAuthenticated } = useAdminAuth();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [contactSettings, setContactSettings] = useState<ContactSettings | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Platform icons
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'twitter': return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
      case 'linkedin': return <Linkedin className="w-4 h-4" />;
      case 'github': return <Github className="w-4 h-4" />;
      case 'phone': return <Phone className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  // Status colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'replied': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-gray-100 text-gray-800';
      case 'spam': return 'bg-red-100 text-red-800';
      case 'archived': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Fetch messages
  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to fetch messages');
    }
  };

  // Fetch contact settings
  const fetchContactSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_settings')
        .select('*');

      if (error) throw error;
      
      const settings: any = {};
      data?.forEach(setting => {
        settings[setting.setting_key] = setting.setting_value;
      });
      
      setContactSettings(settings);
    } catch (error) {
      console.error('Error fetching contact settings:', error);
      toast.error('Failed to fetch contact settings');
    }
  };

  // Update message status
  const updateMessageStatus = async (messageId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ 
          status,
          updated_at: new Date().toISOString(),
          replied_at: status === 'replied' ? new Date().toISOString() : null
        })
        .eq('id', messageId);

      if (error) throw error;
      
      await fetchMessages();
      toast.success(`Message marked as ${status}`);
    } catch (error) {
      console.error('Error updating message:', error);
      toast.error('Failed to update message');
    }
  };

  // Update admin notes
  const updateAdminNotes = async (messageId: string, notes: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ 
          admin_notes: notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', messageId);

      if (error) throw error;
      
      await fetchMessages();
      if (selectedMessage?.id === messageId) {
        setSelectedMessage({ ...selectedMessage, admin_notes: notes });
      }
      toast.success('Notes updated');
    } catch (error) {
      console.error('Error updating notes:', error);
      toast.error('Failed to update notes');
    }
  };

  // Bulk actions
  const handleBulkAction = async (action: string) => {
    if (selectedMessages.length === 0) {
      toast.error('Please select messages first');
      return;
    }

    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ 
          status: action,
          updated_at: new Date().toISOString()
        })
        .in('id', selectedMessages);

      if (error) throw error;
      
      await fetchMessages();
      setSelectedMessages([]);
      toast.success(`${selectedMessages.length} messages updated`);
    } catch (error) {
      console.error('Error with bulk action:', error);
      toast.error('Failed to perform bulk action');
    }
  };

  // Delete message
  const deleteMessage = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;
      
      await fetchMessages();
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null);
      }
      toast.success('Message deleted');
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    }
  };

  // Filter messages
  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.sender_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (message.sender_email && message.sender_email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || message.status === statusFilter;
    const matchesPlatform = platformFilter === 'all' || message.platform === platformFilter;
    
    return matchesSearch && matchesStatus && matchesPlatform;
  });

  // Calculate analytics
  const analytics = {
    totalMessages: messages.length,
    newMessages: messages.filter(m => m.status === 'new').length,
    avgResponseTime: '1.2 hours', // This would be calculated from actual data
    messagesByPlatform: {
      email: messages.filter(m => m.platform === 'email').length,
      twitter: messages.filter(m => m.platform === 'twitter').length,
      linkedin: messages.filter(m => m.platform === 'linkedin').length,
      github: messages.filter(m => m.platform === 'github').length,
      phone: messages.filter(m => m.platform === 'phone').length,
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      Promise.all([fetchMessages(), fetchContactSettings()]).finally(() => setLoading(false));
    }
  }, [isAuthenticated]);

  if (!isAuthenticated || loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Contact Management</h1>
          <Button className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Messages
          </Button>
        </div>

        <Tabs defaultValue="messages" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="settings">Contact Settings</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="messages" className="space-y-6">
            {/* Filters and Search */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search messages..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="replied">Replied</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={platformFilter} onValueChange={setPlatformFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Platforms</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="twitter">Twitter</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="github">GitHub</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Bulk Actions */}
                {selectedMessages.length > 0 && (
                  <div className="flex gap-2 mt-4 pt-4 border-t">
                    <span className="text-sm text-gray-600 flex items-center">
                      {selectedMessages.length} selected
                    </span>
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction('resolved')}>
                      <Check className="w-4 h-4 mr-1" />
                      Mark Resolved
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction('archived')}>
                      <Archive className="w-4 h-4 mr-1" />
                      Archive
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Messages List */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Messages ({filteredMessages.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">
                            <input
                              type="checkbox"
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedMessages(filteredMessages.map(m => m.id));
                                } else {
                                  setSelectedMessages([]);
                                }
                              }}
                            />
                          </TableHead>
                          <TableHead>Sender</TableHead>
                          <TableHead>Platform</TableHead>
                          <TableHead>Subject/Preview</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredMessages.map((message) => (
                          <TableRow
                            key={message.id}
                            className={`cursor-pointer hover:bg-gray-50 ${
                              selectedMessage?.id === message.id ? 'bg-blue-50' : ''
                            }`}
                            onClick={() => setSelectedMessage(message)}
                          >
                            <TableCell>
                              <input
                                type="checkbox"
                                checked={selectedMessages.includes(message.id)}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  if (e.target.checked) {
                                    setSelectedMessages([...selectedMessages, message.id]);
                                  } else {
                                    setSelectedMessages(selectedMessages.filter(id => id !== message.id));
                                  }
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{message.sender_name}</div>
                                <div className="text-sm text-gray-500">
                                  {message.sender_email || message.sender_username}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {getPlatformIcon(message.platform)}
                                <span className="capitalize">{message.platform}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="max-w-48 truncate">
                                {message.subject || message.message}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {new Date(message.created_at).toLocaleDateString()}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(message.status)}>
                                {message.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button size="sm" variant="ghost" onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedMessage(message);
                                }}>
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="ghost" onClick={(e) => {
                                  e.stopPropagation();
                                  deleteMessage(message.id);
                                }}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>

              {/* Message Detail Panel */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Message Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedMessage ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          {getPlatformIcon(selectedMessage.platform)}
                          <div>
                            <h3 className="font-medium">{selectedMessage.sender_name}</h3>
                            <p className="text-sm text-gray-500">
                              {selectedMessage.sender_email || selectedMessage.sender_username}
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">
                            {new Date(selectedMessage.created_at).toLocaleString()}
                          </p>
                          <Badge className={getStatusColor(selectedMessage.status)}>
                            {selectedMessage.status}
                          </Badge>
                        </div>

                        {selectedMessage.subject && (
                          <div>
                            <h4 className="font-medium mb-1">Subject:</h4>
                            <p className="text-sm">{selectedMessage.subject}</p>
                          </div>
                        )}

                        <div>
                          <h4 className="font-medium mb-1">Message:</h4>
                          <p className="text-sm whitespace-pre-wrap bg-gray-50 p-3 rounded">
                            {selectedMessage.message}
                          </p>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Admin Notes:</h4>
                          <Textarea
                            placeholder="Add internal notes..."
                            value={selectedMessage.admin_notes || ''}
                            onChange={(e) => {
                              setSelectedMessage({
                                ...selectedMessage,
                                admin_notes: e.target.value
                              });
                            }}
                            onBlur={() => {
                              if (selectedMessage.admin_notes !== undefined) {
                                updateAdminNotes(selectedMessage.id, selectedMessage.admin_notes);
                              }
                            }}
                          />
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => updateMessageStatus(selectedMessage.id, 'replied')}>
                            <Reply className="w-4 h-4 mr-1" />
                            Mark Replied
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => updateMessageStatus(selectedMessage.id, 'resolved')}>
                            <Check className="w-4 h-4 mr-1" />
                            Resolve
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">
                        Select a message to view details
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <ContactSettingsEditor 
              settings={contactSettings} 
              onUpdate={fetchContactSettings}
            />
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Messages</p>
                      <p className="text-2xl font-bold">{analytics.totalMessages}</p>
                    </div>
                    <MessageSquare className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">New Messages</p>
                      <p className="text-2xl font-bold text-red-600">{analytics.newMessages}</p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                      <p className="text-2xl font-bold text-green-600">{analytics.avgResponseTime}</p>
                    </div>
                    <Clock className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">This Week</p>
                      <p className="text-2xl font-bold">+12%</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Messages by Platform</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(analytics.messagesByPlatform).map(([platform, count]) => (
                    <div key={platform} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getPlatformIcon(platform)}
                        <span className="capitalize">{platform}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${(count / Math.max(...Object.values(analytics.messagesByPlatform))) * 100}%`
                            }}
                          />
                        </div>
                        <span className="font-medium w-8 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

// Contact Settings Editor Component
const ContactSettingsEditor = ({ settings, onUpdate }: { settings: ContactSettings | null, onUpdate: () => void }) => {
  const [editingSettings, setEditingSettings] = useState<ContactSettings | null>(null);

  useEffect(() => {
    if (settings) {
      setEditingSettings(settings);
    }
  }, [settings]);

  const handleSave = async () => {
    if (!editingSettings) return;

    try {
      // Update each setting
      for (const [key, value] of Object.entries(editingSettings)) {
        const { error } = await supabase
          .from('contact_settings')
          .update({ 
            setting_value: value,
            updated_at: new Date().toISOString()
          })
          .eq('setting_key', key);

        if (error) throw error;
      }

      toast.success('Contact settings updated successfully');
      onUpdate();
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
    }
  };

  if (!editingSettings) {
    return <div>Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Welcome Message</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Headline</label>
            <Input
              value={editingSettings.welcome_message.headline}
              onChange={(e) => setEditingSettings({
                ...editingSettings,
                welcome_message: {
                  ...editingSettings.welcome_message,
                  headline: e.target.value
                }
              })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea
              value={editingSettings.welcome_message.description}
              onChange={(e) => setEditingSettings({
                ...editingSettings,
                welcome_message: {
                  ...editingSettings.welcome_message,
                  description: e.target.value
                }
              })}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input
              value={editingSettings.contact_info.email}
              onChange={(e) => setEditingSettings({
                ...editingSettings,
                contact_info: {
                  ...editingSettings.contact_info,
                  email: e.target.value
                }
              })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <Input
              value={editingSettings.contact_info.phone}
              onChange={(e) => setEditingSettings({
                ...editingSettings,
                contact_info: {
                  ...editingSettings.contact_info,
                  phone: e.target.value
                }
              })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Twitter URL</label>
            <Input
              value={editingSettings.contact_info.twitter_url}
              onChange={(e) => setEditingSettings({
                ...editingSettings,
                contact_info: {
                  ...editingSettings.contact_info,
                  twitter_url: e.target.value
                }
              })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">LinkedIn URL</label>
            <Input
              value={editingSettings.contact_info.linkedin_url}
              onChange={(e) => setEditingSettings({
                ...editingSettings,
                contact_info: {
                  ...editingSettings.contact_info,
                  linkedin_url: e.target.value
                }
              })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">GitHub URL</label>
            <Input
              value={editingSettings.contact_info.github_url}
              onChange={(e) => setEditingSettings({
                ...editingSettings,
                contact_info: {
                  ...editingSettings.contact_info,
                  github_url: e.target.value
                }
              })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Response Times</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Twitter Response Time</label>
            <Input
              value={editingSettings.response_times.twitter}
              onChange={(e) => setEditingSettings({
                ...editingSettings,
                response_times: {
                  ...editingSettings.response_times,
                  twitter: e.target.value
                }
              })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email Response Time</label>
            <Input
              value={editingSettings.response_times.email}
              onChange={(e) => setEditingSettings({
                ...editingSettings,
                response_times: {
                  ...editingSettings.response_times,
                  email: e.target.value
                }
              })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">General Response Time</label>
            <Input
              value={editingSettings.response_times.general}
              onChange={(e) => setEditingSettings({
                ...editingSettings,
                response_times: {
                  ...editingSettings.response_times,
                  general: e.target.value
                }
              })}
            />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="w-full">
        <Settings className="w-4 h-4 mr-2" />
        Save Contact Settings
      </Button>
    </div>
  );
};

export default AdminContactManager;
