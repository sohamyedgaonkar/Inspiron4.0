import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        <Hero />
        <Features />
      </main>
      <Footer />
    </div>
  );
};

export default Index;