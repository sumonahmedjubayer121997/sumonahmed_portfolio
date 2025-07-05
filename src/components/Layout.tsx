
import { ReactNode } from "react";
import ResponsiveNavbar from "./ResponsiveNavbar";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-transparent text-gray-900 flex transition-colors duration-300">
      <ResponsiveNavbar />
      <main className="flex-1 ml-0 md:ml-72 transition-all duration-300 pt-16 md:pt-0">
        <div className="p-4 md:p-6 lg:p-6">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
