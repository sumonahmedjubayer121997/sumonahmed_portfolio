
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Experience from "./pages/Experience";
import Apps from "./pages/Apps";
import AppDetail from "./pages/AppDetail";
import Projects from "./pages/Projects";
import Blogs from "./pages/Blogs";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Tools from "./pages/Tools";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminContentManager from "./pages/AdminContentManager";
import AdminHomeManager from "./pages/AdminHomeManager";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import InteractiveBackground from "./components/InteractiveBackground";
import FluidCursor from "./components/FluidCursor";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <div style={{ zIndex: 10 }}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/experience" element={<Experience />} />
            <Route path="/apps" element={<Apps />} />
            <Route path="/apps/:appName" element={<AppDetail />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/tools" element={<Tools />} />
            
            {/* Admin Routes */}
            <Route path="/myportadmin/login" element={<AdminLogin />} />
            <Route 
              path="/myportadmin/dashboard" 
              element={
                <AdminProtectedRoute>
                  <AdminDashboard />
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
              path="/myportadmin/dashboard/:pageType" 
              element={
                <AdminProtectedRoute>
                  <AdminContentManager />
                </AdminProtectedRoute>
              } 
            />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </div>
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
  </QueryClientProvider>
);

export default App;
