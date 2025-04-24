
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  BarChart, 
  ChevronDown, 
  CircleUser, 
  Home, 
  MenuIcon, 
  Moon,
  PieChart, 
  Settings, 
  Sun,
  User, 
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./ThemeProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AppHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navItems = [
    { title: "Dashboard", path: "/", icon: <Home className="h-4 w-4" /> },
    { title: "Members", path: "/members", icon: <User className="h-4 w-4" /> },
    { title: "Analytics", path: "/analytics", icon: <PieChart className="h-4 w-4" /> },
    { title: "Reports", path: "/reports", icon: <BarChart className="h-4 w-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-background border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gym-blue to-gym-lightblue flex items-center justify-center">
              <span className="text-white font-bold text-sm">GP</span>
            </div>
            <span className="hidden md:inline-block font-semibold text-xl">
              GymPulse
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.title}
                to={item.path}
                className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.icon}
                <span className="ml-1">{item.title}</span>
              </Link>
            ))}
          </nav>

          {/* User actions */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="mr-2"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hidden md:flex items-center">
                  <CircleUser className="h-5 w-5 mr-2" />
                  Admin
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link to="/profile" className="flex items-center w-full">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/settings" className="flex items-center w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu toggle */}
            <Button
              variant="outline"
              size="icon"
              className="md:hidden"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <MenuIcon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container mx-auto px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.title}
                to={item.path}
                className="flex items-center rounded-md py-2 px-3 text-sm font-medium hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.icon}
                <span className="ml-3">{item.title}</span>
              </Link>
            ))}
            <div className="border-t my-2 pt-2">
              <Link
                to="/profile"
                className="flex items-center rounded-md py-2 px-3 text-sm font-medium hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="h-4 w-4" />
                <span className="ml-3">Profile</span>
              </Link>
              <Link
                to="/settings"
                className="flex items-center rounded-md py-2 px-3 text-sm font-medium hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Settings className="h-4 w-4" />
                <span className="ml-3">Settings</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default AppHeader;
