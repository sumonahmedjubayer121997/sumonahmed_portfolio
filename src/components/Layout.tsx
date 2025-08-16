import { ReactNode } from "react";
import ResponsiveNavbar from "./ResponsiveNavbar";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-transparent text-gray-900 flex flex-col transition-colors duration-300 content-wrapper">
      <ResponsiveNavbar />
      <main className="flex-1 ml-0 md:ml-72 transition-all duration-300 pt-16 md:pt-0">
        <div className="p-4 md:p-6 lg:p-2">{children}</div>
      </main>
      <div className="ml-0 md:ml-72 transition-all duration-300">
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
