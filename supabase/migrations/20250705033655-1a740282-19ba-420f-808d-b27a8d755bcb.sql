
-- Create enum for content types
CREATE TYPE content_type AS ENUM ('home', 'experience', 'apps', 'projects', 'blogs', 'about', 'contact');

-- Create admin users table
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create page content table
CREATE TABLE public.page_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_type content_type NOT NULL,
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES admin_users(id)
);

-- Create admin sessions table for session management
CREATE TABLE public.admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin users (only they can access their own data)
CREATE POLICY "Admin users can view their own profile" ON public.admin_users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admin users can update their own profile" ON public.admin_users
  FOR UPDATE USING (auth.uid() = id);

-- Create RLS policies for page content (admin users can manage all content)
CREATE POLICY "Admin users can view all content" ON public.page_content
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );

CREATE POLICY "Admin users can create content" ON public.page_content
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );

CREATE POLICY "Admin users can update content" ON public.page_content
  FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );

CREATE POLICY "Admin users can delete content" ON public.page_content
  FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );

-- Create RLS policies for admin sessions
CREATE POLICY "Admin users can manage their own sessions" ON public.admin_sessions
  FOR ALL TO authenticated USING (admin_user_id = auth.uid());

-- Create function to hash passwords
CREATE OR REPLACE FUNCTION public.hash_password(password TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN crypt(password, gen_salt('bf', 12));
END;
$$;

-- Create function to verify passwords
CREATE OR REPLACE FUNCTION public.verify_password(password TEXT, hash TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN hash = crypt(password, hash);
END;
$$;

-- Create function to create admin session
CREATE OR REPLACE FUNCTION public.create_admin_session(user_email TEXT, user_password TEXT)
RETURNS TABLE(session_token TEXT, admin_id UUID, expires_at TIMESTAMP WITH TIME ZONE)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_record admin_users%ROWTYPE;
  new_token TEXT;
  expiry TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Check if admin exists and password is correct
  SELECT * INTO admin_record
  FROM admin_users
  WHERE email = user_email;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid credentials';
  END IF;
  
  IF NOT verify_password(user_password, admin_record.password_hash) THEN
    RAISE EXCEPTION 'Invalid credentials';
  END IF;
  
  -- Generate session token and expiry
  new_token := encode(gen_random_bytes(32), 'base64');
  expiry := NOW() + INTERVAL '24 hours';
  
  -- Insert session
  INSERT INTO admin_sessions (admin_user_id, session_token, expires_at)
  VALUES (admin_record.id, new_token, expiry);
  
  RETURN QUERY SELECT new_token, admin_record.id, expiry;
END;
$$;

-- Insert a default admin user (password: admin123)
INSERT INTO public.admin_users (email, password_hash)
VALUES ('admin@example.com', public.hash_password('admin123'));
