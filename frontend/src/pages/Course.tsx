import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Book, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import CourseCard from "@/components/course/CourseCard";
import VideoPlayer from "@/components/course/VideoPlayer";
import CourseQuiz from "@/components/course/CourseQuiz";
import axios from "axios";

interface CourseType {
  id: string;
  title: string;
  description: string;
  difficulty_level: string;
  is_free: boolean;
  video_id?: string;
  thumbnail_url?: string;
}

interface PythonSection {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
}

const Course = () => {
  const [searchTopic, setSearchTopic] = useState("");
  const [topics, setTopics] = useState<string[]>([]);
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [selectedVideo, setSelectedVideo] = useState("");
  const [showQuiz, setShowQuiz] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/get-topics")
      .then((response) => {
        setTopics(response.data.topics);
      })
      .catch((error) => {
        console.error("Error fetching topics:", error);
      });
  }, []);

  const handleSearch = async () => {
    if (!searchTopic.trim()) {
      toast({ title: "Error", description: "Please enter a topic to search", variant: "destructive" });
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .ilike('title', `%${searchTopic}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
      
      if (!data?.length) {
        toast({ title: "No courses found", description: "Try different search criteria", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast({ title: "Error", description: "Failed to fetch courses", variant: "destructive" });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Course Recommendations</h1>
          <p className="text-muted-foreground">Get personalized course recommendations based on your interests and skill level</p>
        </div>

        <div className="flex gap-4">
          <Input placeholder="Enter a topic" value={searchTopic} onChange={(e) => setSearchTopic(e.target.value)} list="topics-list" />
          <Button onClick={handleSearch}>Search</Button>
        </div>

        <datalist id="topics-list">
          {topics.map((topic, index) => (<option key={index} value={topic} />))}
        </datalist>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} onVideoSelect={setSelectedVideo} />
          ))}
        </div>

        <VideoPlayer videoId={selectedVideo} isOpen={!!selectedVideo} onClose={() => setSelectedVideo("")} onComplete={() => setShowQuiz(true)} />

        <CourseQuiz isOpen={showQuiz} onClose={() => setShowQuiz(false)} onRetry={() => setSelectedVideo(selectedVideo)} />
      </div>
    </div>
  );
};

export default Course;
