import { QuestionCardProps } from "@/types/quiz";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const QuestionCard = ({ question, selectedAnswer, onAnswerChange }: QuestionCardProps) => {
  return (
    <div className="glass p-6 rounded-lg space-y-4 animate-fade-up">
      <h3 className="text-lg font-medium">
        {question.id}. {question.question}
      </h3>
      <RadioGroup
        value={selectedAnswer}
        onValueChange={onAnswerChange}
        className="space-y-2"
      >
        {question.options.map((option, index) => (
          <div key={index} className="flex items-center space-x-2">
            <RadioGroupItem value={option} id={`q${question.id}-${index}`} />
            <Label htmlFor={`q${question.id}-${index}`}>{option}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default QuestionCard;