import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUpDown, Eye, Edit, Trash2 } from 'lucide-react';
import type { AppItem } from '@/pages/AdminAppsManager';

interface AppsTableProps {
  apps: AppItem[];
  onSort: (field: keyof AppItem) => void;
  sortField: keyof AppItem;
  sortDirection: 'asc' | 'desc';
  onEdit: (app: AppItem) => void;
  onView: (app: AppItem) => void;
  onDelete: (app: AppItem) => void;
  getStatusColor: (status: string) => string;
  getTypeColor: (type: string) => string;
}

const AppsTable: React.FC<AppsTableProps> = ({
  apps,
  onSort,
  sortField,
  sortDirection,
  onEdit,
  onView,
  onDelete,
  getStatusColor,
  getTypeColor
}) => {
  const SortableHeader = ({ field, children }: { field: keyof AppItem; children: React.ReactNode }) => (
    <TableHead>
      <Button
        variant="ghost"
        className="h-auto p-0 font-medium hover:bg-transparent"
        onClick={() => onSort(field)}
      >
        <div className="flex items-center gap-1">
          {children}
          <ArrowUpDown className="w-3 h-3" />
        </div>
      </Button>
    </TableHead>
  );

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <SortableHeader field="order">Order</SortableHeader>
                <SortableHeader field="title">Title</SortableHeader>
                <SortableHeader field="type">Type</SortableHeader>
                <SortableHeader field="status">Status</SortableHeader>
                <SortableHeader field="duration">Duration</SortableHeader>
                <TableHead>Technologies</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apps.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No apps found
                  </TableCell>
                </TableRow>
              ) : (
                apps.map((app) => (
                  <TableRow key={app.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{app.order}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{app.title}</div>
                        <div className="text-sm text-gray-500">v{app.version}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(app.type)}>
                        {app.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(app.status)}>
                        {app.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{app.duration}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {app.technologies?.slice(0, 3).map((tech, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                        {app.technologies?.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{app.technologies.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onView(app)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(app)}
                          className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(app)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppsTable;