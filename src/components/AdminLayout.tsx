
import { ReactNode } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Button } from "@/components/ui/button";
import { LogOut, Home, User, Briefcase, FolderOpen, BookOpen, Info, Mail } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { logout } = useAdminAuth();
  const location = useLocation();

  const menuItems = [
    { path: "/myportadmin/dashboard", label: "Dashboard", icon: Home },
    { path: "/myportadmin/dashboard/home", label: "Home", icon: Home },
    { path: "/myportadmin/dashboard/experience", label: "Experience", icon: User },
    { path: "/myportadmin/dashboard/apps", label: "Apps", icon: Briefcase },
    { path: "/myportadmin/dashboard/projects", label: "Projects", icon: FolderOpen },
    { path: "/myportladmin/dashboard/blogs", label: "Blogs", icon: BookOpen },
    { path: "/myportladmin/dashboard/about", label: "About", icon: Info },
    { path: "/myportadmin/dashboard/contact", label: "Contact", icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-64 bg-white shadow-md">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
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
                    className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <Button onClick={logout} variant="outline" className="w-full">
            <LogOut size={16} className="mr-2" />
            Logout
          </Button>
        </div>
      </div>
      <div className="flex-1 p-8">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
