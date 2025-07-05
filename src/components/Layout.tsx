
import { ReactNode } from "react";
import ResponsiveNavbar from "./ResponsiveNavbar";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background text-foreground flex transition-all duration-300">
      <ResponsiveNavbar />
      <main className="flex-1 w-full pt-16 md:pt-0 md:ml-0 lg:ml-16 xl:ml-56 transition-all duration-300">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
