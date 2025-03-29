import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import NavigationLearner from "@/components/NavigationLearner";
import DashboardLearner from "@/learner/DashboardLearner";
// Remove or comment out the ProtectedRoute import until it's fully implemented
// import { ProtectedRoute } from "@/components/ProtectedRoute";

// Lazy load components
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
const CreateNewContent = lazy(() => import("./pages/TemplatePage"));
const Home = lazy(() => import("./pages/Home"));
const PageZero = lazy(() => import("./pages/PageZero")); // Import the new component
const EmptyPage = lazy(() => import("@/pages/EmptyPage")); // Import the empty page
//const CourseLearner = lazy(() => import("./pages/CourseLearner")); // Import the new component

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

function Layout() {
  const location = useLocation();

  // Define paths where NavigationLearner should be used
  const learnerPaths = [
    "/learner",          // Add this for all learner routes
    "/course-learner",
    "/quiz-learner",
    "/notes-learner",
    "/profile-learner"
  ];

  // Define paths where no navigation bar should be shown
  const hideNavPaths = ["/", "/pagezero", "/auth", "/onboarding"];

  // Determine which navigation bar to show
  const isLearnerPath = learnerPaths.some((path) => location.pathname.startsWith(path));
  const isHideNavPath = hideNavPaths.includes(location.pathname);

  return (
    <>
      {/* Conditionally render Navigation or NavigationLearner */}
      {!isHideNavPath && (isLearnerPath ? <NavigationLearner /> : <Navigation />)}

      <main className="min-h-screen">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/pagezero" element={<PageZero />} />
            <Route path="/onboarding" element={<Onboarding />} />

            {/* Admin/Teacher Dashboard Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/performance" element={<Performance />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/course" element={<Course />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/summary" element={<Summary />} />

            {/* Learner Routes */}
            <Route path="/learner">
              <Route path="dashboard" element={<DashboardLearner />} />
              <Route path="quiz" element={<Quiz />} />
              <Route path="notes" element={<Notes />} />
              <Route path="profile" element={<Profile />} />
              <Route path="course" element={<Course />} />
            </Route>

            {/* Fallback Routes */}
            <Route path="/empty" element={<EmptyPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      <Toaster />
    </>
  );
}

export default App;
