
import { ReactNode } from "react";
import AppHeader from "./AppHeader";
import { useTheme } from "./ThemeProvider";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
      <AppHeader />
      <main className={`flex-1 ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="container mx-auto px-4 py-6 md:py-8">{children}</div>
      </main>
      <footer className={`${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white"} border-t py-4`}>
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} GymPulse Analytics. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
