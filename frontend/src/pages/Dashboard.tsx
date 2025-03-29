import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import HackathonAlert from "@/components/dashboard/HackathonAlert";
import BuddySystem from "@/components/dashboard/BuddySystem";
import CourseProgress from "@/components/dashboard/CourseProgress";
import QuizModel from "@/components/dashboard/QuizModel";
import CareerProgress from "@/components/dashboard/CareerProgress";

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
  if (!session || !onboardingStatus?.is_completed) {
    return null;
  }

  return (
    <div className="min-h-screen p-6 animate-fade-up bg-gradient-to-b from-background to-background/80">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {session?.user?.user_metadata?.full_name || 'Learner'}
          </h1>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Alerts Section */}
        <div className="animate-fade-right">
          <HackathonAlert />
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
          {/* Background Decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 rounded-xl -z-10" />
          
          {/* Learning Progress Section */}
          <div className="space-y-8 animate-fade-up delay-100 p-4 hover:scale-[1.02] transition-transform duration-300">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-primary/20 rounded-xl blur-sm" />
              <div className="relative bg-card rounded-lg shadow-xl">
                <CourseProgress />
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl blur-sm" />
              <div className="relative bg-card rounded-lg shadow-xl">
                <QuizModel />
              </div>
            </div>
          </div>

          {/* Community & Career Section */}
          <div className="space-y-8 animate-fade-up delay-200 p-4 hover:scale-[1.02] transition-transform duration-300">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-primary/20 rounded-xl blur-sm" />
              <div className="relative bg-card rounded-lg shadow-xl">
                <BuddySystem />
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl blur-sm" />
              <div className="relative bg-card rounded-lg shadow-xl">
                <CareerProgress />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
