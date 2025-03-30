// 
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
      navigate("/");
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
    <div className="min-h-screen p-6 mt-20 animate-fade-up bg-gradient-to-b from-gray-900 via-black to-gray-900">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Enhanced Sidebar */}
          <Card className="w-full lg:w-80 h-fit bg-black/60 border-white/10 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex flex-col items-center space-y-6">
                <div className="relative group">
                  <Avatar className="w-32 h-32 ring-4 ring-purple-500/20 transition-all duration-300 group-hover:ring-purple-500/40">
                    <AvatarImage src={profile?.avatar_url || ""} />
                    <AvatarFallback className="bg-purple-500/10 text-2xl">
                      {profile?.full_name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-white">{profile?.full_name}</h2>
                  <p className="text-purple-400">@{profile?.username}</p>
                  <p className="text-sm text-gray-400">{profile?.city || "Earth"}</p>
                </div>
                <div className="w-full space-y-4">
                  <div className="grid grid-cols-2 gap-4 p-4 bg-white/5 rounded-lg">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">24</p>
                      <p className="text-sm text-gray-400">Courses</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">12</p>
                      <p className="text-sm text-gray-400">Achievements</p>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Main Content */}
          <div className="flex-1">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full justify-start bg-black/60 border-white/10 backdrop-blur-sm p-1">
                {[
                  { value: "basic-info", icon: UserRound, label: "Basic Info" },
                  { value: "courses", icon: BookOpen, label: "Courses" },
                  { value: "achievements", icon: Trophy, label: "Achievements" },
                  { value: "performance", icon: ChartBar, label: "Performance" },
                  { value: "notifications", icon: Bell, label: "Notifications" }
                ].map(({ value, icon: Icon, label }) => (
                  <TabsTrigger
                    key={value}
                    value={value}
                    className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400"
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <div className="mt-6">
                <TabsContent value="basic-info" className="space-y-4">
                  <Card className="bg-black/60 border-white/10 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white">Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                          { label: "Full Name", value: profile?.full_name },
                          { label: "Username", value: `@${profile?.username}` },
                          { label: "Location", value: profile?.city || "Not specified" },
                          { label: "Interests", value: profile?.subjects_of_interest?.join(", ") || "None specified" }
                        ].map(({ label, value }) => (
                          <div key={label} className="bg-white/5 p-4 rounded-lg">
                            <label className="text-sm font-medium text-gray-400">{label}</label>
                            <p className="text-white mt-1">{value}</p>
                          </div>
                        ))}
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
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;