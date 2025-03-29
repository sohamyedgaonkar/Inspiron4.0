import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthForm } from "@/components/auth/AuthForm";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async (formData: {
    email: string;
    password: string;
    confirmPassword?: string;
    username?: string;
    fullName?: string;
  }, isLogin: boolean) => {
    setLoading(true);

    try {
      if (isLogin) {
        // Sign in flow
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (signInError) {
          if (signInError.message.includes('Email not confirmed')) {
            throw new Error('Please check your email to verify your account before signing in.');
          }
          if (signInError.message.includes('Invalid login credentials')) {
            throw new Error('Invalid email or password. Please try again.');
          }
          throw signInError;
        }

        // After sign in, verify the profile exists
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error("No user found after login");
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
          throw new Error("Failed to verify user profile");
        }

        if (!profile) {
          throw new Error("Profile not found. Please try signing up first.");
        }

        // Check onboarding status
        const { data: onboardingStatus, error: onboardingError } = await supabase
          .from('onboarding_status')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (onboardingError) {
          console.error("Error fetching onboarding status:", onboardingError);
          throw new Error("Failed to verify onboarding status");
        }

        // Redirect based on onboarding status
        if (!onboardingStatus?.is_completed) {
          navigate("/onboarding");
        } else {
          navigate("/dashboard");
        }

        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
      } else {
        // Sign up flow
        const { data: { user }, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              username: formData.username,
              full_name: formData.fullName,
            },
          },
        });

        if (signUpError) {
          if (signUpError.message.toLowerCase().includes('already registered')) {
            throw new Error('This email is already registered. Please sign in instead.');
          }
          throw signUpError;
        }

        if (!user) {
          throw new Error('Failed to create account. Please try again.');
        }

        // Wait for the profile trigger to complete
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Verify profile creation
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (profileError) {
          console.error("Profile creation error:", profileError);
          throw new Error("Failed to create user profile. Please try again.");
        }

        if (!profile) {
          throw new Error("Profile creation pending. Please try signing in after a few moments.");
        }

        toast({
          title: "Account created!",
          description: "Please check your email to verify your account before signing in.",
        });
        
        // Don't navigate automatically after signup - user needs to verify email
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast({
        title: "Authentication Error",
        description: error.message || "An error occurred during authentication",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-6 animate-fade-up glass rounded-lg">
        <AuthForm onSubmit={handleAuth} loading={loading} />
      </div>
    </div>
  );
};

export default Auth;