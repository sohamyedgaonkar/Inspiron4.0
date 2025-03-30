import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, Brain, Users, Trophy, Rocket, FileText, Github, ClipboardCheck, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const navigate = useNavigate();

  // Check session and onboarding status
  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  const { data: onboardingStatus } = useQuery({
    queryKey: ["onboardingStatus", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const { data } = await supabase
        .from("onboarding_status")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();
      return data;
    },
    enabled: !!session?.user?.id,
  });

  // Redirect logic
  useEffect(() => {
    if (!session) {
      navigate("/auth");
    } else if (!onboardingStatus?.is_completed) {
      navigate("/onboarding");
    }
  }, [session, onboardingStatus, navigate]);

  // Only render dashboard when authenticated and onboarding is complete
  const features = [
    {
      icon: <BookOpen className="w-6 h-6 text-purple-500" />,
      title: "Interactive Courses",
      description: "Engage with our AI-powered adaptive learning courses tailored to your pace."
    },
    {
      icon: <Brain className="w-6 h-6 text-blue-500" />,
      title: "Smart Quizzes",
      description: "Test your knowledge with dynamic quizzes that adapt to your learning progress."
    },
    {
      icon: <Users className="w-6 h-6 text-green-500" />,
      title: "Study Groups",
      description: "Connect with peers and form study groups for collaborative learning."
    },
    {
      icon: <Trophy className="w-6 h-6 text-yellow-500" />,
      title: "Achievement System",
      description: "Track your progress and earn badges as you master new skills."
    },
    {
      icon: <FileText className="text-blue-400 text-2xl" />,
      title: "Research Papers",
      description: "Access and analyze research papers with AI-powered insights and summaries."
    },
    {
      icon: <Github className="text-gray-400 text-2xl" />,
      title: "Git Repository",
      description: "Track your coding progress and get feedback on your repositories."
    },
    {
      icon: <ClipboardCheck className="text-green-400 text-2xl" />,
      title: "Learning Progress",
      description: "Monitor your learning journey with detailed analytics and insights."
    },
    {
      icon: <UserCircle className="text-purple-400 text-2xl" />,
      title: "Career Path",
      description: "Get personalized recommendations for your career development."
    }
  ];

  if (!session || !onboardingStatus?.is_completed) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-6 mt-20">
      <div className="max-w-6xl w-full space-y-8">
        {/* Welcome Section */}
        <div className="bg-gray-900 p-10 rounded-3xl shadow-2xl text-center">
          <h1 className="text-4xl font-extrabold text-white">
            Welcome back, {session?.user?.user_metadata?.full_name || 'Learner'}
          </h1>
          <p className="mt-4 text-gray-300 text-lg">
            Enhance your learning journey with AI-powered tools and personalized guidance
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="flex items-center space-x-4 p-6 bg-gray-800 rounded-lg shadow-md hover:bg-gray-800/80 transition-all"
            >
              <div className="p-3 bg-gray-700/50 rounded-lg">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                <p className="text-gray-300 mt-1">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-900 p-8 rounded-3xl shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Quick Actions</h2>
            <Rocket className="h-6 w-6 text-purple-400" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 p-6 rounded-xl font-semibold"
              onClick={() => navigate('/research')}
            >
              <FileText className="mr-2 h-5 w-5" />
              Research Papers
            </Button>
            <Button 
              className="bg-gray-500/20 hover:bg-gray-500/30 text-gray-400 p-6 rounded-xl font-semibold"
              onClick={() => navigate('/repository')}
            >
              <Github className="mr-2 h-5 w-5" />
              Git Repository
            </Button>
            <Button 
              className="bg-green-500/20 hover:bg-green-500/30 text-green-400 p-6 rounded-xl font-semibold"
              onClick={() => navigate('/progress')}
            >
              <ClipboardCheck className="mr-2 h-5 w-5" />
              View Progress
            </Button>
            <Button 
              className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 p-6 rounded-xl font-semibold"
              onClick={() => navigate('/career')}
            >
              <UserCircle className="mr-2 h-5 w-5" />
              Career Path
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
