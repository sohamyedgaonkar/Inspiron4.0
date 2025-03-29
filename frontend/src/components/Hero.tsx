import { memo, useEffect } from "react";
import { ArrowRight, LogIn, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface HeroProps {
  setHideNav?: (hide: boolean) => void;
}

const Hero = memo(({ setHideNav }: HeroProps) => {
  useEffect(() => {
    if (setHideNav) setHideNav(true);
    return () => {
      if (setHideNav) setHideNav(false);
    };
  }, [setHideNav]);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" aria-label="Hero Section">
      <div 
        className="fixed inset-0 -z-10 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] bg-fixed"
        style={{ transform: 'translateY(-4rem)' }}
        aria-hidden="true"
      ></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-up [animation-fill-mode:both]">
        <div className="text-center space-y-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Hello, Welcome to
            <span className="text-primary block">CogniLearn</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-muted-foreground">
            Transform your learning journey with personalized quizzes, research assistance, and intelligent performance tracking.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="group transition-colors">
              <Link to="/auth?mode=signup" aria-label="Create Account">
                <UserPlus className="mr-2 h-5 w-5" aria-hidden="true" />
                Create Account
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="transition-colors">
              <Link to="/auth?mode=signin" aria-label="Sign In">
                <LogIn className="mr-2 h-5 w-5" aria-hidden="true" />
                Sign In
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
});

Hero.displayName = "Hero";

export default Hero;
