
import { ReactNode } from "react";
import ResponsiveNavbar from "./ResponsiveNavbar";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background text-foreground flex transition-colors duration-300">
      <ResponsiveNavbar />
      <main className="flex-1 md:ml-16 lg:ml-56 transition-all duration-300">
        <div className="p-6 pt-20 md:pt-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
