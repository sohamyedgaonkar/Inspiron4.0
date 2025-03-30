import { Card } from "@/components/ui/card";
import HackathonAlert from "@/components/dashboard/HackathonAlert";
import BuddySystem from "@/components/dashboard/BuddySystem";
import CourseProgress from "@/components/dashboard/CourseProgress";
import QuizModel from "@/components/dashboard/QuizModel";
import Navigation from "@/components/Navigation";

const Performance = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 pt-20 pb-8 space-y-6">
        <HackathonAlert />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BuddySystem />
          <CourseProgress />
          <QuizModel />
          
          {/* Additional feature cards can be added here */}
          <Card className="w-full bg-black/50 border-border/50 p-6">
            <h3 className="text-xl font-semibold mb-4">Additional Features</h3>
            <p className="text-muted-foreground">Coming soon...</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Performance;