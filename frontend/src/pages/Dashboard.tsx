import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout, Microscope, FileCheck, FileText, User, GitBranch, Map, BookOpen, Rocket, ChevronRight, Video, Award } from "lucide-react";
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

  // Fetch user profile data
  const { data: profile } = useQuery({
    queryKey: ["profile", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle();
      return data;
    },
    enabled: !!session?.user?.id,
  });

  // Fetch course progress data
  const { data: courseProgress } = useQuery({
    queryKey: ["courseProgress", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const { data } = await supabase
        .from("course_progress")
        .select("*")
        .eq("user_id", session.user.id);
      return data;
    },
    enabled: !!session?.user?.id,
  });

  // Fetch notes count
  const { data: notesCount } = useQuery({
    queryKey: ["notesCount", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return 0;
      const { count } = await supabase
        .from("notes")
        .select("*", { count: "exact", head: true })
        .eq("user_id", session.user.id);
      return count;
    },
    enabled: !!session?.user?.id,
  });

  // Fetch achievements
  const { data: achievements } = useQuery({
    queryKey: ["achievements", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const { data } = await supabase
        .from("achievements")
        .select("*")
        .eq("user_id", session.user.id);
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

  const features = [
    {
      icon: <Microscope className="w-6 h-6 text-blue-500" />,
      title: "Research Papers",
      description: "Analyze academic papers with AI-powered insights and summaries.",
      path: "/research-papers",
      color: "bg-blue-500/10"
    },
    {
      icon: <Video className="w-6 h-6 text-green-500" />,
      title: "Courses",
      description: "Continue your learning with personalized courses.",
      path: "/courses",
      color: "bg-green-500/10"
    },
    {
      icon: <FileText className="w-6 h-6 text-purple-500" />,
      title: "Notes",
      description: `View and edit your ${notesCount || 0} notes.`,
      path: "/notes",
      color: "bg-purple-500/10"
    },
    {
      icon: <Award className="w-6 h-6 text-yellow-500" />,
      title: "Achievements",
      description: `You have ${achievements?.length || 0} achievements.`,
      path: "/achievements",
      color: "bg-yellow-500/10"
    },
    {
      icon: <User className="w-6 h-6 text-pink-500" />,
      title: "Profile",
      description: "Manage your account and learning preferences.",
      path: "/profile",
      color: "bg-pink-500/10"
    },
    {
      icon: <Map className="w-6 h-6 text-indigo-500" />,
      title: "Learning Path",
      description: "Personalized roadmap for your educational journey.",
      path: "/learning-path",
      color: "bg-indigo-500/10"
    }
  ];

  const completedCourses = courseProgress?.filter(course => course.completed).length || 0;
  const inProgressCourses = courseProgress?.filter(course => !course.completed).length || 0;

  if (!session || !onboardingStatus?.is_completed) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black pt-20 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome back, {profile?.full_name || session?.user?.user_metadata?.full_name || 'Learner'}!
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {profile?.subjects_of_interest?.length ? 
              `Your interests: ${profile.subjects_of_interest.join(', ')}` : 
              'Your personalized learning hub with powerful tools to accelerate your growth.'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-purple-900/50 to-purple-500/20 p-6 rounded-xl border border-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-300">Completed Courses</p>
                <h3 className="text-2xl font-bold text-white mt-1">{completedCourses}</h3>
              </div>
              <div className="p-3 rounded-lg bg-purple-500/20">
                <BookOpen className="h-6 w-6 text-purple-300" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-900/50 to-blue-500/20 p-6 rounded-xl border border-blue-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-300">Courses In Progress</p>
                <h3 className="text-2xl font-bold text-white mt-1">{inProgressCourses}</h3>
              </div>
              <div className="p-3 rounded-lg bg-blue-500/20">
                <Video className="h-6 w-6 text-blue-300" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-900/50 to-green-500/20 p-6 rounded-xl border border-green-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-300">Notes</p>
                <h3 className="text-2xl font-bold text-white mt-1">{notesCount || 0}</h3>
              </div>
              <div className="p-3 rounded-lg bg-green-500/20">
                <FileText className="h-6 w-6 text-green-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Rocket className="h-6 w-6 text-purple-400 mr-2" />
            Quick Access
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`p-6 rounded-xl border border-white/10 hover:border-white/20 transition-all ${feature.color} hover:scale-[1.02] transform transition-transform cursor-pointer`}
                onClick={() => navigate(feature.path)}
              >
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-lg bg-black/30 mb-4">
                    {feature.icon}
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-900/50 rounded-xl border border-white/10 p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {courseProgress?.slice(0, 3).map((progress, index) => (
              <div key={index} className="flex items-center p-4 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors">
                <div className="p-3 rounded-lg bg-purple-500/20 mr-4">
                  {progress.completed ? (
                    <Award className="h-5 w-5 text-purple-400" />
                  ) : (
                    <Video className="h-5 w-5 text-purple-400" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-white">
                    {progress.completed ? 'Completed' : 'Watched'} video: {progress.video_id}
                  </h4>
                  <p className="text-sm text-gray-400">
                    {new Date(progress.updated_at).toLocaleString()}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            ))}
            {(!courseProgress || courseProgress.length === 0) && (
              <p className="text-gray-400 text-center py-4">No recent activity found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;