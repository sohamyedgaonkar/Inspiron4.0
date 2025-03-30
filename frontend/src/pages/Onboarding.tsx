import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { OnboardingQuestions } from "@/components/onboarding/OnboardingQuestions";
import { useQuery, useQueryClient } from "@tanstack/react-query"; // Added useQueryClient

const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient(); // Initialize queryClient

  // Fetch session details
  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
    staleTime: 60000, // Cache for 1 min
    // cacheTime: 300000, // Store for 5 min
  });

  // Fetch onboarding status
  const { data: onboardingStatus, isLoading: statusLoading } = useQuery({
    queryKey: ["onboardingStatus", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) throw new Error("No user found");

      const { data, error } = await supabase
        .from("onboarding_status")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
    staleTime: 60000,
    // cacheTime: 300000,
    retry: false,
  });

  // Redirect if onboarding is completed or user is not logged in
  useEffect(() => {
    if (!session) {
      navigate("/auth");
    } else if (onboardingStatus?.is_completed) {
      navigate("/dashboard");
    }
  }, [session, onboardingStatus, navigate]);

  // Memoized submit handler
  // Add prefetching for better performance
  // Fix the fetchDashboardData function
  const fetchDashboardData = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  };

  useEffect(() => {
    if (session?.user?.id) {
      queryClient.prefetchQuery({
        queryKey: ['dashboard', session.user.id],
        queryFn: () => fetchDashboardData(session.user.id)
      });
    }
  }, [session?.user?.id, queryClient]);

  // Optimize data submission with validation
  const handleSubmit = useCallback(async (answers: Record<string, any>) => {
    try {
      if (!session?.user) throw new Error("No user found");

      // Validate required fields
      const requiredFields = ['learning_goals', 'experience_level'];
      const missingFields = requiredFields.filter(field => !answers[field]?.length);
      if (missingFields.length) {
        throw new Error(`Please complete all required fields: ${missingFields.join(', ')}`);
      }

      // Insert onboarding responses
      const { error: responseError } = await supabase
        .from('onboarding_responses')
        .insert({
          user_id: session.user.id,
          learning_goals: answers.learning_goals || [],
          programming_interests: answers.programming_interests || [],
          learning_style: answers.learning_style || [],
          daily_time: answers.daily_time || "",
          experience_level: answers.experience_level || "",
          completed_at: new Date().toISOString(),
        });

      if (responseError) throw responseError;

      // Update onboarding status
      const { error: statusError } = await supabase
        .from('onboarding_status')
        .update({ 
          is_completed: true,
          completed_at: new Date().toISOString()
        })
        .eq('user_id', session.user.id);

      if (statusError) throw statusError;

      // Invalidate relevant queries
      await queryClient.invalidateQueries({ queryKey: ['onboardingStatus'] });
      
      toast({
        title: "Success",
        description: "Your preferences have been saved. Welcome to CogniLearn!",
      });

      navigate("/dashboard");
    } catch (error: any) {
      console.error("Onboarding error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to complete onboarding",
        variant: "destructive",
      });
    }
  }, [session, queryClient, toast, navigate]);

  // Show loading state
  if (statusLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  // Prevent double rendering of onboarding questions
  if (!session || onboardingStatus?.is_completed) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-2xl p-8 space-y-6 animate-fade-up glass rounded-lg">
        <OnboardingQuestions onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default Onboarding;
