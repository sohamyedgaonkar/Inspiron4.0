import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

const FeatureCard = ({ title, description, icon: Icon }: FeatureCardProps) => {
  return (
    <div className="group relative p-6 rounded-lg glass transition-all duration-300 hover:scale-[1.02]">
      <div className="flex items-center gap-4">
        <div className="p-2 rounded-lg bg-accent">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="mt-4 text-muted-foreground">{description}</p>
    </div>
  );
};

export default FeatureCard;