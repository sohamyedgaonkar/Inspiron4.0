import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";

interface QuizResultProps {
  isOpen: boolean;
  onClose: () => void;
  score: number;
  onRetry: () => void;
  onAnalyze: () => void;
}

const QuizResult = ({ isOpen, onClose, score, onRetry, onAnalyze }: QuizResultProps) => {
  const passed = score >= 70;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Quiz Results</DialogTitle>
          <DialogDescription className="text-center space-y-4">
            <div className="flex justify-center my-4">
              {passed ? (
                <CheckCircle className="w-16 h-16 text-green-500" />
              ) : (
                <XCircle className="w-16 h-16 text-red-500" />
              )}
            </div>
            <p className="text-2xl font-bold">Score: {score}%</p>
            <p>
              {passed
                ? "Congratulations! You have passed the test!"
                : "Keep practicing! You can do better next time."}
            </p>
            <div className="flex justify-center gap-4 pt-4">
              {passed ? (
                <Button onClick={onAnalyze}>Analyze Performance</Button>
              ) : (
                <Button onClick={onRetry}>Retry Quiz</Button>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default QuizResult;