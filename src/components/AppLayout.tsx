
import { ReactNode } from "react";
import AppHeader from "./AppHeader";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-6 md:py-8">{children}</div>
      </main>
      <footer className="bg-white border-t py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} GymPulse Analytics. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
