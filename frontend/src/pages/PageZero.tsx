import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  BookOpen, 
  NotebookPen, 
  User, 
  Microscope, 
  FileCheck, 
  GitBranch,
  BrainCircuit,
  Map
} from "lucide-react";

const FeatureCard = ({ 
  title, 
  description, 
  icon: Icon, 
  index,
  path 
}: { 
  title: string; 
  description: string; 
  icon: React.ComponentType<{ className?: string }>; 
  index: number;
  path: string;
}) => {
  const navigate = useNavigate();
  
  return (
    <div 
      className="group relative p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-lg hover:shadow-purple-500/20 transition-all duration-500 hover:-translate-y-2 cursor-pointer"
      style={{ animationDelay: `${index * 0.1}s` }}
      onClick={() => navigate(path)}
    >
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-lg bg-indigo-500/20 text-indigo-300 group-hover:bg-indigo-400/30 group-hover:text-indigo-200 transition-colors">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="mt-2 text-gray-300">{description}</p>
        </div>
      </div>
    </div>
  );
};

const PageZero = () => {
  const navigate = useNavigate();

  const learnerFeatures = [
    {
      title: "Dashboard",
      description: "Your personalized learning hub with progress tracking.",
      icon: LayoutDashboard,
      path: "/learn/dashboard"
    },
    {
      title: "Courses",
      description: "Explore and enroll in curated learning paths.",
      icon: BookOpen,
      path: "/learn/course"
    },
    {
      title: "Notes",
      description: "Organize and access your learning materials.",
      icon: NotebookPen,
      path: "/learn/notes"
    },
    {
      title: "Student Roadmap",
      description: "Visualize your learning journey and milestones.",
      icon: Map,
      path: "/learn/studentroadmap"
    },
    {
      title: "AI Tutor",
      description: "Get personalized explanations and guidance.",
      icon: BrainCircuit,
      path: "/learn/aitutor"
    },
    {
      title: "Profile",
      description: "Manage your account and learning preferences.",
      icon: User,
      path: "/learn/profile"
    }
  ];

  const profileFeatures = [
    {
      title: "Research Papers",
      description: "Analyze academic papers with AI-powered insights.",
      icon: Microscope,
      path: "/researchpaper"
    },
    {
      title: "ATS Check",
      description: "Optimize your resume for applicant tracking systems.",
      icon: FileCheck,
      path: "/ats"
    },
    {
      title: "GitHub Analyzer",
      description: "Get feedback on your coding repositories.",
      icon: GitBranch,
      path: "/githubchat"
    },
    {
      title: "Notes",
      description: "Centralized place for all your learning notes.",
      icon: NotebookPen,
      path: "/notes"
    },
    {
      title: "Career Path",
      description: "Personalized recommendations for your development.",
      icon: Map,
      path: "/career"
    },
    {
      title: "Profile",
      description: "Update your skills and professional details.",
      icon: User,
      path: "/profile"
    }
  ];

  return (
    <div 
      className="relative min-h-screen flex flex-col items-center px-4 py-8 sm:px-6 sm:py-12 text-white overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-indigo-900/20 blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full bg-purple-900/20 blur-3xl animate-float"></div>
      </div>

      {/* Page Title */}
      <header className="text-center mb-10 sm:mb-14 relative z-10">
        <h1 className="text-4xl sm:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-400 mb-4 leading-tight tracking-tight">
          Welcome to CogniLearn
        </h1>
        <p className="text-gray-300/90 text-lg sm:text-xl max-w-lg mx-auto font-light tracking-wide">
          Choose your path to start learning or manage your professional profile.
        </p>
      </header>

      {/* Main Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 w-full max-w-6xl px-4 relative z-10">
        {/* Learning Card */}
        <Card className="bg-gray-900/70 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-2xl hover:shadow-indigo-500/20 transition-all duration-500 hover:-translate-y-2 group">
          <CardHeader className="p-6">
            <CardTitle className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300 group-hover:from-indigo-200 group-hover:to-purple-200 transition-colors duration-300">
              Learning Portal
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <ul className="list-none space-y-3 text-gray-300/90 text-base sm:text-lg font-light">
              <li className="flex items-start">
                <span className="text-indigo-400 mr-2 mt-1">✦</span>
                <span>Interactive courses with adaptive learning</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-400 mr-2 mt-1">✦</span>
                <span>Track progress with detailed analytics</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-400 mr-2 mt-1">✦</span>
                <span>AI-powered tutoring and guidance</span>
              </li>
            </ul>
            <Button
              className="mt-6 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white w-full py-4 rounded-xl text-lg font-medium tracking-wide transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/30"
              onClick={() => navigate("/learn/dashboard")}
            >
              Enter Learning Portal
            </Button>
          </CardContent>
        </Card>

        {/* Profile Management Card */}
        <Card className="bg-gray-900/70 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:-translate-y-2 group">
          <CardHeader className="p-6">
            <CardTitle className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300 group-hover:from-indigo-200 group-hover:to-purple-200 transition-colors duration-300">
              Profile Tools
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <ul className="list-none space-y-3 text-gray-300/90 text-base sm:text-lg font-light">
              <li className="flex items-start">
                <span className="text-purple-400 mr-2 mt-1">✦</span>
                <span>Research paper analysis and insights</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2 mt-1">✦</span>
                <span>ATS resume optimization</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2 mt-1">✦</span>
                <span>GitHub repository analysis</span>
              </li>
            </ul>
            <Button
              className="mt-6 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white w-full py-4 rounded-xl text-lg font-medium tracking-wide transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30"
              onClick={() => navigate("/dashboard")}
            >
              Access Profile Tools
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Features Sections */}
      <div className="w-full max-w-6xl px-4 mt-20 relative z-10">
        {/* Learner Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-300">
            Learning Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learnerFeatures.map((feature, index) => (
              <FeatureCard 
                key={`learner-${feature.title}`}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                index={index}
                path={feature.path}
              />
            ))}
          </div>
        </div>

        {/* Profile Features */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-300">
            Profile Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profileFeatures.map((feature, index) => (
              <FeatureCard 
                key={`profile-${feature.title}`}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                index={index}
                path={feature.path}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="mt-16 text-center text-gray-400/80 text-base relative z-10">
        <p>Need help? <a href="/support" className="text-indigo-300 hover:text-indigo-200 underline underline-offset-4 transition-colors duration-200 font-medium">Contact Support</a></p>
      </footer>
    </div>
  );
};

export default PageZero;