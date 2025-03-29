// import { useState, useEffect } from "react";
// import { Menu, X } from "lucide-react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { supabase } from "@/integrations/supabase/client";
// import { useQuery } from "@tanstack/react-query";
// import { useToast } from "@/components/ui/use-toast";

// const Navigation = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { toast } = useToast();
  
//   // Check authentication and onboarding status
//   const { data: session } = useQuery({
//     queryKey: ['session'],
//     queryFn: async () => {
//       const { data: { session } } = await supabase.auth.getSession();
//       return session;
//     },
//   });

//   // First check/create profile
//   const { data: profile, error: profileError } = useQuery({
//     queryKey: ['profile', session?.user?.id],
//     queryFn: async () => {
//       if (!session?.user?.id) return null;
      
//       const { data: existingProfile, error: profileError } = await supabase
//         .from('profiles')
//         .select('*')
//         .eq('id', session.user.id)
//         .maybeSingle();
      
//       if (profileError) {
//         console.error('Error fetching profile:', profileError);
//         toast({
//           title: "Error",
//           description: "Failed to fetch profile. Please try logging out and back in.",
//           variant: "destructive",
//         });
//         return null;
//       }

//       if (!existingProfile) {
//         toast({
//           title: "Error",
//           description: "Profile not found. Please try logging out and back in.",
//           variant: "destructive",
//         });
//         return null;
//       }

//       return existingProfile;
//     },
//     enabled: !!session?.user?.id,
//     retry: false,
//   });

//   // Then check/create onboarding status
//   const { data: onboardingStatus } = useQuery({
//     queryKey: ['onboardingStatus', profile?.id],
//     queryFn: async () => {
//       if (!profile?.id) return null;
      
//       const { data: existingStatus, error: statusError } = await supabase
//         .from('onboarding_status')
//         .select('*')
//         .eq('user_id', profile.id)
//         .maybeSingle();
      
//       if (statusError) {
//         console.error('Error fetching onboarding status:', statusError);
//         toast({
//           title: "Error",
//           description: "Failed to fetch onboarding status. Please try refreshing the page.",
//           variant: "destructive",
//         });
//         return null;
//       }

//       return existingStatus;
//     },
//     enabled: !!profile?.id,
//     retry: false,
//   });

//   // Handle navigation based on auth and onboarding status
//   useEffect(() => {
//     const publicRoutes = ['/auth', '/'];
//     const currentPath = location.pathname;

//     if (!session && !publicRoutes.includes(currentPath)) {
//       navigate('/auth');
//     } else if (session && profileError) {
//       navigate('/auth');
//     } else if (session && onboardingStatus && !onboardingStatus.is_completed && currentPath !== '/onboarding') {
//       navigate('/onboarding');
//     } else if (session && onboardingStatus?.is_completed && currentPath === '/onboarding') {
//       navigate('/dashboard');
//     }
//   }, [session, onboardingStatus, profileError, navigate, location.pathname]);

//   // Don't show navigation on auth page or if onboarding is not completed
//   if (!session || (onboardingStatus && !onboardingStatus.is_completed)) {
//     return null;
//   }

//   const handleSignOut = async () => {
//     try {
//       const { error } = await supabase.auth.signOut();
//       if (error) throw error;
//       navigate('/auth');
//     } catch (error: any) {
//       console.error('Error signing out:', error);
//       toast({
//         title: "Error signing out",
//         description: error.message || "Failed to sign out. Please try again.",
//         variant: "destructive",
//       });
//     }
//   };

//   const navItems = [
//     { name: "Dashboard", path: "/dashboard" },
//     { name: "Course", path: "/course" },
//     { name: "Quiz", path: "/quiz" },
//     { name: "Notes", path: "/notes" },
//     { name: "Profile", path: "/profile" },
//   ];

//   return (
//     <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-sm border-b border-white/10">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           <div className="flex-shrink-0">
//             <Link to="/dashboard" className="text-xl font-semibold">
//               CogniLearn
//             </Link>
//           </div>
          
//           <div className="hidden md:block">
//             <div className="ml-10 flex items-baseline space-x-4">
//               {navItems.map((item) => (
//                 <Link
//                   key={item.name}
//                   to={item.path}
//                   className="px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-white/10 hover:text-white"
//                 >
//                   {item.name}
//                 </Link>
//               ))}
//               <button
//                 onClick={handleSignOut}
//                 className="px-3 py-2 rounded-md text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
//               >
//                 Sign Out
//               </button>
//             </div>
//           </div>
          
//           <div className="md:hidden">
//             <button
//               onClick={() => setIsOpen(!isOpen)}
//               className="inline-flex items-center justify-center p-2 rounded-md hover:bg-white/10 hover:text-white focus:outline-none"
//             >
//               {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {isOpen && (
//         <div className="md:hidden">
//           <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black/80 backdrop-blur-sm">
//             {navItems.map((item) => (
//               <Link
//                 key={item.name}
//                 to={item.path}
//                 className="block px-3 py-2 rounded-md text-base font-medium hover:bg-white/10 hover:text-white"
//                 onClick={() => setIsOpen(false)}
//               >
//                 {item.name}
//               </Link>
//             ))}
//             <button
//               onClick={handleSignOut}
//               className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
//             >
//               Sign Out
//             </button>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navigation;

import { useState, useEffect } from "react";
import { Menu, X, Star, Sprout, Users, GraduationCap } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  const { data: profile, error: profileError } = useQuery({
    queryKey: ['profile', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();
      
      if (profileError) {
        console.error('Error fetching profile:', profileError);
        toast({
          title: "Error",
          description: "Failed to fetch profile. Please try logging out and back in.",
          variant: "destructive",
        });
        return null;
      }

      if (!existingProfile) {
        toast({
          title: "Error",
          description: "Profile not found. Please try logging out and back in.",
          variant: "destructive",
        });
        return null;
      }

      return existingProfile;
    },
    enabled: !!session?.user?.id,
    retry: false,
  });

  const { data: onboardingStatus } = useQuery({
    queryKey: ['onboardingStatus', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return null;
      
      const { data: existingStatus, error: statusError } = await supabase
        .from('onboarding_status')
        .select('*')
        .eq('user_id', profile.id)
        .maybeSingle();
      
      if (statusError) {
        console.error('Error fetching onboarding status:', statusError);
        toast({
          title: "Error",
          description: "Failed to fetch onboarding status. Please try refreshing the page.",
          variant: "destructive",
        });
        return null;
      }

      return existingStatus;
    },
    enabled: !!profile?.id,
    retry: false,
  });

  useEffect(() => {
    const publicRoutes = ['/auth', '/', '/researchpaper', '/ats', '/githubchat', '/roadmap', '/aidashboard', '/template/:slug'];
    const currentPath = location.pathname;

    if (!session && !publicRoutes.includes(currentPath)) {
      navigate('/auth');
    } else if (session && profileError) {
      navigate('/auth');
    } else if (session && onboardingStatus && !onboardingStatus.is_completed && currentPath !== '/onboarding') {
      navigate('/onboarding');
    } 
    else if (session && onboardingStatus?.is_completed && currentPath === '/onboarding') {
      navigate('/dashboard');
    }
  }, [session, onboardingStatus, profileError, navigate, location.pathname]);

  if (!session || (onboardingStatus && !onboardingStatus.is_completed)) {
    return null;
  }

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/auth');
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast({
        title: "Error signing out",
        description: error.message || "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Course", path: "/course" },
    { name: "ATS Analyzer", path: "/ats", icon: <Users className="h-4 w-4" /> },
    { name: "GitHub Chat", path: "/githubchat", icon: <GraduationCap className="
      h-4 w-4" /> },
    { name: "Quiz", path: "/quiz" },
    { name: "Research Paper", path: "/researchpaper", icon: <Sprout className="h-4 w-4" /> },
    { name: "Notes", path: "/notes" },
    { name: "Summary", path: "/summary", icon: <Star className="h-4 w-4" /> },
    { name: "Profile", path: "/profile" },
    { name: "AI Content", path: "/aidashboard", icon: <GraduationCap className="h-4 w-4" /> },
    { name: "Student Roadmap", path: "/student", icon: <GraduationCap className="h-4 w-4" /> },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/dashboard" className="text-xl font-semibold">
              CogniLearn
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-white/10 hover:text-white flex items-center gap-1"
                >
                  {item.icon && item.icon}
                  {item.name}
                </Link>
              ))}
              <button
                onClick={handleSignOut}
                className="px-3 py-2 rounded-md text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
              >
                Sign Out
              </button>
            </div>
          </div>
          
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-white/10 hover:text-white focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black/80 backdrop-blur-sm">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="flex items-center gap-1 px-3 py-2 rounded-md text-base font-medium hover:bg-white/10 hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                {item.icon && item.icon}
                {item.name}
              </Link>
            ))}
            <button
              onClick={handleSignOut}
              className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
