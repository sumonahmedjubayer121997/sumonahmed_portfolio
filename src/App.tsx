import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Index from "./pages/Index";
import About from "./pages/About";
import Experience from "./pages/Experience";
import Apps from "./pages/Apps";
import AppDetail from "./pages/AppDetail";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Blogs from "./pages/Blogs";
import BlogDetail from "./pages/BlogDetail";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Tools from "./pages/Tools";
import UploadBloodDonationImage from "./pages/UploadBloodDonationImage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminContentManager from "./pages/AdminContentManager";
import AdminHomeManager from "./pages/AdminHomeManager";
import AdminAboutManager from "./pages/AdminAboutManager";
import AdminExperienceManager from "./pages/AdminExperienceManager";
import AdminToolsManager from "./pages/AdminToolsManager";
import AdminAppsManager from "./pages/AdminAppsManager";
import AdminProjectsManager from "./pages/AdminProjectsManager";
import AdminBlogManager from "./pages/AdminBlogManager";
import AdminContactManager from "./pages/AdminContactManager";
import AdminClientsMessages from "./pages/AdminClientsMessages";
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
              path="/myportadmin/dashboard/clientsMessages"
              element={
                <AdminProtectedRoute>
                  <AdminClientsMessages />
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
  );
}

export default App;
