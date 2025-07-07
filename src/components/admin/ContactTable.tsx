
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Mail, Github, Linkedin, Phone, Twitter, Edit, Trash2, Eye, EyeOff, GripVertical } from "lucide-react";

interface ContactItem {
  id: string;
  type: 'email' | 'phone' | 'twitter' | 'linkedin' | 'github' | 'other';
  displayText: string;
  url?: string;
  notes?: string;
  sortOrder: number;
  isVisible: boolean;
}

interface ContactTableProps {
  contacts: ContactItem[];
  onEditContact: (contact: ContactItem) => void;
  onDeleteContact: (contactId: string) => void;
  onToggleVisibility: (contact: ContactItem) => void;
  onReorderContact: (contactId: string, newOrder: number) => void;
}

const ContactTable: React.FC<ContactTableProps> = ({
  contacts,
  onEditContact,
  onDeleteContact,
  onToggleVisibility,
  onReorderContact
}) => {
  const getContactIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'phone': return <Phone className="w-4 h-4" />;
      case 'twitter': return <Twitter className="w-4 h-4" />;
      case 'linkedin': return <Linkedin className="w-4 h-4" />;
      case 'github': return <Github className="w-4 h-4" />;
      default: return <Mail className="w-4 h-4" />;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">Order</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Display Text</TableHead>
          <TableHead>URL/Value</TableHead>
          <TableHead>Notes</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contacts.map((contact, index) => (
          <TableRow key={contact.id}>
            <TableCell>
              <div className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-gray-400" />
                <Input
                  type="number"
                  value={contact.sortOrder}
                  onChange={(e) => onReorderContact(contact.id, parseInt(e.target.value))}
                  className="w-16 h-8"
                  min="0"
                />
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {getContactIcon(contact.type)}
                <span className="capitalize">{contact.type}</span>
              </div>
            </TableCell>
            <TableCell className="font-medium">
              {contact.displayText}
            </TableCell>
            <TableCell>
              <div className="max-w-48 truncate text-sm text-gray-600">
                {contact.url || '-'}
              </div>
            </TableCell>
            <TableCell>
              <div className="max-w-32 truncate text-sm text-gray-600">
                {contact.notes || '-'}
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={contact.isVisible ? "default" : "secondary"}>
                {contact.isVisible ? 'Visible' : 'Hidden'}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onToggleVisibility(contact)}
                >
                  {contact.isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onEditContact(contact)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="ghost">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Contact</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{contact.displayText}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDeleteContact(contact.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ContactTable;
