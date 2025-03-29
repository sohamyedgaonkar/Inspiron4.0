import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import QuizSetup from "@/components/quiz/QuizSetup";
import QuizResult from "@/components/quiz/QuizResult";
import QuestionCard from "@/components/quiz/QuestionCard";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string;
}

const machineLearningQuestions: Question[] = [
  {
    id: 1,
    question: "What is Machine Learning?",
    options: [
      "A subset of Artificial Intelligence that enables systems to learn from data",
      "A programming language",
      "A type of database",
      "A cloud computing service"
    ],
    answer: "A subset of Artificial Intelligence that enables systems to learn from data"
  },
  {
    id: 2,
    question: "Which type of Machine Learning is used when labeled data is available?",
    options: [
      "Supervised Learning",
      "Unsupervised Learning",
      "Reinforcement Learning",
      "Deep Learning"
    ],
    answer: "Supervised Learning"
  },
  {
    id: 3,
    question: "What is the purpose of a loss function in Machine Learning?",
    options: [
      "To measure how well a model's predictions match the actual values",
      "To store training data",
      "To improve database performance",
      "To generate new datasets"
    ],
    answer: "To measure how well a model's predictions match the actual values"
  },
  {
    id: 4,
    question: "Which algorithm is commonly used for classification problems?",
    options: [
      "Logistic Regression",
      "K-Means Clustering",
      "K-Nearest Neighbors",
      "Principal Component Analysis (PCA)"
    ],
    answer: "Logistic Regression"
  },
  {
    id: 5,
    question: "What is overfitting in Machine Learning?",
    options: [
      "When a model learns noise instead of patterns",
      "When a model generalizes well to new data",
      "When a model is too simple",
      "When a dataset contains missing values"
    ],
    answer: "When a model learns noise instead of patterns"
  }
];

const pythonQuestions: Question[] = [
  {
    id: 1,
    question: "What is Python?",
    options: [
      "A high-level programming language",
      "A type of database",
      "An operating system",
      "A web development framework"
    ],
    answer: "A high-level programming language"
  },
  {
    id: 2,
    question: "Which keyword is used to define a function in Python?",
    options: [
      "def",
      "function",
      "define",
      "func"
    ],
    answer: "def"
  },
  {
    id: 3,
    question: "What is the output of `print(2 ** 3)` in Python?",
    options: [
      "8",
      "6",
      "9",
      "5"
    ],
    answer: "8"
  },
  {
    id: 4,
    question: "Which data type is mutable in Python?",
    options: [
      "List",
      "Tuple",
      "String",
      "Integer"
    ],
    answer: "List"
  },
  {
    id: 5,
    question: "Which module is used for handling JSON data in Python?",
    options: [
      "json",
      "os",
      "sys",
      "re"
    ],
    answer: "json"
  }
];

const nodejsQuestions: Question[] = [
  {
    id: 1,
    question: "What is Node.js?",
    options: [
      "A JavaScript runtime built on Chrome's V8 engine",
      "A frontend framework",
      "A relational database",
      "A CSS preprocessor"
    ],
    answer: "A JavaScript runtime built on Chrome's V8 engine"
  },
  {
    id: 2,
    question: "Which module is used to create a web server in Node.js?",
    options: [
      "http",
      "fs",
      "path",
      "url"
    ],
    answer: "http"
  },
  {
    id: 3,
    question: "What is npm?",
    options: [
      "A package manager for JavaScript",
      "A Node.js framework",
      "A programming language",
      "A database management system"
    ],
    answer: "A package manager for JavaScript"
  },
  {
    id: 4,
    question: "Which of the following is NOT a built-in module in Node.js?",
    options: [
      "express",
      "http",
      "fs",
      "path"
    ],
    answer: "express"
  },
  {
    id: 5,
    question: "Which function is used to read files in Node.js asynchronously?",
    options: [
      "fs.readFile",
      "fs.open",
      "fs.writeFile",
      "fs.createReadStream"
    ],
    answer: "fs.readFile"
  }
];

const dataScienceQuestions: Question[] = [
  {
    id: 1,
    question: "What is Data Science?",
    options: [
      "A field that combines statistics, programming, and domain expertise to extract insights from data",
      "A database management system",
      "A software testing method",
      "A web development framework"
    ],
    answer: "A field that combines statistics, programming, and domain expertise to extract insights from data"
  },
  {
    id: 2,
    question: "Which programming language is most commonly used in Data Science?",
    options: [
      "Python",
      "Java",
      "C++",
      "Swift"
    ],
    answer: "Python"
  },
  {
    id: 3,
    question: "What is the purpose of Pandas in Data Science?",
    options: [
      "Data manipulation and analysis",
      "Web development",
      "Deep learning",
      "Image processing"
    ],
    answer: "Data manipulation and analysis"
  },
  {
    id: 4,
    question: "Which visualization library is commonly used in Python for Data Science?",
    options: [
      "Matplotlib",
      "Django",
      "Flask",
      "TensorFlow"
    ],
    answer: "Matplotlib"
  },
  {
    id: 5,
    question: "What is the full form of SQL?",
    options: [
      "Structured Query Language",
      "Sequential Query Language",
      "System Query Language",
      "Scripted Query Language"
    ],
    answer: "Structured Query Language"
  }
];

const reactQuestions: Question[] = [
  {
    id: 1,
    question: "What is React?",
    options: [
      "A JavaScript library for building user interfaces",
      "A programming language",
      "A database management system",
      "An operating system"
    ],
    answer: "A JavaScript library for building user interfaces"
  },
  {
    id: 2,
    question: "What is JSX?",
    options: [
      "A JavaScript extension for XML",
      "A Java XML parser",
      "A JSON formatter",
      "A JavaScript testing framework"
    ],
    answer: "A JavaScript extension for XML"
  },
  {
    id: 3,
    question: "What is a React component?",
    options: [
      "A reusable piece of UI",
      "A database table",
      "A CSS framework",
      "A JavaScript variable"
    ],
    answer: "A reusable piece of UI"
  },
  {
    id: 4,
    question: "What is the virtual DOM?",
    options: [
      "A lightweight copy of the actual DOM",
      "A web browser",
      "A programming language",
      "A React component"
    ],
    answer: "A lightweight copy of the actual DOM"
  },
  {
    id: 5,
    question: "What hook is used for side effects in React?",
    options: [
      "useEffect",
      "useState",
      "useContext",
      "useReducer"
    ],
    answer: "useEffect"
  }
];

const Quiz = () => {
  const [showQuiz, setShowQuiz] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleStartQuiz = async (topic: string, selectedDifficulty: string) => {
  setIsLoading(true);
  try {
    const response = await fetch("http://127.0.0.1:5000/generate-quiz", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ topic }),
    });
    const data = await response.json();
    console.log(data);
    
    if (response.ok) {
      setQuestions(data.questions);
      setShowQuiz(true);
      setAnswers({});
    } else {
      throw new Error(data.error || "Failed to fetch quiz questions");
    }
  } catch (error) {
    console.error("Error generating quiz:", error);
    toast({
      title: "Error",
      description: "Failed to generate quiz questions. Please try again.",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};

  const handleSubmit = () => {
    if (Object.keys(answers).length < questions.length) {
      setShowWarning(true);
      return;
    }
    setShowResults(true);
  };

  const calculateScore = () => {
    const correctAnswers = questions.filter(
      (q) => answers[q.id] === q.answer
    ).length;
    return Math.round((correctAnswers / questions.length) * 100);
  };

  const handleRetry = () => {
    setShowResults(false);
    setShowQuiz(false);
    setAnswers({});
    setQuestions([]);
  };

  const handleAnalyze = () => {
    toast({
      title: "Coming Soon",
      description: "Performance analysis will be available in the next update.",
    });
  };

  if (!showQuiz) {
    return <QuizSetup onStartQuiz={handleStartQuiz} isLoading={isLoading} />;
  }

  return (
    <div className="container mx-auto py-8 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-8">
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

          <Button
            onClick={handleSubmit}
            className="w-full animate-fade-up"
            style={{ animationDelay: `${(questions.length + 1) * 100}ms` }}
          >
            Submit Quiz
          </Button>
        </div>
      </div>

      <Dialog open={showWarning} onOpenChange={setShowWarning}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Warning</DialogTitle>
            <DialogDescription>
              Please answer all questions before submitting.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowWarning(false)}>Continue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <QuizResult
        isOpen={showResults}
        onClose={() => setShowResults(false)}
        score={calculateScore()}
        onRetry={handleRetry}
        onAnalyze={handleAnalyze}
      />
    </div>
  );
};

export default Quiz;


// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { useToast } from "@/hooks/use-toast";
// import QuizSetup from "@/components/quiz/QuizSetup";
// import QuizResult from "@/components/quiz/QuizResult";
// import QuestionCard from "@/components/quiz/QuestionCard";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";

// interface Question {
//   id: number;
//   question: string;
//   options: string[];
//   answer: string;
// }

// const Quiz = () => {
//   const [showQuiz, setShowQuiz] = useState(false);
//   const [questions, setQuestions] = useState<Question[]>([]);
//   const [answers, setAnswers] = useState<Record<number, string>>({});
//   const [showResults, setShowResults] = useState(false);
//   const [showWarning, setShowWarning] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const { toast } = useToast();

//   // ✅ Ensuring process.env is accessible only if defined
//   const API_URL = "http://127.0.0.1:5000"

//   const handleStartQuiz = async (topic: string, selectedDifficulty: string) => {
//     if (!API_URL) {
//       toast({
//         title: "Error",
//         description: "API URL is not set. Please configure it in .env.local",
//         variant: "destructive",
//       });
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const response = await fetch(`${API_URL}/generate-quiz`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ topic, difficulty: selectedDifficulty }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || "Failed to fetch quiz questions");
//       }

//       setQuestions(data.questions);
//       setShowQuiz(true);
//       setAnswers({});
//     } catch (error) {
//       console.error("Error generating quiz:", error);
//       toast({
//         title: "Error",
//         description: "Failed to generate quiz questions. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSubmit = () => {
//     if (Object.keys(answers).length < questions.length) {
//       setShowWarning(true);
//       return;
//     }
//     setShowResults(true);
//   };

//   const calculateScore = () => {
//     const correctAnswers = questions.filter((q) => answers[q.id] === q.answer).length;
//     return Math.round((correctAnswers / questions.length) * 100);
//   };

//   const handleRetry = () => {
//     setShowResults(false);
//     setShowQuiz(false);
//     setAnswers({});
//     setQuestions([]);
//   };

//   const handleAnalyze = () => {
//     toast({
//       title: "Coming Soon",
//       description: "Performance analysis will be available in the next update.",
//     });
//   };

//   if (!showQuiz) {
//     return <QuizSetup onStartQuiz={handleStartQuiz} isLoading={isLoading} />;
//   }

//   return (
//     <div className="container mx-auto py-8 px-4 min-h-screen">
//       <div className="max-w-4xl mx-auto space-y-8">
//         {questions.map((question) => (
//           <QuestionCard
//             key={question.id}
//             question={question}
//             selectedAnswer={answers[question.id] || ""}
//             onAnswerChange={(answer) =>
//               setAnswers((prev) => ({ ...prev, [question.id]: answer }))
//             }
//           />
//         ))}

//         <Button
//           onClick={handleSubmit}
//           className="w-full animate-fade-up"
//           style={{ animationDelay: `${(questions.length || 1) * 100}ms` }}
//         >
//           Submit Quiz
//         </Button>
//       </div>

//       {/* ✅ FIX: Corrected Dialog Structure (No Nested <p> Tags) */}
//       <Dialog open={showWarning} onOpenChange={setShowWarning}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Warning</DialogTitle>
//           </DialogHeader>
//           <div className="text-gray-600">Please answer all questions before submitting.</div>
//           <DialogFooter>
//             <Button onClick={() => setShowWarning(false)}>Continue</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <QuizResult
//         isOpen={showResults}
//         onClose={() => setShowResults(false)}
//         score={calculateScore()}
//         onRetry={handleRetry}
//         onAnalyze={handleAnalyze}
//       />
//     </div>
//   );
// };

// export default Quiz;
