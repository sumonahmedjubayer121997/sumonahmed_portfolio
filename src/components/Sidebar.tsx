
import { NavLink } from "react-router-dom";
import { Home, Briefcase, Smartphone, FolderOpen, BookOpen, User, Mail, Wrench } from "lucide-react";

const Sidebar = () => {
  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Experience", path: "/experience", icon: Briefcase },
    { name: "Apps", path: "/apps", icon: Smartphone },
    { name: "Projects", path: "/projects", icon: FolderOpen },
    { name: "Blogs", path: "/blogs", icon: BookOpen },
    { name: "About", path: "/about", icon: User },
    { name: "Contact", path: "/contact", icon: Mail },
    { name: "Tools", path: "/tools", icon: Wrench },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 h-full w-80 bg-white border-r border-gray-100 z-40">
        <div className="p-8 flex flex-col h-full">
          {/* Profile Section */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 mx-auto mb-4 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">A</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Aman</h2>
            <p className="text-sm text-gray-600">Pro | AI Product Engineer</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    end={item.path === "/"}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${
                        isActive
                          ? "bg-gray-900 text-white"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }`
                    }
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    <span className="font-medium">{item.name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Connect Section */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Connect</h3>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
            >
              <svg
                className="w-4 h-4 mr-3"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span className="text-sm">X (Twitter)</span>
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">A</span>
            </div>
            <span className="ml-3 font-semibold text-gray-900">Aman</span>
          </div>
          <nav className="flex space-x-1">
            {navItems.slice(0, 4).map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `p-2 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? "bg-gray-900 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
