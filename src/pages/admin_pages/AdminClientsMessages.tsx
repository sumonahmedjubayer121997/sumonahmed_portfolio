
import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getDynamicContent } from '@/integrations/firebase/firestore';
import { MessageSquare, Mail, Calendar, Globe, User } from "lucide-react";
import { format } from "date-fns";

interface ContactMessage {
  id: string;
  sender_name: string;
  sender_email: string;
  message: string;
  platform: string;
  status: string;
  created_at: any;
  updated_at: any;
}

const AdminClientsMessages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data, error } = await getDynamicContent('contact_messages');
      
      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      if (data) {
        // Sort by created_at in descending order (newest first)
        const sortedMessages = data.sort((a: ContactMessage, b: ContactMessage) => {
          const dateA = a.created_at?.toDate ? a.created_at.toDate() : new Date(a.created_at);
          const dateB = b.created_at?.toDate ? b.created_at.toDate() : new Date(b.created_at);
          return dateB.getTime() - dateA.getTime();
        });
        
        setMessages(sortedMessages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      new: "bg-blue-100 text-blue-800",
      read: "bg-gray-100 text-gray-800", 
      replied: "bg-green-100 text-green-800",
      closed: "bg-red-100 text-red-800"
    };
    
    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}>
        {status?.charAt(0).toUpperCase() + status?.slice(1) || 'New'}
      </Badge>
    );
  };

  const formatDate = (timestamp: any) => {
    try {
      const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
      return format(date, 'MMM dd, yyyy HH:mm');
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const truncateMessage = (message: string, maxLength: number = 100) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };

  return (
    <AdminLayout>
      <div>
        <div className="flex items-center gap-2 mb-6">
          <MessageSquare className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Client Messages</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{messages.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Messages</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {messages.filter(msg => msg.status === 'new').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Replied</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {messages.filter(msg => msg.status === 'replied').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {messages.filter(msg => {
                  const msgDate = msg.created_at?.toDate ? msg.created_at.toDate() : new Date(msg.created_at);
                  const now = new Date();
                  return msgDate.getMonth() === now.getMonth() && msgDate.getFullYear() === now.getFullYear();
                }).length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Messages</CardTitle>
            <CardDescription>
              All client messages received through contact forms
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-gray-500">Loading messages...</div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-gray-500">No messages found</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Platform</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {messages.map((message) => (
                      <TableRow key={message.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            {message.sender_name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            {message.sender_email || 'Not provided'}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <div className="text-sm text-gray-600" title={message.message}>
                            {truncateMessage(message.message)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-gray-400" />
                            <Badge variant="outline">
                              {message.platform?.charAt(0).toUpperCase() + message.platform?.slice(1) || 'Web'}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(message.status)}
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {formatDate(message.created_at)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminClientsMessages;
