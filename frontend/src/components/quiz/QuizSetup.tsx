import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface QuizSetupProps {
  onStartQuiz: (topic: string, difficulty: string) => void;
  isLoading?: boolean;
}

const QuizSetup = ({ onStartQuiz, isLoading }: QuizSetupProps) => {
  const [step, setStep] = useState(1);
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  const handleDifficultySelect = (level: string) => {
    setDifficulty(level);
    setStep(3);
  };

  const handleStartQuiz = () => {
    onStartQuiz(topic, difficulty);
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setStep(1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Quiz Setup</DialogTitle>
          <DialogDescription>
            <div className="space-y-6">
              {step === 1 && (
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div className="flex-1 glass p-4 rounded-lg">
                      <p>Enter a topic for your quiz:</p>
                      <Input
                        type="text"
                        placeholder="e.g., JavaScript, Python, React"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                  </div>
                  <div className="ml-14">
                    <Button 
                      onClick={() => setStep(2)}
                      className="w-full md:w-auto"
                      disabled={!topic.trim()}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div className="flex-1 glass p-4 rounded-lg">
                      <p>Select the difficulty level:</p>
                    </div>
                  </div>
                  <div className="ml-14 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {["Easy", "Medium", "Hard"].map((level) => (
                      <Button
                        key={level}
                        onClick={() => handleDifficultySelect(level)}
                        variant={difficulty === level ? "default" : "outline"}
                      >
                        {level}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div className="flex-1 glass p-4 rounded-lg">
                      <p>Ready to start your {difficulty} quiz on {topic}?</p>
                    </div>
                  </div>
                  <div className="ml-14">
                    <Button onClick={handleStartQuiz} disabled={isLoading}>
                      {isLoading ? "Generating Quiz..." : "Start Quiz"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default QuizSetup;