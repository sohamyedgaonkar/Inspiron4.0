import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, BookOpen, ChartBar, FileText, Trophy, NotebookPen } from "lucide-react";

// Extracted FeatureCard component
const FeatureCard = ({ title, description, icon: Icon, index }: { title: string; description: string; icon: React.ComponentType<{ className?: string }>; index: number }) => {
  return (
    <div 
      className="group relative p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-lg hover:shadow-purple-500/20 transition-all duration-500 hover:-translate-y-2"
      style={{ animationDelay: `${index * 0.1}s` }}
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

  const features = [
    {
      title: "Quiz Generator",
      description: "Create personalized quizzes with adjustable difficulty levels.",
      icon: Brain,
    },
    {
      title: "Course Recommendations",
      description: "Get tailored suggestions based on your learning style.",
      icon: BookOpen,
    },
    {
      title: "Performance Tracking",
      description: "Monitor progress with detailed analytics and insights.",
      icon: ChartBar,
    },
    {
      title: "Research Papers",
      description: "Analyze papers with AI-powered assistance.",
      icon: FileText,
    },
    {
      title: "Achievements",
      description: "Earn badges and track learning milestones.",
      icon: Trophy,
    },
    {
      title: "Notes & Bookmarks",
      description: "Organize learning materials efficiently.",
      icon: NotebookPen,
    },
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
          I am here for
        </h1>
        <p className="text-gray-300/90 text-lg sm:text-xl max-w-lg mx-auto font-light tracking-wide">
          Choose your path to start learning or update your profile to achieve your goals.
        </p>
      </header>

      {/* Main Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 w-full max-w-6xl px-4 relative z-10">
        {/* Learning Card */}
        <Card className="bg-gray-900/70 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-2xl hover:shadow-indigo-500/20 transition-all duration-500 hover:-translate-y-2 group">
          <CardHeader className="p-6">
            <CardTitle className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300 group-hover:from-indigo-200 group-hover:to-purple-200 transition-colors duration-300">
              Learning
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <ul className="list-none space-y-3 text-gray-300/90 text-base sm:text-lg font-light">
              <li className="flex items-start">
                <span className="text-indigo-400 mr-2 mt-1">✦</span>
                <span>Explore curated courses tailored to your needs</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-400 mr-2 mt-1">✦</span>
                <span>Track your learning progress and achievements</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-400 mr-2 mt-1">✦</span>
                <span>Take quizzes to test and improve your knowledge</span>
              </li>
            </ul>
            <Button
              className="mt-6 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white w-full py-4 rounded-xl text-lg font-medium tracking-wide transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/30"
              onClick={() => navigate("/learn/dashboard")} // Updated path
            >
              Start Learning
            </Button>
          </CardContent>
        </Card>

        {/* Profile Update Card */}
        <Card className="bg-gray-900/70 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:-translate-y-2 group">
          <CardHeader className="p-6">
            <CardTitle className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300 group-hover:from-indigo-200 group-hover:to-purple-200 transition-colors duration-300">
              Profile Update
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <ul className="list-none space-y-3 text-gray-300/90 text-base sm:text-lg font-light">
              <li className="flex items-start">
                <span className="text-purple-400 mr-2 mt-1">✦</span>
                <span>Update your skills and interests</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2 mt-1">✦</span>
                <span>Set career goals and track your progress</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2 mt-1">✦</span>
                <span>Find mentors and connect with learning buddies</span>
              </li>
            </ul>
            <Button
              className="mt-6 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white w-full py-4 rounded-xl text-lg font-medium tracking-wide transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30"
              onClick={() => navigate("/dashboard")}
            >
              Update Profile
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Features Section */}
      <div className="w-full max-w-6xl px-4 mt-20 relative z-10">
        <h2 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-300">
          Powerful Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard 
              key={feature.title}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              index={index}
            />
          ))}
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