import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import NavigationLearner from "@/learner/NavigationLearner";

// Layout Component 
const Index = lazy(() => import("@/pages/Index"));
const Auth = lazy(() => import("@/pages/Auth"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Onboarding = lazy(() => import("@/pages/Onboarding"));
const Performance = lazy(() => import("@/pages/Performance"));
const Profile = lazy(() => import("@/pages/Profile"));
const Quiz = lazy(() => import("@/pages/Quiz"));
const Course = lazy(() => import("@/pages/Course"));
const Notes = lazy(() => import("@/pages/Notes"));
const Summary = lazy(() => import("@/pages/Summary"));
const ResearchPaperAnalyzer = lazy(() => import("./pages/ResearchPaper"));
const ATSAnalyzer = lazy(() => import("./pages/ATS"));
const GitHubChatPage = lazy(() => import("./pages/GitHubChatPage"));
 const RoadmapPage = lazy(() => import("./pages/Roadmap"));
const CreateNewContent = lazy(() => import("./pages/TemplatePage"));
const Home = lazy(() => import("./pages/Home"));
const PageZero = lazy(() => import("./pages/PageZero")); // Add PageZero import

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="animate-pulse text-lg">Loading...</div>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout />
      </Router>
    </QueryClientProvider>
  );
}

// Add this import at the top with other imports
const DashboardLearner = lazy(() => import("@/learner/DashboardLearner")); 
const CourseLearner = lazy(() => import("@/learner/CourseLearner"));
const NotesLearner = lazy(() => import("@/learner/NotesLearner")); 
const ProfileLearner = lazy(() => import("@/learner/ProfileLearner"));
const StudentRoadmap = lazy(() => import("@/learner/StudentRoadmapGenerator"));

function Layout() {
  const location = useLocation();
  const hideNavPaths = ["/", "/auth", "/onboarding", "/pagezero"];
  const isLearnerPath = location.pathname.startsWith('/learn');

  return (
    <>
      {!hideNavPaths.includes(location.pathname) && (
        isLearnerPath ? <NavigationLearner /> : <Navigation />
      )}
      <main className="min-h-screen">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/pagezero" element={<PageZero />} />
            <Route path="/onboarding" element={<Onboarding />} />
            
            {/* Dashboard Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Learner Routes with NavigationLearner */}
            <Route path="/learn/dashboard" element={<DashboardLearner />} />
            <Route path="/learn/course" element={<CourseLearner />} />
            <Route path="/learn/notes" element={<NotesLearner />} />
            <Route path="/learn/profile" element={<ProfileLearner />} />
            <Route path="/learn/studentroadmap" element={<StudentRoadmap />} />
            
            {/* Other existing routes */}
            <Route path="/performance" element={<Performance />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/course" element={<Course />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/summary" element={<Summary />} />
            <Route path="/researchpaper" element={<ResearchPaperAnalyzer />} />
            <Route path="/ats" element={<ATSAnalyzer />} />
            <Route path="/githubchat" element={<GitHubChatPage />} />
             <Route path="/roadmap" element={<RoadmapPage />} /> 
            <Route path="/aidashboard" element={<Home />} />
            <Route path="/aidashboard/content/:slug" element={<CreateNewContent />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      <Toaster />
    </>
  );
}

export default App;
