
import React, { useEffect, useState } from 'react';
import { X, Keyboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isFocusMode: boolean;
  onToggleFocusMode: () => void;
}

const ShortcutsModal = ({
  isOpen,
  onClose,
  isDarkMode,
  onToggleDarkMode,
  isFocusMode,
  onToggleFocusMode,
}: ShortcutsModalProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return; // Only handle keys when modal is open
      
      if (event.key === 'Escape') {
        onClose();
      } else if (event.key.toLowerCase() === 'q') {
        onClose();
      } else if (event.key.toLowerCase() === 'f') {
        event.preventDefault();
        onToggleFocusMode();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, onToggleFocusMode]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <div className="relative w-full max-w-2xl mx-4 bg-background rounded-xl shadow-2xl border text-foreground">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Keyboard className="w-6 h-6" />
            <h2 className="text-xl font-semibold text-foreground">TIP: Shortcuts</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-accent text-foreground"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 grid md:grid-cols-2 gap-8">
          {/* Shortcuts Section */}
          <div>
            <p className="text-muted-foreground mb-6">
              Navigate the site with ease using keyboard shortcuts.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Open Quick Access</span>
                <kbd className="px-2 py-1 text-xs bg-muted rounded border">Q</kbd>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Close Quick Access</span>
                <div className="flex gap-2">
                  <kbd className="px-2 py-1 text-xs bg-muted rounded border">Q</kbd>
                  <span className="text-xs text-muted-foreground">or</span>
                  <kbd className="px-2 py-1 text-xs bg-muted rounded border">Esc</kbd>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Toggle Dark Mode</span>
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 text-xs bg-muted rounded border">D</kbd>
                  <span className="text-xs text-muted-foreground">(works globally)</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Toggle Focus</span>
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 text-xs bg-muted rounded border">F</kbd>
                  <span className="text-xs text-muted-foreground">(when open)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Center */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-foreground">Action Center</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-accent/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-xs">🌙</span>
                  </div>
                  <span className="font-medium text-foreground">Dark Mode: {isDarkMode ? 'On' : 'Off'}</span>
                </div>
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={onToggleDarkMode}
                />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-accent/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-xs">🎯</span>
                  </div>
                  <span className="font-medium text-foreground">Focus: {isFocusMode ? 'On' : 'Off'}</span>
                </div>
                <Switch
                  checked={isFocusMode}
                  onCheckedChange={onToggleFocusMode}
                />
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <h4 className="text-sm font-semibold mb-3 text-foreground">Recent Activities</h4>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>REACTION</span>
                  <span>14 hours ago</span>
                </div>
                <div>
                  the <span className="text-primary font-medium">Python Best Practices</span> blog post
                  got new <span className="bg-primary/20 px-1 rounded text-xs">x15</span> 🔥
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShortcutsModal;
