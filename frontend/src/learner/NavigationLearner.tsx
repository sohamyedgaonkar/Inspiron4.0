import { useState } from "react";
import { Menu, X, User, LayoutDashboard, BookOpen, BrainCircuit, NotebookPen, GitBranch, FileCheck, Map } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const NavigationLearner = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { 
      name: "Dashboard", 
      path: "/learn/dashboard", 
      icon: <LayoutDashboard className="h-4 w-4" /> 
    },
    { 
      name: "Courses", 
      path: "/learn/course", // Updated path
      icon: <BookOpen className="h-4 w-4" /> 
    },
    { 
      name: "Notes", 
      path: "/learn/notes", // Updated path
      icon: <NotebookPen className="h-4 w-4" /> 
    }, 
    { 
      name: "Student Roadmap", 
      path: "/learn/studentroadmap", // Updated path
      icon: <NotebookPen className="h-4 w-4" /> 
    },
    { 
      name: "Profile", 
      path: "/learn/profile", // Updated path
      icon: <User className="h-4 w-4" /> 
    },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link 
              to="/learner/dashboard" 
              className="text-xl font-semibold hover:text-primary transition-colors"
            >
              CogniLearn
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-white/10 hover:text-white flex items-center gap-2",
                    location.pathname === item.path && "bg-white/10 text-white"
                  )}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-white/10 hover:text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black/80 backdrop-blur-sm">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium hover:bg-white/10 hover:text-white",
                  location.pathname === item.path && "bg-white/10 text-white"
                )}
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavigationLearner;