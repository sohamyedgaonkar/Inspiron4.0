import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import CourseProgress from "@/components/dashboard/CourseProgress";
import QuizModel from "@/components/dashboard/QuizModel";

const CourseProgressPage = () => {
  const navigate = useNavigate();
  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  useEffect(() => {
    if (!session) {
      navigate("/auth");
    }
  }, [session, navigate]);

  if (!session) return null;

  return (
    <div className="min-h-screen p-6 mt-20 animate-fade-up">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Learning Progress</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card rounded-lg shadow-xl p-6">
            <CourseProgress />
          </div>
          <div className="bg-card rounded-lg shadow-xl p-6">
            <QuizModel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseProgressPage;