/*

// CareerProgress.tsx this is well fuctioning code but i real time fetching data from supabase so i commented it out

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const CareerProgress = () => {
  const [progress, setProgress] = useState(0);
  const [careerGoal, setCareerGoal] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchCareerGoal = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) throw new Error("No user found");

        const { data, error } = await supabase
          .from('onboarding_responses')
          .select('learning_goals')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;

        // Set career goal from learning goals
        if (data?.learning_goals?.length > 0) {
          setCareerGoal(data.learning_goals[0]);
          // Calculate mock progress (you can modify this logic)
          setProgress(Math.floor(Math.random() * 100));
        }
      } catch (error: any) {
        console.error("Error fetching career goal:", error);
        toast({
          title: "Error",
          description: "Failed to load career progress",
          variant: "destructive",
        });
      }
    };

    fetchCareerGoal();
  }, [toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Career Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Current Goal</h3>
            <p className="text-muted-foreground">{careerGoal || "No goal set"}</p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Progress</h3>
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">{progress}% Complete</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CareerProgress;
*/

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const CareerProgress = () => {
  const [progress, setProgress] = useState(0);
  const [careerGoal, setCareerGoal] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchCareerGoal = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) throw new Error("No user found");

        const { data, error } = await supabase
          .from('onboarding_responses')
          .select('learning_goals')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;

        // Set career goal from learning goals
        if (data?.learning_goals?.length > 0) {
          setCareerGoal(data.learning_goals[0]);
          // Calculate mock progress (you can modify this logic)
          setProgress(Math.floor(Math.random() * 100));
        }
      } catch (error: any) {
        console.error("Error fetching career goal:", error);
        toast({
          title: "Error",
          description: "Failed to load career progress",
          variant: "destructive",
        });
      }
    };

    fetchCareerGoal();
  }, [toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Career Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Current Goal</h3>
            <p className="text-muted-foreground">{careerGoal || "No goal set"}</p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Progress</h3>
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">{progress}% Complete</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CareerProgress;