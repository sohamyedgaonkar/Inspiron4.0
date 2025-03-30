import React, { useState, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { chatSession } from "@/utils/AiModel";
import TextToSpeech from "@/components/TextToSpeech";
import axios from "axios";
import { 
  BookOpen, 
  FileText, 
  UploadCloud, 
  RefreshCw, 
  Layers, 
  Volume2, 
  PlusCircle, 
  Book, 
  BarChart4 
} from "lucide-react";

interface ResearchPaperResult {
  Summary: string;
  KeyPoints: string[];
  PaperAnalysis: string;
  Topics: string[];
}

interface ComparisonResult {
  criteria: string;
  ratings: { [key: number]: string | number };
  notes: string;
}

interface ResearchPaper {
  title: string | null;
  summary: string | null;
  link: string | null;
}

interface Toast {
  id: string;
  title: string;
  description: string;
  variant: "destructive" | "default";
}

const ResearchPaperAnalyzer = () => {
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<ResearchPaperResult[]>([]);
  const [papers, setPapers] = useState<ResearchPaper[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [comparing, setComparing] = useState(false);
  const [regenerationsLeft, setRegenerationsLeft] = useState(3);
  const [paperText, setPaperText] = useState<string>("");
  const [activeResultIndex, setActiveResultIndex] = useState<number | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonResults, setComparisonResults] = useState<ComparisonResult[]>([]);
  const [savedPapers, setSavedPapers] = useState<ResearchPaper[]>([]);
  const [showLearningPath, setShowLearningPath] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Custom toast function
  const addToast = (toast: Toast) => {
    setToasts((prev) => [...prev, toast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toast.id));
    }, 3000);
  };

  const showToast = ({
    title,
    description,
    variant,
  }: {
    title: string;
    description: string;
    variant: "destructive" | "default";
  }) => {
    addToast({ id: Date.now().toString(), title, description, variant });
  };

  // Extract text from uploaded file
  const extractTextFromFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("pdf", file);

    const response = await fetch("http://127.0.0.1:5000/extract-pdf", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to process the file");
    }

    const data = await response.json();
    return data.text;
  };

  // Analyze research paper and extract key topics
  const analyzeResearchPaper = async (text: string) => {
    setLoading(true);
    try {
      const prompt = `You are an AI researcher. Analyze the provided research paper text and return your findings in strictly valid JSON format:
      {
        "Summary": "a concise summary of the paper",
        "KeyPoints": ["key points or findings from the paper"],
        "PaperAnalysis": "detailed analysis of the paper's contribution",
        "Topics": ["Top 3-5 key topics extracted from the paper for further research"]
      }
      Research Paper Text: ${text}
      Ensure your response is ONLY the JSON object, with no additional text or markdown.`;

      const response = await chatSession.sendMessage(prompt);
      const resultText = await response.response.text();

      const jsonMatch = resultText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Invalid response format");
      }

      const parsedResult = JSON.parse(jsonMatch[0]);

      if (
        !parsedResult.Summary ||
        !Array.isArray(parsedResult.KeyPoints) ||
        !parsedResult.PaperAnalysis ||
        !Array.isArray(parsedResult.Topics)
      ) {
        throw new Error("Invalid response structure");
      }

      // Add the new result to the results array
      const newResults = [...results, parsedResult];
      setResults(newResults);

      // Set the newest result as active
      setActiveResultIndex(newResults.length - 1);

      // Reset comparison view if it was active
      setShowComparison(false);

      fetchResearchPapers(parsedResult.Topics);
    } catch (error) {
      console.error("Error analyzing research paper:", error);
      showToast({
        title: "Analysis Error",
        description: "An error occurred while analyzing the paper. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle initial submission
  const handleSubmit = async () => {
    if (!file) {
      showToast({
        title: "No file selected",
        description: "Please upload a research paper (PDF, Word, or TXT file)",
        variant: "destructive",
      });
      return;
    }

    try {
      // Reset previous results when uploading a new file
      setResults([]);
      setRegenerationsLeft(3);
      setActiveResultIndex(null);
      setShowComparison(false);
      setComparisonResults([]);

      const extractedText = await extractTextFromFile(file);
      setPaperText(extractedText);
      await analyzeResearchPaper(extractedText);
    } catch (error) {
      console.error("Error extracting text:", error);
      showToast({
        title: "Processing Error",
        description: "An error occurred while processing the file. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle regeneration
  const handleRegenerate = async () => {
    if (regenerationsLeft <= 0) {
      showToast({
        title: "Limit Reached",
        description: "You have used all your regenerations.",
        variant: "destructive",
      });
      return;
    }

    if (!paperText) {
      showToast({
        title: "Missing Content",
        description: "No paper text available for regeneration.",
        variant: "destructive",
      });
      return;
    }

    setRegenerationsLeft((prev) => prev - 1);
    await analyzeResearchPaper(paperText);
  };

  // Toggle between analysis results
  const toggleResult = (index: number) => {
    setActiveResultIndex(index);
    setShowComparison(false);
  };

  // Compare all analyses
  const compareAnalyses = async () => {
    if (results.length < 2) {
      showToast({
        title: "Not Enough Analyses",
        description: "Need at least 2 analyses to compare.",
        variant: "destructive",
      });
      return;
    }

    setComparing(true);
    try {
      // Prepare the analyses for comparison
      const analysesForComparison = results.map((result, index) => ({
        id: index + 1,
        summary: result.Summary,
        keyPoints: result.KeyPoints,
        topics: result.Topics,
      }));

      const prompt = `Compare these ${results.length} analyses of the same research paper. Evaluate their relative quality, 
      focusing on comprehensiveness, accuracy of key points captured, and usefulness of extracted topics.
      Return your analysis ONLY as a valid JSON object with this format:
      [
        {
          "criteria": "Comprehensiveness of Summary",
          "ratings": {${analysesForComparison
            .map((a) => `"${a.id}": "rating out of 10"`)
            .join(", ")}},
          "notes": "Which analysis has the most comprehensive summary and why"
        },
        {
          "criteria": "Quality of Key Points",
          "ratings": {${analysesForComparison
            .map((a) => `"${a.id}": "rating out of 10"`)
            .join(", ")}},
          "notes": "Which analysis captured the most relevant key points"
        },
        {
          "criteria": "Usefulness of Topics",
          "ratings": {${analysesForComparison
            .map((a) => `"${a.id}": "rating out of 10"`)
            .join(", ")}},
          "notes": "Which analysis extracted the most useful research topics"
        },
        {
          "criteria": "Overall Quality",
          "ratings": {${analysesForComparison
            .map((a) => `"${a.id}": "rating out of 10"`)
            .join(", ")}},
          "notes": "Final assessment of which analysis is most accurate and useful overall"
        }
      ]
      
      Here are the analyses to compare:
      ${JSON.stringify(analysesForComparison)}`;

      const response = await chatSession.sendMessage(prompt);
      const resultText = await response.response.text();

      const jsonMatch = resultText.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error("Invalid comparison format");
      }

      const parsedComparison = JSON.parse(jsonMatch[0]);
      setComparisonResults(parsedComparison);
      setShowComparison(true);
      setActiveResultIndex(null);
    } catch (error) {
      console.error("Error comparing analyses:", error);
      showToast({
        title: "Comparison Error",
        description: "An error occurred while comparing the analyses. Please try again.",
        variant: "destructive",
      });
    } finally {
      setComparing(false);
    }
  };

  // Fetch research papers from arXiv based on extracted topics
  const fetchResearchPapers = async (topics: string[]) => {
    if (topics.length === 0) {
      showToast({
        title: "Search Error",
        description: "No topics found for search.",
        variant: "destructive",
      });
      return;
    }

    setFetching(true);
    try {
      const query = topics.slice(0, 3).join(" OR "); // Use the top 3 topics for search
      const response = await axios.get(
        `https://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(
          query
        )}&start=0&max_results=5`
      );

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(response.data, "text/xml");
      const entries = xmlDoc.getElementsByTagName("entry");

      const fetchedPapers = Array.from(entries).map((entry) => ({
        title: entry.getElementsByTagName("title")[0].textContent,
        summary: entry.getElementsByTagName("summary")[0].textContent,
        link: entry.getElementsByTagName("id")[0].textContent,
      }));

      setPapers(fetchedPapers);
    } catch (error) {
      console.error("Error fetching research papers:", error);
      showToast({
        title: "Fetch Error",
        description: "Failed to fetch related research papers.",
        variant: "destructive",
      });
    } finally {
      setFetching(false);
    }
  };

  // Combine all text for speech
  const getCombinedText = (result: ResearchPaperResult) => {
    return `Summary: ${result.Summary}. 
            Key Points: ${result.KeyPoints.join(". ")}. 
            Paper Analysis: ${result.PaperAnalysis}`;
  };

  // Add paper to learning path
  const addToLearningPath = (paper: ResearchPaper) => {
    if (savedPapers.some((p) => p.title === paper.title)) {
      showToast({
        title: "Already Added",
        description: "This paper is already in your learning path.",
        variant: "default",
      });
      return;
    }

    setSavedPapers([...savedPapers, paper]);
    showToast({
      title: "Paper Added",
      description: "Research paper added to your learning path!",
      variant: "default",
    });
  };

  // Remove paper from learning path
  const removeFromLearningPath = (paperTitle: string | null) => {
    if (!paperTitle) return;

    setSavedPapers(savedPapers.filter((p) => p.title !== paperTitle));
    showToast({
      title: "Paper Removed",
      description: "Research paper removed from your learning path.",
      variant: "default",
    });
  };

  return (
    <div className="min-h-screen bg-black text-white mx-auto mt-20 px-4 py-10 relative">
      {/* Toast Container */}
      <div className="fixed top-5 right-5 space-y-3 z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded shadow-lg transition transform hover:scale-105 ${
              toast.variant === "destructive" ? "bg-red-600" : "bg-green-600"
            }`}
          >
            <strong className="block">{toast.title}</strong>
            <span className="block text-sm">{toast.description}</span>
          </div>
        ))}
      </div>

      <Card className="w-full max-w-5xl mx-auto shadow-2xl rounded-2xl overflow-hidden backdrop-blur-sm bg-gray-900/80 border border-gray-700">
        <CardHeader className="bg-gray-800">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="h-10 w-10 mr-3 text-indigo-400" />
            <CardTitle className="text-3xl font-bold text-white">Research Pathfinder</CardTitle>
          </div>
          <p className="text-center text-gray-300 max-w-xl mx-auto">
            Upload a research paper to analyze its content, extract key topics, and discover related papers.
          </p>
        </CardHeader>

        <CardContent className="p-8 space-y-8">
          {/* Upload Section */}
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:shadow-lg transition-all">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-400" />
                <h3 className="text-lg font-semibold text-white">Upload Your Research Paper</h3>
              </div>

              <div
                className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-indigo-400 transition-all"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <UploadCloud className="h-12 w-12 mx-auto text-gray-500 mb-2" />
                <p className="text-gray-400 mb-2">
                  {file ? file.name : "Drag and drop your file here or click to browse"}
                </p>
                <p className="text-sm text-gray-500">Supported formats: PDF, Word, TXT</p>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white transition-all"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Analyzing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    Analyze Paper &amp; Find Related
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Learning Path Section */}
          {savedPapers.length > 0 && (
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <div
                className="flex items-center gap-2 mb-4 cursor-pointer select-none"
                onClick={() => setShowLearningPath((prev) => !prev)}
              >
                <Book className="h-5 w-5 text-indigo-400" />
                <h3 className="text-lg font-semibold text-white">
                  Your Learning Path ({savedPapers.length})
                </h3>
              </div>
              {showLearningPath && (
                <div className="space-y-3 mt-2">
                  {savedPapers.map((paper, index) => (
                    <div
                      key={index}
                      className="bg-gray-900 p-4 rounded-lg shadow-sm border border-gray-700 relative flex justify-between items-center"
                    >
                      <div>
                        <h4 className="font-medium text-indigo-400">{paper.title}</h4>
                        <a
                          href={paper.link || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-indigo-400 hover:underline mt-1 inline-block"
                        >
                          View on arXiv
                        </a>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-500 hover:text-red-500 p-1"
                        onClick={() => removeFromLearningPath(paper.title)}
                      >
                        &times;
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          {results.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              <Button
                onClick={handleRegenerate}
                disabled={loading || regenerationsLeft <= 0 || comparing}
                className="bg-emerald-600 hover:bg-emerald-700 text-white transition-all"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Regenerating...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Regenerate Analysis ({regenerationsLeft} left)
                  </span>
                )}
              </Button>

              {results.length >= 2 && (
                <Button
                  onClick={compareAnalyses}
                  disabled={comparing || loading}
                  className="bg-violet-600 hover:bg-violet-700 text-white transition-all"
                >
                  {comparing ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Comparing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <BarChart4 className="h-4 w-4" />
                      Compare All Analyses
                    </span>
                  )}
                </Button>
              )}

              {showComparison && (
                <Button
                  onClick={() => {
                    setShowComparison(false);
                    setActiveResultIndex(results.length - 1);
                  }}
                  variant="outline"
                  className="border-gray-700 text-indigo-400 hover:bg-gray-800"
                >
                  Back to Individual View
                </Button>
              )}
            </div>
          )}

          {/* Result Toggle and Display */}
          {results.length > 0 && !showComparison && (
            <div className="mt-6 space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Layers className="h-5 w-5 text-indigo-400" />
                <h3 className="text-lg font-semibold text-white">Analysis Results</h3>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {results.map((_, index) => (
                  <Button
                    key={index}
                    onClick={() => toggleResult(index)}
                    variant={activeResultIndex === index ? "default" : "outline"}
                    className={
                      activeResultIndex === index
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                        : "border-gray-700 text-indigo-400 hover:bg-gray-800"
                    }
                  >
                    Analysis {index + 1} {index === results.length - 1 ? "(Latest)" : ""}
                  </Button>
                ))}
              </div>

              {activeResultIndex !== null && results[activeResultIndex] && (
                <div className="space-y-6 rounded-xl overflow-hidden bg-gray-800 border border-gray-700 shadow-md">
                  <div className="p-6 bg-gray-900">
                    <h3 className="text-base font-semibold text-indigo-400 mb-2">Summary</h3>
                    <p className="text-lg text-white leading-relaxed">
                      {results[activeResultIndex].Summary}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                    <div className="p-6 bg-gray-800 rounded-xl border border-gray-700 shadow-sm">
                      <h3 className="text-base font-semibold text-indigo-400 mb-2">Key Points</h3>
                      <ul className="space-y-2">
                        {results[activeResultIndex].KeyPoints.map((point, pointIndex) => (
                          <li key={pointIndex} className="flex gap-2 text-white">
                            <span className="text-indigo-400 font-bold">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-6 bg-gray-800 rounded-xl border border-gray-700 shadow-sm">
                      <h3 className="text-base font-semibold text-indigo-400 mb-2">Extracted Topics</h3>
                      <ul className="space-y-2">
                        {results[activeResultIndex].Topics.map((topic, topicIndex) => (
                          <li key={topicIndex} className="flex gap-2 text-white">
                            <span className="text-indigo-400 font-bold">•</span>
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-6 bg-gray-800 rounded-xl border border-gray-700 shadow-sm mx-4 mb-4">
                    <h3 className="text-base font-semibold text-indigo-400 mb-2">Paper Analysis</h3>
                    <p className="text-white whitespace-pre-line leading-relaxed">
                      {results[activeResultIndex].PaperAnalysis}
                    </p>
                  </div>

                  <div className="px-6 pb-6 flex justify-end">
                    <TextToSpeech text={getCombinedText(results[activeResultIndex])} />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Comparison View */}
          {showComparison && comparisonResults.length > 0 && (
            <div className="mt-6 space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <BarChart4 className="h-5 w-5 text-indigo-400" />
                <h3 className="text-lg font-semibold text-white">Analysis Comparison</h3>
              </div>

              <div className="overflow-x-auto bg-gray-800 rounded-xl border border-gray-700 shadow-md">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-900">
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Criteria
                      </th>
                      {results.map((_, index) => (
                        <th
                          key={index}
                          className="py-3 px-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider"
                        >
                          Analysis {index + 1}
                        </th>
                      ))}
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Notes
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {comparisonResults.map((comparison, index) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-gray-800" : "bg-gray-900"}>
                        <td className="py-4 px-4 text-sm font-medium text-white">
                          {comparison.criteria}
                        </td>
                        {results.map((_, analysisIndex) => {
                          const rating = comparison.ratings[analysisIndex + 1];
                          const numericRating =
                            typeof rating === "number"
                              ? rating
                              : parseFloat(
                                  String(rating).match(/\d+(\.\d+)?/)?.[0] || "0"
                                );

                          let ratingColor = "text-white";
                          if (numericRating >= 8)
                            ratingColor = "text-emerald-400 font-bold";
                          else if (numericRating >= 6)
                            ratingColor = "text-indigo-400";
                          else if (numericRating < 5) ratingColor = "text-red-400";

                          return (
                            <td key={analysisIndex} className={`py-4 px-4 text-center ${ratingColor}`}>
                              {rating}
                            </td>
                          );
                        })}
                        <td className="py-4 px-4 text-sm text-gray-400">{comparison.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-6 bg-gray-900 rounded-xl border border-gray-700">
                <h4 className="font-semibold text-indigo-400 mb-2">Recommendation</h4>
                <p className="text-white">
                  Based on the comparison,{" "}
                  <span className="font-bold text-indigo-400">
                    Analysis{" "}
                    {Object.entries(
                      comparisonResults.find(
                        (c) => c.criteria === "Overall Quality"
                      )?.ratings || {}
                    )
                      .sort(
                        (a, b) =>
                          (typeof b[1] === "number"
                            ? b[1]
                            : parseFloat(
                                String(b[1]).match(/\d+(\.\d+)?/)?.[0] || "0"
                              )) -
                          (typeof a[1] === "number"
                            ? a[1]
                            : parseFloat(
                                String(a[1]).match(/\d+(\.\d+)?/)?.[0] || "0"
                              ))
                      )
                      .map(([key]) => key)[0]}
                  </span>{" "}
                  appears to be the most accurate and comprehensive analysis.
                </p>
              </div>
            </div>
          )}

          {/* Display arXiv Papers */}
          {papers.length > 0 && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-5 w-5 text-indigo-400" />
                <h3 className="text-lg font-semibold text-white">Related Research Papers</h3>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {papers.map((paper, index) => (
                  <div
                    key={index}
                    className="p-6 bg-gray-800 rounded-xl border border-gray-700 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between">
                      <h4 className="font-bold text-indigo-400 mb-2">
                        <a
                          href={paper.link ? paper.link : undefined}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {paper.title}
                        </a>
                      </h4>
                      <Button
                        onClick={() => addToLearningPath(paper)}
                        size="sm"
                        className="bg-gray-700 hover:bg-gray-600 text-indigo-400 h-8"
                      >
                        <span className="flex items-center gap-1">
                          <PlusCircle className="h-3.5 w-3.5" />
                          Add to Learning Path
                        </span>
                      </Button>
                    </div>
                    <p className="text-gray-400 mt-2 text-sm">
                      {paper.summary && paper.summary.length > 300
                        ? `${paper.summary.substring(0, 300)}...`
                        : paper.summary}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResearchPaperAnalyzer;