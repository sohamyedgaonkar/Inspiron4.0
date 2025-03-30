// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// interface OnboardingQuestionsProps {
//   onSubmit: (answers: Record<string, any>) => Promise<void>;
// }

// const questions = [
//   {
//     question: "What are your primary learning goals?",
//     options: [
//       "Improving technical skills",
//       "Career advancement",
//       "Personal growth",
//       "Academic success",
//     ],
//     key: "learning_goals",
//   },
//   {
//     question: "Which programming languages interest you the most?",
//     options: [
//       "Python",
//       "JavaScript",
//       "Java",
//       "C++",
//       "Other",
//     ],
//     key: "programming_interests",
//   },
//   {
//     question: "What is your preferred learning style?",
//     options: [
//       "Video tutorials",
//       "Interactive coding",
//       "Reading documentation",
//       "Project-based learning",
//     ],
//     key: "learning_style",
//   },
//   {
//     question: "How much time can you dedicate to learning daily?",
//     options: ["Less than 1 hour", "1-2 hours", "2-4 hours", "4+ hours"],
//     key: "daily_time",
//     singleSelect: true,
//   },
//   {
//     question: "What is your current experience level in programming?",
//     options: [
//       "Complete beginner",
//       "Some basic knowledge",
//       "Intermediate",
//       "Advanced",
//     ],
//     key: "experience_level",
//     singleSelect: true,
//   },
// ];

// export const OnboardingQuestions = ({ onSubmit }: OnboardingQuestionsProps) => {
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [answers, setAnswers] = useState<Record<string, any>>({});
//   const [loading, setLoading] = useState(false);

//   const handleOptionToggle = (option: string) => {
//     const currentKey = questions[currentQuestion].key;
//     if (questions[currentQuestion].singleSelect) {
//       setAnswers({ ...answers, [currentKey]: option });
//     } else {
//       const currentAnswers = answers[currentKey] || [];
//       const updatedAnswers = currentAnswers.includes(option)
//         ? currentAnswers.filter((a: string) => a !== option)
//         : [...currentAnswers, option];
//       setAnswers({ ...answers, [currentKey]: updatedAnswers });
//     }
//   };

//   const handleSubmit = async () => {
//     setLoading(true);
//     try {
//       await onSubmit(answers);
//     } catch (error) {
//       console.error("Error submitting answers:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const currentQ = questions[currentQuestion];

//   return (
//     <div className="space-y-6">
//       <div className="w-full bg-accent/20 h-1 rounded-full overflow-hidden">
//         <div
//           className="h-full bg-primary transition-all duration-300"
//           style={{
//             width: `${((currentQuestion + 1) / questions.length) * 100}%`,
//           }}
//         />
//       </div>
      
//       <div className="text-center space-y-4">
//         <h2 className="text-2xl font-bold">Question {currentQuestion + 1} of {questions.length}</h2>
//         <p className="text-xl">{currentQ.question}</p>
//       </div>

//       <div className="space-y-4">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {currentQ.options.map((option) => (
//             <div
//               key={option}
//               className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-accent/50 cursor-pointer"
//               onClick={() => handleOptionToggle(option)}
//             >
//               <Checkbox
//                 checked={
//                   currentQ.singleSelect
//                     ? answers[currentQ.key] === option
//                     : (answers[currentQ.key] || []).includes(option)
//                 }
//                 onCheckedChange={() => handleOptionToggle(option)}
//               />
//               <span>{option}</span>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="flex justify-between pt-4">
//         {currentQuestion > 0 && (
//           <Button
//             onClick={() => setCurrentQuestion(currentQuestion - 1)}
//             variant="outline"
//             className="flex items-center gap-2"
//           >
//             <ChevronLeft className="h-4 w-4" /> Previous
//           </Button>
//         )}
//         <div className="flex-1" />
//         {currentQuestion < questions.length - 1 ? (
//           <Button
//             onClick={() => setCurrentQuestion(currentQuestion + 1)}
//             className="flex items-center gap-2"
//           >
//             Next <ChevronRight className="h-4 w-4" />
//           </Button>
//         ) : (
//           <Button
//             onClick={handleSubmit}
//             disabled={loading}
//             className="flex items-center gap-2"
//           >
//             {loading ? "Submitting..." : "Complete"}
//           </Button>
//         )}
//       </div>
//     </div>
//   );
// };


import { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface OnboardingQuestionsProps {
  onSubmit: (answers: Record<string, any>) => Promise<void>;
}

const questions = [
  {
    question: "What are your primary learning goals?",
    options: ["Improving technical skills", "Career advancement", "Personal growth", "Academic success"],
    key: "learning_goals",
  },
  {
    question: "Which programming languages interest you the most?",
    options: ["Python", "JavaScript", "Java", "C++", "Other"],
    key: "programming_interests",
  },
  {
    question: "What is your preferred learning style?",
    options: ["Video tutorials", "Interactive coding", "Reading documentation", "Project-based learning"],
    key: "learning_style",
  },
  {
    question: "How much time can you dedicate to learning daily?",
    options: ["Less than 1 hour", "1-2 hours", "2-4 hours", "4+ hours"],
    key: "daily_time",
    singleSelect: true,
  },
  {
    question: "What is your current experience level in programming?",
    options: ["Complete beginner", "Some basic knowledge", "Intermediate", "Advanced"],
    key: "experience_level",
    singleSelect: true,
  },
];

export const OnboardingQuestions = ({ onSubmit }: OnboardingQuestionsProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  // Memoize current question to avoid recalculations
  const currentQ = useMemo(() => questions[currentQuestion], [currentQuestion]);

  // Memoize progress bar width calculation
  const progressBarWidth = useMemo(() => `${((currentQuestion + 1) / questions.length) * 100}%`, [currentQuestion]);

  // Handle option selection with memoization
  const handleOptionToggle = useCallback((option: string) => {
    setAnswers((prevAnswers) => {
      const currentKey = currentQ.key;
      if (currentQ.singleSelect) {
        return { ...prevAnswers, [currentKey]: option };
      } else {
        const currentAnswers = prevAnswers[currentKey] || [];
        const updatedAnswers = currentAnswers.includes(option)
          ? currentAnswers.filter((a: string) => a !== option)
          : [...currentAnswers, option];
        return { ...prevAnswers, [currentKey]: updatedAnswers };
      }
    });
  }, [currentQ]);

  // Submit handler
  const handleSubmit = useCallback(async () => {
    setLoading(true);
    try {
      await onSubmit(answers);
    } catch (error) {
      console.error("Error submitting answers:", error);
    } finally {
      setLoading(false);
    }
  }, [onSubmit, answers]);

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="w-full bg-accent/20 h-1 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: progressBarWidth }}
        />
      </div>

      {/* Question */}
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Question {currentQuestion + 1} of {questions.length}</h2>
        <p className="text-xl">{currentQ.question}</p>
      </div>

      {/* Options */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQ.options.map((option) => (
            <label
              key={option}
              className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-accent/50 cursor-pointer"
            >
              <Checkbox
                checked={
                  currentQ.singleSelect
                    ? answers[currentQ.key] === option
                    : (answers[currentQ.key] || []).includes(option)
                }
                onCheckedChange={() => handleOptionToggle(option)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        {currentQuestion > 0 && (
          <Button onClick={() => setCurrentQuestion((prev) => prev - 1)} variant="outline" className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4" /> Previous
          </Button>
        )}
        <div className="flex-1" />
        {currentQuestion < questions.length - 1 ? (
          <Button onClick={() => setCurrentQuestion((prev) => prev + 1)} className="flex items-center gap-2">
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={loading} className="flex items-center gap-2">
            {loading ? "Submitting..." : "Complete"}
          </Button>
        )}
      </div>
    </div>
  );
};
