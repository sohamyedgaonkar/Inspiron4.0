import { BookOpen, Brain, FileText, GitBranch } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <BookOpen className="h-8 w-8 text-purple-400" />,
      title: "Smart Learning",
      description: "AI-powered personalized learning paths and content recommendations"
    },
    {
      icon: <Brain className="h-8 w-8 text-purple-400" />,
      title: "Career Growth",
      description: "ATS resume analysis and career roadmap generation"
    },
    {
      icon: <FileText className="h-8 w-8 text-purple-400" />,
      title: "Research Tools",
      description: "Advanced research paper analysis and summarization"
    },
    {
      icon: <GitBranch className="h-8 w-8 text-purple-400" />,
      title: "Skill Tracking",
      description: "Track your progress and identify skill gaps"
    }
  ];

  return (
    <section className="py-20 px-4 bg-black/60">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-purple-400">
          Features that Empower Your Learning
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-6 rounded-xl border border-purple-500/20 backdrop-blur-sm">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;