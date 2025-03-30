import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import QuestionCard from "@/components/quiz/QuestionCard";
import { questions } from "@/data/quizQuestions";

interface CourseQuizProps {
  isOpen: boolean;
  onClose: () => void;
  onRetry: () => void;
}

const CourseQuiz = ({ isOpen, onClose, onRetry }: CourseQuizProps) => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  const handleSubmit = () => {
    const score = calculateScore();
    setShowResults(true);

    if (score >= 60) {
      toast({
        title: "Congratulations!",
        description: `You passed with ${score}%`,
      });
    } else {
      toast({
        title: "Keep trying!",
        description: `You scored ${score}%. You need 60% to pass.`,
        variant: "destructive",
      });
    }
  };

  const calculateScore = () => {
    const correctAnswers = questions.filter(
      (q) => answers[q.id] === q.answer
    ).length;
    return Math.round((correctAnswers / questions.length) * 100);
  };

  const handleRetry = () => {
    setAnswers({});
    setShowResults(false);
    onRetry();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Course Quiz</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {questions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              selectedAnswer={answers[question.id] || ""}
              onAnswerChange={(answer) =>
                setAnswers((prev) => ({ ...prev, [question.id]: answer }))
              }
            />
          ))}
          
          {showResults ? (
            <div className="space-y-4">
              {calculateScore() >= 60 ? (
                <>
                  <p className="text-green-500 font-bold text-center">
                    Congratulations! You passed!
                  </p>
                  <Button onClick={onClose} className="w-full">
                    Continue
                  </Button>
                </>
              ) : (
                <div className="space-y-4">
                  <p className="text-red-500 font-bold text-center">
                    You need to score at least 60% to pass.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <Button onClick={handleRetry}>Watch Video Again</Button>
                    <Button onClick={() => setShowResults(false)}>
                      Retry Quiz
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Button onClick={handleSubmit} className="w-full">
              Submit Quiz
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CourseQuiz;