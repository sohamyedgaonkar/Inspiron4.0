import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    description: string;
    difficulty_level: string;
    video_id?: string;
    thumbnail_url?: string;
  };
  onVideoSelect: (videoId: string) => void;
}

const CourseCard = ({ course, onVideoSelect }: CourseCardProps) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <span>{course.title}</span>
          {course.video_id && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onVideoSelect(course.video_id!)}
            >
              <Play className="h-4 w-4" />
            </Button>
          )}
        </CardTitle>
        <CardDescription>
          Difficulty: {course.difficulty_level.charAt(0).toUpperCase() + course.difficulty_level.slice(1)}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground">{course.description}</p>
      </CardContent>
    </Card>
  );
};

export default CourseCard;