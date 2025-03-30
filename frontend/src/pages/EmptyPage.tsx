import React from "react";
import DashboardLearner from "@/learner/DashboardLearner";

const EmptyPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-white">
      <DashboardLearner />
    </div>
  );
};

export default EmptyPage;