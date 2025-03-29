import { Brain, BookOpen, ChartBar, FileText, Trophy, NotebookPen } from "lucide-react";
import FeatureCard from "./FeatureCard";

const Features = () => {
  const features = [
    {
      title: "Quiz Generator",
      description: "Create personalized quizzes with adjustable difficulty levels for effective learning.",
      icon: Brain,
    },
    {
      title: "Course Recommendations",
      description: "Get tailored course suggestions based on your learning style and goals.",
      icon: BookOpen,
    },
    {
      title: "Performance Tracking",
      description: "Monitor your progress with detailed analytics and insights.",
      icon: ChartBar,
    },
    {
      title: "Research Papers",
      description: "Analyze and understand research papers with AI-powered assistance.",
      icon: FileText,
    },
    {
      title: "Achievements",
      description: "Earn badges and track your learning milestones.",
      icon: Trophy,
    },
    {
      title: "Notes & Bookmarks",
      description: "Organize your learning materials efficiently.",
      icon: NotebookPen,
    },
  ];

  return (
    <section className="py-24 bg-accent/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-3xl font-bold">Powerful Features</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to enhance your learning experience
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <FeatureCard {...feature} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;