
import React, { useState, useEffect } from 'react';
import { Send, MessageCircle, User, Briefcase, Code, Heart, Mail } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { askOpenAI } from './api/openai';
import { personalContext, isQueryAboutSumon } from './constants/personalContext';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);
  const isMobile = useIsMobile();

  const funnyResponses = [
  "Bro, I’m not ChatGPT – I’ve got more personality than that! 😂",
  "15 messages in? You tryna break me or fall in love? 😏",
  "Do I look like ChatGPT to you? I’ve got style. 😎",
  "You again? At this point, we should get matching tattoos. 💬❤️",
  "If this was Tinder, I’d have swiped right already. 😉",
  "You’re keeping me busier than Stack Overflow on a Monday. 🧠💥",
  "I need coffee. You need a hobby. ☕📵",
  "Still here? I admire your curiosity or your boredom. Either way, respect. ✊",
  "Are we writing a novel together or what? 📖🖊️",
];


  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    const latestMessage = messages[messages.length - 1];
    if (latestMessage?.type === 'assistant' && latestMessage.content.length > 300) {
      setShowQuickOptions(false);
    }
  }, [messages]);

  useEffect(() => { 
    if(isMobile) {
      setShowQuickOptions(false);
    }
  }, [isMobile]);

  const userQuestions = {
    me: "Who are you? I want to know more about you.",
    projects: "Can you show me your recent projects?",
    skills: "What technologies do you work with?",
    fun: "Tell me something fun about yourself.",
    contact: "How can I contact you?",
  };

  const assistantResponses = {
    me: "Hi there! 👋 I'm a passionate developer who loves creating innovative solutions. I enjoy working with modern technologies and building user-friendly applications. Want to know something specific about my background?",
    projects: "I've worked on various exciting projects! 🚀 From web applications to mobile apps, each project taught me something new. Check out my portfolio section to see detailed case studies and live demos.",
    skills: "I'm proficient in multiple technologies! 💻 Including React, TypeScript, Node.js, and more. I'm always learning new technologies to stay current with industry trends. What specific skill are you curious about?",
    fun: "When I'm not coding, I love exploring new technologies, contributing to open source, and sharing knowledge with the developer community! 🎉 I believe in maintaining a good work-life balance.",
    contact: "Let's connect! 📫 Feel free to reach out through email, LinkedIn, or check out my GitHub. I'm always open to discussing new opportunities or collaborating on interesting projects."
  };

  const quickOptions = [
    { id: 'me', label: 'About Me', icon: User },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'fun', label: 'Fun', icon: Heart },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

  const addMessage = (type: 'user' | 'assistant', content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const normalizedQuery = query.toLowerCase().trim();
    addMessage('user', query);

    if ((messages.length + 1) % 20 === 0) {
  const randomFunny = funnyResponses[Math.floor(Math.random() * funnyResponses.length)];
  addMessage('assistant', randomFunny);
}

    // Intercept "Are you ChatGPT?" or similar
    if (
      normalizedQuery.includes('are you chatgpt') ||
      normalizedQuery.includes('r u chatgpt') ||
      normalizedQuery.includes('are you gpt') ||
      normalizedQuery.includes('is this chatgpt') ||
      normalizedQuery.includes('chatgpt')
    ) {
      addMessage('assistant', 'I am not ChatGPT; I am your AI assistant.');
      setQuery('');
      return;
    }

    const prompt = isQueryAboutSumon(query)
      ? `${personalContext}\n\nUser asked: "${query}"`
      : query;

    try {
      const answer = await askOpenAI(prompt);
      addMessage('assistant', answer);
    } catch (err) {
      addMessage('assistant', 'Something went wrong. Please try again.');
    }

    setQuery('');
  };

  const handleQuickOption = (optionId: string) => {
    const userQuestion = userQuestions[optionId as keyof typeof userQuestions];
    const assistantResponse = assistantResponses[optionId as keyof typeof assistantResponses];

    addMessage('user', userQuestion);
    setTimeout(() => {
      addMessage('assistant', assistantResponse);
    }, 500);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !isOpen) {
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setMessages([]);
      setQuery('');
      setShowQuickOptions(true);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl mx-auto p-0 bg-background border-none shadow-lg max-h-[85vh] flex flex-col rounded-xl">
        <DialogHeader className="px-8 pt-8 pb-6 flex-shrink-0 border-b border-border/20">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-foreground/70" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-foreground tracking-tight">Portfolio Assistant</h2>
              <p className="text-sm text-muted-foreground font-normal mt-0.5">Ask about my work or anything</p>
            </div>
          </div>
        </DialogHeader>

        <div className="px-8 flex-1 min-h-0 flex flex-col">
          {messages.length > 0 && (
            <div className="overflow-y-auto py-6 space-y-6 grow">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  <div className={`flex gap-3 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                      message.type === 'user'
                        ? 'bg-foreground text-background'
                        : 'bg-muted'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="w-3.5 h-3.5" />
                      ) : (
                        <MessageCircle className="w-3.5 h-3.5 text-muted-foreground" />
                      )}
                    </div>
                    <div className={`px-4 py-3 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-foreground text-background rounded-br-md'
                        : 'bg-muted/40 text-foreground rounded-bl-md'
                    }`}>
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Input Form */}
          <div className="flex-shrink-0 py-6">
            <form onSubmit={handleSubmit}>
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask me anything..."
                    className="h-11 text-sm bg-muted/30 border-border/40 focus:bg-background focus:border-border rounded-lg"
                    autoFocus
                  />
                </div>
                <Button
                  type="submit"
                  size="icon"
                  className="h-11 w-11 rounded-lg bg-foreground hover:bg-foreground/90 text-background"
                  disabled={!query.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </div>

          {/* Quick Options */}
          {showQuickOptions ? (
            <div className="flex-shrink-0 pb-8 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">Quick Questions</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowQuickOptions(false)}
                  className="text-xs text-muted-foreground hover:text-foreground h-auto p-1"
                >
                  Hide
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {quickOptions.map((option) => (
                  <Button
                    key={option.id}
                    variant="outline"
                    onClick={() => handleQuickOption(option.id)}
                    className="h-9 px-3 text-xs font-medium bg-background hover:bg-muted/30 border-border/40 text-muted-foreground hover:text-foreground transition-all duration-200 rounded-lg"
                  >
                    <option.icon className="w-3.5 h-3.5 mr-2" />
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-shrink-0 pb-8 flex items-center justify-between text-xs text-muted-foreground">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowQuickOptions(true)}
                className="text-xs text-muted-foreground hover:text-foreground h-auto p-1"
              >
                Show Quick Questions
              </Button>
              <p className="flex items-center gap-1">
                Press <kbd className="px-1.5 py-0.5 bg-muted border border-border/40 rounded text-xs font-mono">/</kbd> to open
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
