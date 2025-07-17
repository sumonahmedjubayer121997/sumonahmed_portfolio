
import { ReactNode, useState } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Button } from "@/components/ui/button";
import { LogOut, Home, User, Briefcase, FolderOpen, BookOpen, Info, Mail, Menu, X, HomeIcon, MessageSquare, Wrench } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { logout, user } = useAdminAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { path: "/myportadmin/dashboard", label: "Dashboard", icon: Home },
    { path: "/myportadmin/dashboard/home", label: "Home", icon: Home },
    { path: "/myportadmin/dashboard/experience", label: "Experience", icon: User },
    { path: "/myportadmin/dashboard/apps", label: "Apps", icon: Briefcase },
    { path: "/myportadmin/dashboard/projects", label: "Projects", icon: FolderOpen },
    { path: "/myportadmin/dashboard/blogs", label: "Blogs", icon: BookOpen },
    { path: "/myportadmin/dashboard/about", label: "About", icon: Info },
    { path: "/myportadmin/dashboard/tools", label: "Tools", icon: Wrench },
    { path: "/myportadmin/dashboard/contact", label: "Contact", icon: Mail },
    { path: "/myportadmin/dashboard/clientsMessages", label: "Client Messages", icon: MessageSquare },
    { path: "/myportadmin/dashboard/contact-manager", label: "Contact Manager", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen w-full bg-background text-foreground transition-colors duration-300" 
         style={{
           fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
           backgroundImage: 'linear-gradient(to right, rgba(219, 227, 235, 0.20) 1px, transparent 1px), linear-gradient(to bottom, rgba(219, 227, 235, 0.20) 1px, transparent 1px)',
           backgroundSize: '50px 50px',
           backgroundAttachment: 'fixed',
           position: 'relative'
         }}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-4">
          <button
            className="md:hidden text-gray-600"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <Link
            to="/"
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 inline-flex items-center"
            aria-label="Go to Dashboard"
          >
            <HomeIcon className="w-4 h-4 text-gray-600" />
          </Link>
          <h1 className="text-lg md:text-xl font-bold text-gray-800">Admin Panel</h1>
        </div>

        {user && (
          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-600 hidden sm:block">
              Welcome, <span className="font-medium">{user.email}</span>
            </div>
            <Button
              onClick={logout}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </Button>
          </div>
        )}
      </header>

      <div className="flex">
        {/* Sidebar (desktop) */}
        <aside className="hidden md:block w-64 bg-white shadow-md h-[calc(100vh-56px)] overflow-y-auto relative z-10">
          <nav className="p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-blue-100 text-blue-700 border-l-4 border-blue-700"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Sidebar (mobile overlay) */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 flex">
            <div className="relative w-64 bg-white shadow-lg h-full">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-semibold">Menu</h2>
                <button onClick={() => setSidebarOpen(false)}>
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>
              <nav className="p-4">
                <ul className="space-y-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <li key={item.path}>
                        <Link
                          to={item.path}
                          onClick={() => setSidebarOpen(false)}
                          className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                            isActive
                              ? "bg-blue-100 text-blue-700 border-l-4 border-blue-700"
                              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                          }`}
                        >
                          <Icon size={20} />
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>

            <div
              className="flex-1 bg-black bg-opacity-30"
              onClick={() => setSidebarOpen(false)}
            ></div>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 h-[calc(100vh-56px)] overflow-y-auto relative z-10" 
              style={{ opacity: 1, backdropFilter: 'none' }}>
          <div className="max-w-7xl mx-auto relative z-20" style={{ opacity: 1 }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
