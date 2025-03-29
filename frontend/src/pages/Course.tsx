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
 
// Remove this extra closing brace as it's causing a syntax error
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
    <div className="min-h-screen bg-black text-white mx-auto px-4 mt-20 py-10">
      <Card className="w-full max-w-5xl mx-auto shadow-2xl rounded-2xl overflow-hidden backdrop-blur-sm bg-gray-900/80 border border-gray-700">
        <CardHeader className="bg-gray-800">
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="flex items-center">
              <Book className="h-10 w-10 mr-3 text-indigo-400" />
              <CardTitle className="text-3xl font-bold text-white">
                YouTube Course Finder
              </CardTitle>
            </div>
            <p className="text-gray-300">
              Discover the best YouTube courses for your learning needs
            </p>
          </div>
        </CardHeader>

        <CardContent className="p-8 space-y-8">
          {/* Search Section */}
          <section className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:shadow-lg transition-all">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-indigo-400" />
                <h3 className="text-lg font-semibold text-white">
                  Search YouTube Courses
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
                    className="bg-gray-900 border-gray-700 text-white focus:ring-indigo-500 focus:border-indigo-500"
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
                  className="bg-indigo-600 hover:bg-indigo-700 text-white transition-all min-w-[120px]"
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
          </section>

          {/* Results Section */}
          {courses.length > 0 ? (
            <section className="mt-6 space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <BarChart2 className="h-5 w-5 text-indigo-400" />
                <h3 className="text-lg font-semibold text-white">
                  Recommended YouTube Courses
                </h3>
                <span className="ml-auto text-sm text-gray-400">
                  {courses.length} courses found
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.map((course) => (
                  <div 
                    key={course.id} 
                    className="p-6 bg-gray-800 rounded-xl border border-gray-700 shadow-sm hover:shadow-md transition-all"
                  >
                    <CourseCard 
                      course={course} 
                      onVideoSelect={() => handleVideoSelect(course)}
                    />
                  </div>
                ))}
              </div>
            </section>
          ) : (
            searchTopic && !loading.courses && (
              <div className="text-center py-12">
                <div className="mx-auto h-24 w-24 text-gray-500 mb-4">
                  <Book className="w-full h-full opacity-50" />
                </div>
                <h3 className="text-lg font-medium text-gray-400">
                  No courses found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try searching for "Python" or "React" to see example courses
                </p>
              </div>
            )
          )}
        </CardContent>
      </Card>

      {/* Video Player Modal */}
      {selectedVideo && (
        <VideoPlayer 
          videoId={selectedVideo.id} 
          isOpen={!!selectedVideo} 
          onClose={() => setSelectedVideo(null)} 
          onComplete={handleVideoComplete}
        />
      )}

      {/* Quiz Modal */}
      <CourseQuiz 
        isOpen={showQuiz} 
        onClose={() => {
          setShowQuiz(false);
          setQuizRequest(null);
        }}
        quizRequest={quizRequest}
        onRetry={() => setSelectedVideo(selectedVideo)}
      />
    </div>
  );
};

export default CoursePage;