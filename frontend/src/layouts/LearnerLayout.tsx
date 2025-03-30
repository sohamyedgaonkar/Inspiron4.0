import { Outlet } from "react-router-dom";
import NavigationLearner from "@/learner/NavigationLearner";

export default function LearnerLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavigationLearner />
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
}