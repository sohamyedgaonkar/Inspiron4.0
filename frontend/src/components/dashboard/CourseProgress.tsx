import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

const CourseProgress = () => {
  const courses = [
    {
      name: "Machine Learning Fundamentals",
      progress: 75,
      quizzes: 8,
    },
    {
      name: "Data Structures",
      progress: 60,
      quizzes: 5,
    },
    {
      name: "Cloud Computing",
      progress: 45,
      quizzes: 7,
    },
  ];

  return (
    <Card className="w-full bg-black/50 border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <BookOpen className="h-5 w-5" /> Course Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {courses.map((course, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{course.name}</span>
              <span className="text-muted-foreground">
                {course.quizzes} quizzes
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default CourseProgress;