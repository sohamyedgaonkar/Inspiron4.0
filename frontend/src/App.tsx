  import { Suspense, lazy } from "react";
  import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
  import { Toaster } from "@/components/ui/toaster";
  import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
  import Navigation from "@/components/Navigation";

  // Lazy load components
  const Index = lazy(() => import("@/pages/Index"));
  const Auth = lazy(() => import("@/pages/Auth"));
  const Dashboard = lazy(() => import("@/pages/Dashboard"));
  const Onboarding = lazy(() => import("@/pages/Onboarding"));
  const Profile = lazy(() => import("@/pages/Profile"));
  const CreateNewContent = lazy(() => import("./pages/TemplatePage"));
  const Home = lazy(() => import("./pages/Home"));

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
    const hideNavPaths = ["/", "/auth", "/onboarding"]; // Hides Navigation on both Hero and Auth pages

    return (
      <>
        {!hideNavPaths.includes(location.pathname) && <Navigation />}
        <main className="min-h-screen">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/performance" element={<Performance />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/aidashboard" element={<Home />} />
            </Routes>
          </Suspense>
        </main>
        <Toaster />
      </>
    );
  }

  export default App;
