import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Index from "./pages/user_public/Index";
import About from "./pages/user_public/About";
import Experience from "./pages/user_public/Experience";
import Apps from "./pages/user_public/Apps";
import AppDetail from "./pages/user_public/AppDetail";
import Projects from "./pages/user_public/Projects";
import ProjectDetail from "./pages/user_public/ProjectDetail";
import Blogs from "./pages/user_public/Blogs";
import BlogDetail from "./pages/user_public/BlogDetail";
import Contact from "./pages/user_public/Contact";
import NotFound from "./pages/NotFound";
import Tools from "./pages/user_public/Tools";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/admin_pages/AdminDashboard";
import AdminContentManager from "./pages/admin_pages/AdminContentManager";
import AdminHomeManager from "./pages/admin_pages/AdminHomeManager";
import AdminAboutManager from "./pages/admin_pages/AdminAboutManager";
import AdminExperienceManager from "./pages/admin_pages/AdminExperienceManager";
import AdminToolsManager from "./pages/admin_pages/AdminToolsManager";
import AdminAppsManager from "./pages/admin_pages/AdminAppsManager";
import AdminProjectsManager from "./pages/admin_pages/AdminProjectsManager";
import AdminBlogManager from "./pages/admin_pages/AdminBlogManager";
import AdminContactManager from "./pages/admin_pages/AdminContactManager";
import AdminClientsMessages from "./pages/admin_pages/AdminClientsMessages";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import InteractiveBackground from "./components/InteractiveBackground";
import FluidCursor from "./components/FluidCursor";
import EffectsToggle from "./components/EffectsToggle";
import Preloader from "./components/Preloader";
import { usePreloader } from "./hooks/usePreloader";
import { InteractiveEffectsProvider } from "./contexts/InteractiveEffectsContext";

const queryClient = new QueryClient();

function App() {
  const { isLoading } = usePreloader({ minDuration: 2000, checkAssets: true });
  const [effectsEnabled, setEffectsEnabled] = useState(true);

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <InteractiveEffectsProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/about" element={<About />} />
    <Route path="/experience" element={<Experience />} />
    <Route path="/apps" element={<Apps />} />
    <Route path="/apps/:appName" element={<AppDetail />} />
    <Route path="/projects" element={<Projects />} />
    <Route path="/projects/:title" element={<ProjectDetail />} />
    <Route path="/blogs" element={<Blogs />} />
    <Route path="/blogs/:slug" element={<BlogDetail />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/tools" element={<Tools />} />
    <Route path="/myportlogin" element={<AdminLogin />} />
    
    <Route
      path="/myportadmin/dashboard"
      element={
        <AdminProtectedRoute>
          <AdminDashboard />
        </AdminProtectedRoute>
      }
    />
    <Route
      path="/myportadmin/dashboard/:contentType"
      element={
        <AdminProtectedRoute>
          <AdminContentManager />
        </AdminProtectedRoute>
      }
    />
    <Route
      path="/myportadmin/dashboard/home"
      element={
        <AdminProtectedRoute>
          <AdminHomeManager />
        </AdminProtectedRoute>
      }
    />
    <Route
      path="/myportadmin/dashboard/about"
      element={
        <AdminProtectedRoute>
          <AdminAboutManager />
        </AdminProtectedRoute>
      }
    />
    <Route
      path="/myportadmin/dashboard/experience"
      element={
        <AdminProtectedRoute>
          <AdminExperienceManager />
        </AdminProtectedRoute>
      }
    />
    <Route
      path="/myportadmin/dashboard/tools"
      element={
        <AdminProtectedRoute>
          <AdminToolsManager />
        </AdminProtectedRoute>
      }
    />
    <Route
      path="/myportadmin/dashboard/apps"
      element={
        <AdminProtectedRoute>
          <AdminAppsManager />
        </AdminProtectedRoute>
      }
    />
    <Route
      path="/myportadmin/dashboard/projects"
      element={
        <AdminProtectedRoute>
          <AdminProjectsManager />
        </AdminProtectedRoute>
      }
    />
    <Route
      path="/myportadmin/dashboard/blogs"
      element={
        <AdminProtectedRoute>
          <AdminBlogManager />
        </AdminProtectedRoute>
      }
    />
    <Route
      path="/myportadmin/dashboard/contact"
      element={
        <AdminProtectedRoute>
          <AdminContactManager />
        </AdminProtectedRoute>
      }
    />
    <Route
      path="/myportadmin/dashboard/contact-manager"
      element={
        <AdminProtectedRoute>
          <AdminContactManager />
        </AdminProtectedRoute>
      }
    />
    <Route
      path="/myportadmin/dashboard/clientsMessages"
      element={
        <AdminProtectedRoute>
          <AdminClientsMessages />
        </AdminProtectedRoute>
      }
    />
    <Route path="*" element={<NotFound />} />
  </Routes>
</BrowserRouter>

        
        {effectsEnabled && (
          <div
            style={{
              pointerEvents: "none",
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 5,
            }}
          >
            <InteractiveBackground />
            <FluidCursor />
          </div>
        )}
        
        <EffectsToggle onToggle={setEffectsEnabled} />
      </InteractiveEffectsProvider>
    </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
