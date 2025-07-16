
import React, { useState, useEffect } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Plus, Save, Eye, Clock } from "lucide-react";
import { getDynamicContent, saveAndUpdateDynamicContent, deleteDynamicContent } from "@/integrations/firebase/firestore";
import { toast } from "sonner";

// Import the new components
import ContactForm from "@/components/admin/ContactForm";
import ResponseTimeForm from "@/components/admin/ResponseTimeForm";
import ContactPreview from "@/components/admin/ContactPreview";
import ContactTable from "@/components/admin/ContactTable";
import ResponseTimeTable from "@/components/admin/ResponseTimeTable";

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

const AdminContactManager = () => {
  const { isAuthenticated } = useAdminAuth();
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [responseTimes, setResponseTimes] = useState<ResponseTimeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [responseTimesLoading, setResponseTimesLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddResponseTimeDialogOpen, setIsAddResponseTimeDialogOpen] = useState(false);
  const [isEditResponseTimeDialogOpen, setIsEditResponseTimeDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<ContactItem | null>(null);
  const [editingResponseTime, setEditingResponseTime] = useState<ResponseTimeItem | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [activeTab, setActiveTab] = useState("contacts");
  const [formData, setFormData] = useState<ContactFormData>({
    type: 'email',
    displayText: '',
    url: '',
    notes: '',
    sortOrder: 0,
    isVisible: true
  });
  const [responseTimeFormData, setResponseTimeFormData] = useState<ResponseTimeFormData>({
    platform: '',
    timeframe: '',
    description: '',
    sortOrder: 0,
    isVisible: true
  });

  // Fetch contacts from Firebase
  const fetchContacts = async () => {
    try {
      const { data, error } = await getDynamicContent('contact_items');
      if (error) {
        console.error('Error fetching contacts:', error);
        toast.error('Failed to fetch contacts');
        return;
      }
      
      const contactsArray = Array.isArray(data) ? data : [];
      const sortedContacts = contactsArray.sort((a, b) => a.sortOrder - b.sortOrder);
      setContacts(sortedContacts.map(contact => ({
        ...contact,
        created_at: contact.created_at || new Date().toISOString(),
        updated_at: contact.updated_at || new Date().toISOString(),
      })));
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  // Fetch response times from Firebase
  const fetchResponseTimes = async () => {
    try {
      setResponseTimesLoading(true);
      const { data, error } = await getDynamicContent('response_times');
      if (error) {
        console.error('Error fetching response times:', error);
        toast.error('Failed to fetch response times');
        return;
      }
      
      const responseTimesArray = Array.isArray(data) ? data : [];
      const sortedResponseTimes = responseTimesArray.sort((a, b) => a.sortOrder - b.sortOrder);
      setResponseTimes(sortedResponseTimes.map(rt => ({
        ...rt,
        created_at: rt.created_at || new Date().toISOString(),
        updated_at: rt.updated_at || new Date().toISOString(),
      })));
    } catch (error) {
      console.error('Error fetching response times:', error);
      toast.error('Failed to fetch response times');
    } finally {
      setResponseTimesLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      type: 'email',
      displayText: '',
      url: '',
      notes: '',
      sortOrder: contacts.length,
      isVisible: true
    });
  };

  // Reset response time form
  const resetResponseTimeForm = () => {
    setResponseTimeFormData({
      platform: '',
      timeframe: '',
      description: '',
      sortOrder: responseTimes.length,
      isVisible: true
    });
  };

  // Validate form
  const validateForm = () => {
    if (!formData.displayText.trim()) {
      toast.error('Display text is required');
      return false;
    }

    if (formData.type === 'email' && formData.url) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.url)) {
        toast.error('Please enter a valid email address');
        return false;
      }
    }

    if (formData.url && !formData.url.startsWith('http') && formData.type !== 'email' && formData.type !== 'phone') {
      toast.error('URL must start with http:// or https://');
      return false;
    }

    return true;
  };

  // Validate response time form
  const validateResponseTimeForm = () => {
    if (!responseTimeFormData.platform.trim()) {
      toast.error('Platform is required');
      return false;
    }
    if (!responseTimeFormData.timeframe.trim()) {
      toast.error('Timeframe is required');
      return false;
    }
    return true;
  };

  // Add new contact
  const handleAddContact = async () => {
    if (!validateForm()) return;

    try {
      const newContact = {
        ...formData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { id, error } = await saveAndUpdateDynamicContent('contact_items', newContact);
      if (error) throw new Error(error);

      toast.success('Contact added successfully');
      setIsAddDialogOpen(false);
      resetForm();
      fetchContacts();
    } catch (error) {
      console.error('Error adding contact:', error);
      toast.error('Failed to add contact');
    }
  };

  // Add new response time
  const handleAddResponseTime = async () => {
    if (!validateResponseTimeForm()) return;

    try {
      const newResponseTime = {
        ...responseTimeFormData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { id, error } = await saveAndUpdateDynamicContent('response_times', newResponseTime);
      if (error) throw new Error(error);

      toast.success('Response time added successfully');
      setIsAddResponseTimeDialogOpen(false);
      resetResponseTimeForm();
      fetchResponseTimes();
    } catch (error) {
      console.error('Error adding response time:', error);
      toast.error('Failed to add response time');
    }
  };

  // Edit contact
  const handleEditContact = (contact: ContactItem) => {
    setEditingContact(contact);
    setFormData({
      type: contact.type,
      displayText: contact.displayText,
      url: contact.url || '',
      notes: contact.notes || '',
      sortOrder: contact.sortOrder,
      isVisible: contact.isVisible
    });
    setIsEditDialogOpen(true);
  };

  // Edit response time
  const handleEditResponseTime = (responseTime: ResponseTimeItem) => {
    setEditingResponseTime(responseTime);
    setResponseTimeFormData({
      platform: responseTime.platform,
      timeframe: responseTime.timeframe,
      description: responseTime.description || '',
      sortOrder: responseTime.sortOrder,
      isVisible: responseTime.isVisible
    });
    setIsEditResponseTimeDialogOpen(true);
  };

  // Update contact
  const handleUpdateContact = async () => {
    if (!validateForm() || !editingContact) return;

    try {
      const updatedContact = {
        ...editingContact,
        ...formData,
        updated_at: new Date().toISOString(),
      };

      const { error } = await saveAndUpdateDynamicContent('contact_items', updatedContact, editingContact.id);
      if (error) throw new Error(error);

      toast.success('Contact updated successfully');
      setIsEditDialogOpen(false);
      setEditingContact(null);
      resetForm();
      fetchContacts();
    } catch (error) {
      console.error('Error updating contact:', error);
      toast.error('Failed to update contact');
    }
  };

  // Update response time
  const handleUpdateResponseTime = async () => {
    if (!validateResponseTimeForm() || !editingResponseTime) return;

    try {
      const updatedResponseTime = {
        ...editingResponseTime,
        ...responseTimeFormData,
        updated_at: new Date().toISOString(),
      };

      const { error } = await saveAndUpdateDynamicContent('response_times', updatedResponseTime, editingResponseTime.id);
      if (error) throw new Error(error);

      toast.success('Response time updated successfully');
      setIsEditResponseTimeDialogOpen(false);
      setEditingResponseTime(null);
      resetResponseTimeForm();
      fetchResponseTimes();
    } catch (error) {
      console.error('Error updating response time:', error);
      toast.error('Failed to update response time');
    }
  };

  // Delete contact
  const handleDeleteContact = async (contactId: string) => {
    try {
      await deleteDynamicContent('contact_items', contactId);
      toast.success('Contact deleted successfully');
      fetchContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast.error('Failed to delete contact');
    }
  };

  // Delete response time
  const handleDeleteResponseTime = async (responseTimeId: string) => {
    try {
      await deleteDynamicContent('response_times', responseTimeId);
      toast.success('Response time deleted successfully');
      fetchResponseTimes();
    } catch (error) {
      console.error('Error deleting response time:', error);
      toast.error('Failed to delete response time');
    }
  };

  // Toggle visibility
  const toggleVisibility = async (contact: ContactItem) => {
    try {
      const updatedContact = {
        ...contact,
        isVisible: !contact.isVisible,
        updated_at: new Date().toISOString(),
      };

      const { error } = await saveAndUpdateDynamicContent('contact_items', updatedContact, contact.id);
      if (error) throw new Error(error);

      toast.success(`Contact ${contact.isVisible ? 'hidden' : 'shown'} successfully`);
      fetchContacts();
    } catch (error) {
      console.error('Error toggling visibility:', error);
      toast.error('Failed to update visibility');
    }
  };

  // Toggle response time visibility
  const toggleResponseTimeVisibility = async (responseTime: ResponseTimeItem) => {
    try {
      const updatedResponseTime = {
        ...responseTime,
        isVisible: !responseTime.isVisible,
        updated_at: new Date().toISOString(),
      };

      const { error } = await saveAndUpdateDynamicContent('response_times', updatedResponseTime, responseTime.id);
      if (error) throw new Error(error);

      toast.success(`Response time ${responseTime.isVisible ? 'hidden' : 'shown'} successfully`);
      fetchResponseTimes();
    } catch (error) {
      console.error('Error toggling response time visibility:', error);
      toast.error('Failed to update visibility');
    }
  };

  // Reorder contacts
  const reorderContact = async (contactId: string, newOrder: number) => {
    try {
      const contact = contacts.find(c => c.id === contactId);
      if (!contact) return;

      const updatedContact = {
        ...contact,
        sortOrder: newOrder,
        updated_at: new Date().toISOString(),
      };

      const { error } = await saveAndUpdateDynamicContent('contact_items', updatedContact, contactId);
      if (error) throw new Error(error);

      fetchContacts();
    } catch (error) {
      console.error('Error reordering contact:', error);
      toast.error('Failed to reorder contact');
    }
  };

  // Reorder response times
  const reorderResponseTime = async (responseTimeId: string, newOrder: number) => {
    try {
      const responseTime = responseTimes.find(rt => rt.id === responseTimeId);
      if (!responseTime) return;

      const updatedResponseTime = {
        ...responseTime,
        sortOrder: newOrder,
        updated_at: new Date().toISOString(),
      };

      const { error } = await saveAndUpdateDynamicContent('response_times', updatedResponseTime, responseTimeId);
      if (error) throw new Error(error);

      fetchResponseTimes();
    } catch (error) {
      console.error('Error reordering response time:', error);
      toast.error('Failed to reorder response time');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchContacts();
      fetchResponseTimes();
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
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Contact Management</h1>
            <p className="text-gray-600 mt-1">Manage contact information and response times displayed on your portfolio</p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              {previewMode ? 'Edit Mode' : 'Preview'}
            </Button>
          </div>
        </div>

        {previewMode ? (
          <ContactPreview contacts={contacts.filter(c => c.isVisible)} responseTimes={responseTimes.filter(rt => rt.isVisible)} />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="contacts" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Contact Items
              </TabsTrigger>
              <TabsTrigger value="response-times" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Response Times
              </TabsTrigger>
            </TabsList>

            <TabsContent value="contacts" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Contact Items ({contacts.length})</h2>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Add Contact
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Add New Contact</DialogTitle>
                      <DialogDescription>
                        Add a new contact method to display on your portfolio
                      </DialogDescription>
                    </DialogHeader>
                    <ContactForm 
                      formData={formData} 
                      setFormData={setFormData} 
                      contacts={contacts}
                    />
                    <DialogFooter>
                      <Button variant="outline" onClick={() => {
                        setIsAddDialogOpen(false);
                        resetForm();
                      }}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddContact}>
                        <Save className="w-4 h-4 mr-2" />
                        Add Contact
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <Card>
                <CardContent>
                  {contacts.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500 mb-4">No contact items found</p>
                      <Button onClick={() => setIsAddDialogOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Your First Contact
                      </Button>
                    </div>
                  ) : (
                    <ContactTable
                      contacts={contacts}
                      onEditContact={handleEditContact}
                      onDeleteContact={handleDeleteContact}
                      onToggleVisibility={toggleVisibility}
                      onReorderContact={reorderContact}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="response-times" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Response Times ({responseTimes.length})</h2>
                <Dialog open={isAddResponseTimeDialogOpen} onOpenChange={setIsAddResponseTimeDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Add Response Time
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Add New Response Time</DialogTitle>
                      <DialogDescription>
                        Add response time information for different platforms
                      </DialogDescription>
                    </DialogHeader>
                    <ResponseTimeForm 
                      formData={responseTimeFormData} 
                      setFormData={setResponseTimeFormData} 
                      responseTimes={responseTimes}
                    />
                    <DialogFooter>
                      <Button variant="outline" onClick={() => {
                        setIsAddResponseTimeDialogOpen(false);
                        resetResponseTimeForm();
                      }}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddResponseTime}>
                        <Save className="w-4 h-4 mr-2" />
                        Add Response Time
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <Card>
                <CardContent>
                  {responseTimesLoading ? (
                    <div className="text-center py-12">
                      <div className="text-lg">Loading response times...</div>
                    </div>
                  ) : responseTimes.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500 mb-4">No response times found</p>
                      <Button onClick={() => setIsAddResponseTimeDialogOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Your First Response Time
                      </Button>
                    </div>
                  ) : (
                    <ResponseTimeTable
                      responseTimes={responseTimes}
                      onEditResponseTime={handleEditResponseTime}
                      onDeleteResponseTime={handleDeleteResponseTime}
                      onToggleVisibility={toggleResponseTimeVisibility}
                      onReorderResponseTime={reorderResponseTime}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {/* Edit Contact Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Contact</DialogTitle>
              <DialogDescription>
                Update contact information
              </DialogDescription>
            </DialogHeader>
            <ContactForm 
              formData={formData} 
              setFormData={setFormData} 
              contacts={contacts}
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsEditDialogOpen(false);
                setEditingContact(null);
                resetForm();
              }}>
                Cancel
              </Button>
              <Button onClick={handleUpdateContact}>
                <Save className="w-4 h-4 mr-2" />
                Update Contact
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Response Time Dialog */}
        <Dialog open={isEditResponseTimeDialogOpen} onOpenChange={setIsEditResponseTimeDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Response Time</DialogTitle>
              <DialogDescription>
                Update response time information
              </DialogDescription>
            </DialogHeader>
            <ResponseTimeForm 
              formData={responseTimeFormData} 
              setFormData={setResponseTimeFormData} 
              responseTimes={responseTimes}
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsEditResponseTimeDialogOpen(false);
                setEditingResponseTime(null);
                resetResponseTimeForm();
              }}>
                Cancel
              </Button>
              <Button onClick={handleUpdateResponseTime}>
                <Save className="w-4 h-4 mr-2" />
                Update Response Time
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminContactManager;
