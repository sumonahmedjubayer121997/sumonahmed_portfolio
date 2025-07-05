
import { ReactNode } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Button } from "@/components/ui/button";
import { LogOut, Home, User, Briefcase, FolderOpen, BookOpen, Info, Mail, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { logout, user } = useAdminAuth();
  const location = useLocation();

  const menuItems = [
    { path: "/myportadmin/dashboard", label: "Dashboard", icon: Home },
    { path: "/myportadmin/dashboard/home", label: "Home", icon: Home },
    { path: "/myportadmin/dashboard/experience", label: "Experience", icon: User },
    { path: "/myportadmin/dashboard/apps", label: "Apps", icon: Briefcase },
    { path: "/myportadmin/dashboard/projects", label: "Projects", icon: FolderOpen },
    { path: "/myportadmin/dashboard/blogs", label: "Blogs", icon: BookOpen },
    { path: "/myportadmin/dashboard/about", label: "About", icon: Info },
    { path: "/myportadmin/dashboard/contact", label: "Contact", icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Menu className="h-6 w-6 text-gray-600 md:hidden" />
            <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-3">
                <div className="text-sm text-gray-600">
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
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md h-[calc(100vh-73px)] overflow-y-auto">
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

        {/* Main Content */}
        <main className="flex-1 p-8 h-[calc(100vh-73px)] overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
