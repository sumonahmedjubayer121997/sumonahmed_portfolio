
import React, { useState, useEffect } from 'react';
import { X, Send, MessageCircle, User, Briefcase, Code, Heart, Mail, Mic, MicOff } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SearchDialog: React.FC<SearchDialogProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [showQuickOptions, setShowQuickOptions] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const { theme } = useTheme();

  const quickOptions = [
    { id: 'me', label: 'Me', icon: User, color: 'bg-blue-500 hover:bg-blue-600' },
    { id: 'projects', label: 'Projects', icon: Briefcase, color: 'bg-green-500 hover:bg-green-600' },
    { id: 'skills', label: 'Skills', icon: Code, color: 'bg-purple-500 hover:bg-purple-600' },
    { id: 'fun', label: 'Fun', icon: Heart, color: 'bg-pink-500 hover:bg-pink-600' },
    { id: 'contact', label: 'Contact', icon: Mail, color: 'bg-orange-500 hover:bg-orange-600' },
  ];

  const userQuestions = {
    me: "Who are you? I want to know more about you.",
    projects: "Can you show me your recent projects?",
    skills: "What technologies do you work with?",
    fun: "Tell me something fun about yourself.",
    contact: "How can I contact you?"
  };

  const assistantResponses = {
    me: "Hi there! 👋 I'm a passionate developer who loves creating innovative solutions. I enjoy working with modern technologies and building user-friendly applications. Want to know something specific about my background?",
    projects: "I've worked on various exciting projects! 🚀 From web applications to mobile apps, each project taught me something new. Check out my portfolio section to see detailed case studies and live demos.",
    skills: "I'm proficient in multiple technologies! 💻 Including React, TypeScript, Node.js, and more. I'm always learning new technologies to stay current with industry trends. What specific skill are you curious about?",
    fun: "When I'm not coding, I love exploring new technologies, contributing to open source, and sharing knowledge with the developer community! 🎉 I believe in maintaining a good work-life balance.",
    contact: "Let's connect! 📫 Feel free to reach out through email, LinkedIn, or check out my GitHub. I'm always open to discussing new opportunities or collaborating on interesting projects."
  };

  const addMessage = (type: 'user' | 'assistant', content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Add user message
    addMessage('user', query);

    // Process query and add assistant response
    setTimeout(() => {
      const lowercaseQuery = query.toLowerCase();
      let assistantResponse = '';

      if (lowercaseQuery.includes('about') || lowercaseQuery.includes('who')) {
        assistantResponse = assistantResponses.me;
      } else if (lowercaseQuery.includes('project') || lowercaseQuery.includes('work') || lowercaseQuery.includes('portfolio')) {
        assistantResponse = assistantResponses.projects;
      } else if (lowercaseQuery.includes('skill') || lowercaseQuery.includes('tech') || lowercaseQuery.includes('experience')) {
        assistantResponse = assistantResponses.skills;
      } else if (lowercaseQuery.includes('fun') || lowercaseQuery.includes('hobby') || lowercaseQuery.includes('interest')) {
        assistantResponse = assistantResponses.fun;
      } else if (lowercaseQuery.includes('contact') || lowercaseQuery.includes('reach') || lowercaseQuery.includes('email')) {
        assistantResponse = assistantResponses.contact;
      } else {
        assistantResponse = "Hey! How can I help? 😊 Feel free to ask about my work, skills, fun facts, or how to reach me. I'm here to help you learn more about my journey and experience!";
      }

      addMessage('assistant', assistantResponse);
    }, 500);

    setQuery('');
  };

  const handleQuickOption = (optionId: string) => {
    const userQuestion = userQuestions[optionId as keyof typeof userQuestions];
    const assistantResponse = assistantResponses[optionId as keyof typeof assistantResponses];
    
    // Add user message first
    addMessage('user', userQuestion);
    
    // Add assistant response after a short delay
    setTimeout(() => {
      addMessage('assistant', assistantResponse);
    }, 500);
  };

  const toggleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsListening(!isListening);
      console.log('Voice input toggled:', !isListening);
    } else {
      console.log('Speech recognition not supported');
    }
  };

  // Keyboard shortcut to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !isOpen) {
        e.preventDefault();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Clear messages when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setMessages([]);
      setQuery('');
      setShowQuickOptions(true);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl mx-auto p-0 bg-background border-border/50 shadow-2xl max-h-[80vh] flex flex-col">
        <DialogHeader className="p-6 pb-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Portfolio Assistant</h2>
                <p className="text-sm text-muted-foreground">Ask me anything about my work and experience</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full hover:bg-muted"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="px-6 flex-1 min-h-0 flex flex-col">
          {/* Messages Container */}
          {messages.length > 0 && (
            <div className="flex-1 overflow-y-auto mb-6 space-y-4 max-h-60">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  <div className={`flex gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                      message.type === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-primary/10'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <MessageCircle className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <div className={`p-3 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-muted/30 border border-border/30 rounded-bl-md'
                    }`}>
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Search Form */}
          <div className="flex-shrink-0 mb-6">
            <form onSubmit={handleSubmit}>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask me anything..."
                    className="pr-12 h-12 text-base bg-muted/50 border-border/50 focus:bg-background"
                    autoFocus
                  />
                  {('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={toggleVoiceInput}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full ${
                        isListening ? 'bg-red-500 text-white hover:bg-red-600' : 'hover:bg-muted'
                      }`}
                    >
                      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </Button>
                  )}
                </div>
                <Button
                  type="submit"
                  size="icon"
                  className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90"
                  disabled={!query.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </div>

          {/* Quick Options */}
          {showQuickOptions && (
            <div className="flex-shrink-0 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">Quick Questions</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowQuickOptions(false)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Hide Quick Questions
                </Button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {quickOptions.map((option) => (
                  <Button
                    key={option.id}
                    variant="outline"
                    onClick={() => handleQuickOption(option.id)}
                    className="h-16 flex-col gap-2 bg-background hover:bg-muted/50 border-border/50 group"
                  >
                    <div className={`w-8 h-8 rounded-full ${option.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                      <option.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs font-medium">{option.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Show Quick Questions button when hidden */}
          {!showQuickOptions && (
            <div className="flex-shrink-0 text-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowQuickOptions(true)}
                className="text-sm"
              >
                Show Quick Questions
              </Button>
            </div>
          )}
        </div>

        {/* Keyboard Shortcut Hint */}
        <div className="px-6 pb-6 flex-shrink-0">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              💡 Pro tip: Press <kbd className="text-xs">/</kbd> to quickly open this assistant
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
