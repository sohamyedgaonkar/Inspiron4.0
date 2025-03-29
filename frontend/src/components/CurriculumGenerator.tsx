import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Module {
  name: string;
  description: string;
  topicsCovered: string[];
  difficultyLevel: "Beginner" | "Intermediate" | "Advanced";
  videoUrl?: string;
}

interface PythonSection {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
}

const staticCurriculum: { [key: string]: { [key: string]: { [key: string]: Module[] } } } = {
  Python: {
    "Free Course": {
      Beginner: [
        {
          name: "Introduction to Python",
          description: "Learn the basics of Python programming.",
          topicsCovered: ["Syntax", "Variables", "Data Types", "Control Flow"],
          difficultyLevel: "Beginner",
          videoUrl: "https://www.youtube.com/embed/eWRfhZUzrAc",
        },
        {
          name: "Functions & Loops",
          description: "Understand how to use functions and loops effectively.",
          topicsCovered: ["Functions", "Loops", "Recursion", "Lambda"],
          difficultyLevel: "Beginner",
        },
      ],
    },
  },
  "Web Development": {
    "Paid Course": {
      Intermediate: [
        {
          name: "Frontend Development",
          description: "Build modern web interfaces using React and Tailwind CSS.",
          topicsCovered: ["React", "JSX", "Tailwind CSS", "State Management"],
          difficultyLevel: "Intermediate",
        },
        {
          name: "Backend Development",
          description: "Learn how to create REST APIs using Node.js and Express.",
          topicsCovered: ["Node.js", "Express", "MongoDB", "Authentication"],
          difficultyLevel: "Intermediate",
        },
      ],
    },
  },
};

const pythonSections: PythonSection[] = [
  {
    id: 1,
    title: "Introduction to Python",
    description: "Learn the basics of Python programming language and its ecosystem.",
    isCompleted: false,
  },
  {
    id: 2,
    title: "Basics of Python",
    description: "Master fundamental concepts like variables, data types, and control structures.",
    isCompleted: false,
  },
  {
    id: 3,
    title: "OOP Concepts in Python",
    description: "Understand object-oriented programming principles in Python.",
    isCompleted: false,
  },
  {
    id: 4,
    title: "Advanced Concepts in Python",
    description: "Explore advanced topics like decorators, generators, and metaclasses.",
    isCompleted: false,
  },
];

const CurriculumGenerator = () => {
  const [subject, setSubject] = useState("");
  const [courseType, setCourseType] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [curriculum, setCurriculum] = useState<Module[]>([]);
  const [showPythonModal, setShowPythonModal] = useState(false);
  const [sections, setSections] = useState<PythonSection[]>(pythonSections);
  const { toast } = useToast();

  const handleSectionComplete = (sectionId: number) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId
          ? { ...section, isCompleted: true }
          : section
      )
    );
    toast({
      title: "Quiz Completed",
      description: "You've completed this section's quiz!",
    });
  };

  const handleDifficultySelection = async (selectedDifficulty: string) => {
    if (subject.toLowerCase() === "python" && selectedDifficulty === "Beginner") {
      setShowPythonModal(true);
      return;
    }
    
    if (
      staticCurriculum[subject] &&
      staticCurriculum[subject][courseType] &&
      staticCurriculum[subject][courseType][selectedDifficulty]
    ) {
      setCurriculum(staticCurriculum[subject][courseType][selectedDifficulty]);
      toast({
        title: "Success",
        description: "Static curriculum loaded successfully!",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-curriculum", {
        body: { subject },
      });

      if (error) throw error;

      setCurriculum(JSON.parse(data));
      toast({
        title: "Success",
        description: "Curriculum generated successfully!",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to generate curriculum. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateCurriculum = async () => {
    if (!subject.trim() || !courseType || !difficulty) {
      toast({
        title: "Error",
        description: "Please enter all details (subject, course type, difficulty)",
        variant: "destructive",
      });
      return;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="flex flex-col gap-4 mb-8">
        <Input
          placeholder="Enter a subject (e.g., Python, Web Development)"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="flex-1"
        />

        <Select onValueChange={setCourseType}>
          <SelectTrigger>
            <SelectValue placeholder="Select Course Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Free Course">Free Course</SelectItem>
            <SelectItem value="Paid Course">Paid Course</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={setDifficulty}>
          <SelectTrigger>
            <SelectValue placeholder="Select Difficulty Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Beginner">Beginner</SelectItem>
            <SelectItem value="Intermediate">Intermediate</SelectItem>
            <SelectItem value="Advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={generateCurriculum} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Curriculum"
          )}
        </Button>
      </div>

      {curriculum.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {curriculum.map((module, index) => (
            <Card key={index} className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {module.name}
                  <span className="text-sm font-normal px-2 py-1 rounded-full bg-accent">
                    {module.difficultyLevel}
                  </span>
                </CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {module.topicsCovered.map((topic, i) => (
                    <span key={i} className="text-sm px-2 py-1 rounded-full bg-secondary">
                      {topic}
                    </span>
                  ))}
                </div>

                {module.videoUrl && (
                  <div className="mt-4">
                    <iframe
                      width="100%"
                      height="200"
                      src={module.videoUrl}
                      title="YouTube Video"
                      frameBorder="0"
                      allowFullScreen
                      className="rounded-lg"
                    ></iframe>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showPythonModal} onOpenChange={setShowPythonModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-4">Python Course Curriculum</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {sections.map((section) => (
              <div
                key={section.id}
                className={`p-6 rounded-lg transition-colors duration-300 ${
                  section.isCompleted ? "bg-green-100" : "bg-white"
                } border hover:border-primary`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{section.title}</h3>
                    <p className="text-muted-foreground mt-1">{section.description}</p>
                  </div>
                  <Button
                    onClick={() => handleSectionComplete(section.id)}
                    className="ml-4 transition-transform hover:scale-105"
                    variant={section.isCompleted ? "secondary" : "default"}
                  >
                    {section.isCompleted ? "Completed" : "Take Quiz"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CurriculumGenerator;
