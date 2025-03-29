import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartBar } from "lucide-react";

const QuizModel = () => {
  const quizzes = [
    {
      topic: "Python Basics",
      score: 90,
      difficulty: "Medium",
    },
    {
      topic: "Data Structures",
      score: 85,
      difficulty: "Hard",
    },
  ];

  return (
    <Card className="w-full bg-black/50 border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <ChartBar className="h-5 w-5" /> Quiz Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {quizzes.map((quiz, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{quiz.topic}</span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    quiz.difficulty === "Easy"
                      ? "bg-green-500/20 text-green-400"
                      : quiz.difficulty === "Medium"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {quiz.difficulty}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${quiz.score}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-12">
                  {quiz.score}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizModel;