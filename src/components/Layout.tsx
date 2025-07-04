
import { ReactNode } from "react";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background text-foreground flex transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 lg:ml-72">
        {children}
      </main>
    </div>
  );
};

export default Layout;
