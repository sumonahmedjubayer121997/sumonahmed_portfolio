
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface StepDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
}

export default function StepDetailModal({ 
  isOpen, 
  onClose, 
  title, 
  description 
}: StepDetailModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-foreground">
            {title}
          </DialogTitle>
        </DialogHeader>
        <AnimatePresence mode="wait">
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="mt-4"
            >
              <p className="text-muted-foreground leading-relaxed">
                {description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
