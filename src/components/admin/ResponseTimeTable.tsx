
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Edit, Trash2, Eye, EyeOff, GripVertical } from "lucide-react";

interface ResponseTimeItem {
  id: string;
  platform: string;
  timeframe: string;
  description?: string;
  sortOrder: number;
  isVisible: boolean;
}

interface ResponseTimeTableProps {
  responseTimes: ResponseTimeItem[];
  onEditResponseTime: (responseTime: ResponseTimeItem) => void;
  onDeleteResponseTime: (responseTimeId: string) => void;
  onToggleVisibility: (responseTime: ResponseTimeItem) => void;
  onReorderResponseTime: (responseTimeId: string, newOrder: number) => void;
}

const ResponseTimeTable: React.FC<ResponseTimeTableProps> = ({
  responseTimes,
  onEditResponseTime,
  onDeleteResponseTime,
  onToggleVisibility,
  onReorderResponseTime
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">Order</TableHead>
          <TableHead>Platform</TableHead>
          <TableHead>Timeframe</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {responseTimes.map((responseTime) => (
          <TableRow key={responseTime.id}>
            <TableCell>
              <div className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-gray-400" />
                <Input
                  type="number"
                  value={responseTime.sortOrder}
                  onChange={(e) => onReorderResponseTime(responseTime.id, parseInt(e.target.value))}
                  className="w-16 h-8"
                  min="0"
                />
              </div>
            </TableCell>
            <TableCell className="font-medium">
              {responseTime.platform}
            </TableCell>
            <TableCell>
              {responseTime.timeframe}
            </TableCell>
            <TableCell>
              <div className="max-w-48 truncate text-sm text-gray-600">
                {responseTime.description || '-'}
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={responseTime.isVisible ? "default" : "secondary"}>
                {responseTime.isVisible ? 'Visible' : 'Hidden'}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onToggleVisibility(responseTime)}
                >
                  {responseTime.isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onEditResponseTime(responseTime)}
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
                      <AlertDialogTitle>Delete Response Time</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete the response time for "{responseTime.platform}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDeleteResponseTime(responseTime.id)}>
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

export default ResponseTimeTable;
