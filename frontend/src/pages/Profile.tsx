import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Bell,
  BookOpen,
  LogOut,
  Trophy,
  UserRound,
  ChartBar,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
  city: string | null;
  subjects_of_interest: string[] | null;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  badge_url: string | null;
  earned_at: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("basic-info");

  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  const { data: profile, isLoading: profileLoading, error: profileError } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }

      if (!data) {
        throw new Error("Profile not found");
      }

      return data as Profile;
    },
    enabled: !!session?.user?.id,
    retry: false,
  });

  const { data: achievements, isLoading: achievementsLoading, error: achievementsError } = useQuery({
    queryKey: ["achievements"],
    queryFn: async () => {
      if (!profile?.id) throw new Error("No profile found");

      const { data, error } = await supabase
        .from("achievements")
        .select("*")
        .eq("user_id", profile.id);

      if (error) {
        console.error('Error fetching achievements:', error);
        throw error;
      }

      return data as Achievement[];
    },
    enabled: !!profile?.id,
    retry: false,
  });

  useEffect(() => {
    if (!session) {
      navigate('/auth');
    }
  }, [session, navigate]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/auth");
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (profileLoading || achievementsLoading) {
    return <div>Loading...</div>;
  }

  if (profileError || achievementsError) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="glass">
          <CardContent className="p-6">
            <p className="text-center text-red-500">
              {profileError?.message || achievementsError?.message || "An error occurred. Please try refreshing the page."}
            </p>
            <Button
              variant="destructive"
              className="w-full mt-4"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout and Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <Card className="w-full lg:w-64 h-fit glass">
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profile?.avatar_url || ""} />
                <AvatarFallback>
                  {profile?.full_name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h2 className="text-xl font-semibold">{profile?.full_name}</h2>
                <p className="text-sm text-muted-foreground">@{profile?.username}</p>
              </div>
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="flex-1">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start">
              <TabsTrigger value="basic-info">
                <UserRound className="mr-2 h-4 w-4" />
                Basic Info
              </TabsTrigger>
              <TabsTrigger value="courses">
                <BookOpen className="mr-2 h-4 w-4" />
                Courses
              </TabsTrigger>
              <TabsTrigger value="achievements">
                <Trophy className="mr-2 h-4 w-4" />
                Achievements
              </TabsTrigger>
              <TabsTrigger value="performance">
                <ChartBar className="mr-2 h-4 w-4" />
                Performance
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic-info" className="space-y-4">
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Full Name</label>
                      <p className="text-muted-foreground">{profile?.full_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Username</label>
                      <p className="text-muted-foreground">@{profile?.username}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Location</label>
                      <p className="text-muted-foreground">{profile?.city || "Not specified"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Interests</label>
                      <p className="text-muted-foreground">
                        {profile?.subjects_of_interest?.join(", ") || "None specified"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-4">
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Achievements & Badges</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {achievements?.map((achievement) => (
                      <Card key={achievement.id} className="glass">
                        <CardHeader>
                          <CardTitle className="text-lg">{achievement.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            {achievement.description}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Earned on{" "}
                            {new Date(achievement.earned_at).toLocaleDateString()}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="courses">
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Course Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance">
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Performance Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;