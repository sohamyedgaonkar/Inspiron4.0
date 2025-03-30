import { Clock, Trophy, Star, Users, Brain, Target } from "lucide-react";
import HackathonAlert from "@/components/dashboard/HackathonAlert";
import BuddySystem from "@/components/dashboard/BuddySystem";
import CourseProgress from "@/components/dashboard/CourseProgress";
import QuizModel from "@/components/dashboard/QuizModel";
import CareerProgress from "@/components/dashboard/CareerProgress";
import { motion } from "framer-motion";

const Dashboard = () => {
  const stats = [
    {
      icon: <Clock className="h-6 w-6 text-purple-400" />,
      label: "Learning Hours",
      value: "24.5h",
      bgColor: "bg-purple-500/10",
      increase: "+2.5h this week"
    },
    {
      icon: <Star className="h-6 w-6 text-emerald-400" />,
      label: "Achievements",
      value: "12",
      bgColor: "bg-emerald-500/10",
      increase: "+3 new"
    },
    {
      icon: <Trophy className="h-6 w-6 text-blue-400" />,
      label: "Current Rank",
      value: "#125",
      bgColor: "bg-blue-500/10",
      increase: "Top 10%"
    }
  ];

  return (
    <div className="min-h-screen p-6 animate-fade-up bg-gradient-to-b from-gray-900 via-black to-gray-900">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-black/60 p-6 rounded-xl border border-white/10 backdrop-blur-sm hover:bg-black/70 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 ${stat.bgColor} rounded-lg`}>
                  {stat.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-400">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                  <p className="text-xs text-gray-500 mt-1">{stat.increase}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Hackathon Alert */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="animate-fade-up"
        >
          <HackathonAlert />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { component: <BuddySystem />, icon: <Users className="h-5 w-5" /> },
            { component: <CourseProgress />, icon: <Target className="h-5 w-5" /> },
            { component: <QuizModel />, icon: <Brain className="h-5 w-5" /> },
            { component: <CareerProgress />, icon: <Trophy className="h-5 w-5" /> }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.2 }}
              className="bg-black/60 rounded-xl border border-white/10 backdrop-blur-sm 
                         transition-all duration-300 hover:scale-[1.02] hover:bg-black/70
                         group"
            >
              <div className="absolute top-4 right-4 p-2 bg-white/5 rounded-full
                            group-hover:bg-white/10 transition-colors">
                {item.icon}
              </div>
              {item.component}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;