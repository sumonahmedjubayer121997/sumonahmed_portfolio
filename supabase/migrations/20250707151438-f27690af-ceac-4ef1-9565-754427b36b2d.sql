
-- Create contact_messages table to store incoming messages
CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_name TEXT NOT NULL,
  sender_email TEXT,
  sender_username TEXT,
  platform TEXT NOT NULL CHECK (platform IN ('email', 'twitter', 'linkedin', 'github', 'phone')),
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'replied', 'pending', 'resolved', 'spam', 'archived')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  replied_at TIMESTAMP WITH TIME ZONE,
  assigned_to UUID REFERENCES admin_users(id)
);

-- Add Row Level Security
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Admin users can view all contact messages" 
  ON public.contact_messages 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()
  ));

CREATE POLICY "Admin users can create contact messages" 
  ON public.contact_messages 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()
  ));

CREATE POLICY "Admin users can update contact messages" 
  ON public.contact_messages 
  FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()
  ));

CREATE POLICY "Admin users can delete contact messages" 
  ON public.contact_messages 
  FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()
  ));

-- Create indexes for better performance
CREATE INDEX idx_contact_messages_status ON public.contact_messages(status);
CREATE INDEX idx_contact_messages_platform ON public.contact_messages(platform);
CREATE INDEX idx_contact_messages_created_at ON public.contact_messages(created_at DESC);

-- Create contact_settings table for editable contact page information
CREATE TABLE public.contact_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  updated_by UUID REFERENCES admin_users(id),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security for contact_settings
ALTER TABLE public.contact_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for contact_settings
CREATE POLICY "Admin users can manage contact settings" 
  ON public.contact_settings 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()
  ));

-- Insert default contact settings
INSERT INTO public.contact_settings (setting_key, setting_value) VALUES
('contact_info', '{
  "email": "sumonahmedjubayer@email.com",
  "phone": "+447405241663",
  "twitter_url": "https://twitter.com",
  "linkedin_url": "https://linkedin.com/in/yourprofile",
  "github_url": "https://github.com/yourprofile"
}'),
('response_times', '{
  "twitter": "24 hours",
  "email": "48 hours on weekdays",
  "general": "Weekends and holidays may take up to 48 hours for response"
}'),
('welcome_message', '{
  "headline": "Get In Touch",
  "description": "I am always excited to connect with fellow developers, AI enthusiasts, and curious minds. Whether you want to discuss the latest in AI technology, explore potential collaborations, or simply say hello, I would love to hear from you!"
}');
