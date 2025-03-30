import { Suspense } from 'react';
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import { Helmet } from 'react-helmet';

const LoadingFallback = () => <div className="animate-pulse">Loading...</div>;

const Index = () => {
  return (
    <>
      <Helmet>
        <title>AI Learning Platform</title>
        <meta name="description" content="AI-powered learning platform for students" />
      </Helmet>
      
      <div className="min-h-screen">
        <main className="pt-16">
          <Suspense fallback={<LoadingFallback />}>
            <Hero />
            <Features />
          </Suspense>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;