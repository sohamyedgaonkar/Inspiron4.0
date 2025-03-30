import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Book, 
  Search, 
  RefreshCw, 
  BarChart2 
} from "lucide-react";
import CourseCard from "@/components/course/CourseCard";
import VideoPlayer from "@/components/course/VideoPlayer";
import CourseQuiz from "@/components/course/CourseQuiz";

interface Course {
  id: string;
  title: string;
  description: string;
  difficulty_level: string;
  is_free: boolean;
  video_id: string;
  thumbnail_url: string;
}

interface ApiResponse {
  success: boolean;
  courses?: Course[];
  message?: string;
  topics?: string[];
}

interface QuizRequest {
  topic: string;
  video_id: string;
  video_title?: string;
}
 
const CoursePage = () => {
  const [searchTopic, setSearchTopic] = useState("");
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [topics, setTopics] = useState<string[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<{
    id: string;
    title: string;
  } | null>(null);
  
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizRequest, setQuizRequest] = useState<QuizRequest | null>(null);
  const [loading, setLoading] = useState({
    topics: false,
    courses: false
  });
  const { toast } = useToast();

  const API_BASE_URL = "http://127.0.0.1:5000";

  // Fetch available topics on component mount
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setLoading(prev => ({ ...prev, topics: true }));
        const { data } = await axios.get<ApiResponse>(`${API_BASE_URL}/get-topics`);
        if (data.topics) {
          setTopics(data.topics);
        }
      } catch (error) {
        console.error("Error fetching topics:", error);
        toast({
          title: "Error",
          description: "Failed to fetch course topics",
          variant: "destructive",
        });
      } finally {
        setLoading(prev => ({ ...prev, topics: false }));
      }
    };

    fetchTopics();
  }, [toast]);

  const handleSearch = async () => {
    if (!searchTopic.trim()) {
      toast({ 
        title: "Error", 
        description: "Please enter a topic to search", 
        variant: "destructive" 
      });
      return;
    }
    
    try {
      setLoading(prev => ({ ...prev, courses: true }));
      const { data } = await axios.post<ApiResponse>(
        `${API_BASE_URL}/get-courses`,
        { topic: searchTopic.toLowerCase() }
      );

      if (data.success && data.courses) {
        setCourses(data.courses);
      } else {
        setCourses([]);
        toast({ 
          title: data.message || "No courses found", 
          variant: "destructive" 
        });
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast({ 
        title: "Error", 
        description: "Failed to fetch courses", 
        variant: "destructive" 
      });
      setCourses([]);
    } finally {
      setLoading(prev => ({ ...prev, courses: false }));
    }
  };

  const handleVideoSelect = (course: Course) => {
    setSelectedVideo({
      id: course.video_id,
      title: course.title
    });
  };

  const handleVideoComplete = () => {
    if (selectedVideo) {
      setQuizRequest({
        topic: searchTopic,
        video_id: selectedVideo.id,
        video_title: selectedVideo.title
      });
      setShowQuiz(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen p-6 mt-20 animate-fade-up bg-gradient-to-b from-gray-900 via-black to-gray-900">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Course Library
          </h1>
          <p className="text-muted-foreground">
            {courses.length} courses available
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-black/60 rounded-xl border border-white/10 backdrop-blur-sm p-6 transition-all duration-300 hover:bg-black/70">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">
                Discover Courses
              </h3>
            </div>

            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Input 
                  placeholder="Enter a topic (e.g. Python, React)" 
                  value={searchTopic} 
                  onChange={(e) => setSearchTopic(e.target.value)}
                  onKeyDown={handleKeyDown}
                  list="topics-list"
                  className="bg-black/40 border-white/10 text-white focus:ring-purple-500 focus:border-purple-500"
                />
                <datalist id="topics-list">
                  {topics.map((topic) => (
                    <option key={topic} value={topic} />
                  ))}
                </datalist>
              </div>
              <Button
                onClick={handleSearch}
                disabled={loading.courses}
                className="bg-purple-600 hover:bg-purple-700 text-white transition-all min-w-[120px]"
              >
                {loading.courses ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Searching...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Find Courses
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div 
                key={course.id}
                className="bg-black/60 rounded-xl border border-white/10 backdrop-blur-sm 
                         transition-all duration-300 hover:scale-[1.02] hover:bg-black/70"
              >
                <CourseCard 
                  course={course} 
                  onVideoSelect={() => handleVideoSelect(course)}
                />
              </div>
            ))}
          </div>
        ) : (
          searchTopic && !loading.courses && (
            <div className="bg-black/60 rounded-xl border border-white/10 backdrop-blur-sm p-12 text-center">
              <Book className="h-16 w-16 mx-auto text-purple-400/50 mb-4" />
              <h3 className="text-lg font-medium text-white">
                No courses found
              </h3>
              <p className="mt-2 text-gray-400">
                Try searching for "Python" or "React" to see example courses
              </p>
            </div>
          )
        )}
      </div>

      {/* Video Player and Quiz Modals remain the same */}
    </div>
  );
};

export default CoursePage;