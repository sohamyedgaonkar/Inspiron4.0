
//correct code latest
"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { chatSession } from '@/utils/AiModel';
import { jsPDF } from 'jspdf';
// import { useRouter } from 'next/navigation';
import { useNavigate } from 'react-router-dom';

interface ATSResult {
  JDMatch: string;
  MissingKeywords: string[];
  ProfileSummary: string;
  ScoreBreakdown: {
    KeywordMatch: string;
    ExperienceMatch: string;
    SkillsMatch: string;
    EducationMatch: string;
  };
}

interface CareerSuggestion {
  careerPath: string;
  courses: string[];
}

interface KeywordTopics {
  [topic: string]: string[];
}

const ATSAnalyzer = () => {
//   const router = useRouter();
  const navigate = useNavigate();
  const [jobDescription, setJobDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<ATSResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [careerSuggestions, setCareerSuggestions] = useState<CareerSuggestion | null>(null);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [keywordTopics, setKeywordTopics] = useState<KeywordTopics | null>(null);
  const [showTopics, setShowTopics] = useState(false);
  const [topicsLoading, setTopicsLoading] = useState(false);

  // Load data from localStorage when component mounts
  useEffect(() => {
    const storedJobDescription = localStorage.getItem('jobDescription');
    if (storedJobDescription) {
      setJobDescription(storedJobDescription);
    }

    const storedResult = localStorage.getItem('atsResult');
    if (storedResult) {
      setResult(JSON.parse(storedResult));
    }

    const storedKeywordTopics = localStorage.getItem('keywordTopics');
    if (storedKeywordTopics) {
      setKeywordTopics(JSON.parse(storedKeywordTopics));
    }

    const storedShowTopics = localStorage.getItem('showTopics');
    if (storedShowTopics) {
      setShowTopics(JSON.parse(storedShowTopics));
    }
  }, []);

  // Save job description to localStorage whenever it changes
  useEffect(() => {
    if (jobDescription) {
      localStorage.setItem('jobDescription', jobDescription);
    }
  }, [jobDescription]);

  const extractTextFromPDFs = async (files: File[]): Promise<string> => {
    let combinedText = '';
    for (const file of files) {
      const formData = new FormData();
      formData.append('pdf', file);

      const response = await fetch('http://127.0.0.1:5000/extract-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process PDF');
      }

      const data = await response.json();
      combinedText += data.text + '\n';
    }
    return combinedText;
  };

  const handleSubmit = async () => {
    if (files.length === 0 || !jobDescription) {
      alert('Please provide both a resume and job description');
      return;
    }

    setLoading(true);
    try {
      const resumeText = await extractTextFromPDFs(files);

      const prompt = `You are an ATS (Applicant Tracking System) expert with deep understanding of tech fields including software engineering, data science, data analysis, and big data engineering. Analyze the provided resume against the job description. Return your analysis in strictly valid JSON format with the following structure:
      {
        "JDMatch": "percentage as string with % symbol",
        "MissingKeywords": ["array of missing important keywords"],
        "ProfileSummary": "detailed profile analysis",
        "ScoreBreakdown": {
          "KeywordMatch": "percentage as string with % symbol",
          "ExperienceMatch": "percentage as string with % symbol",
          "SkillsMatch": "percentage as string with % symbol",
          "EducationMatch": "percentage as string with % symbol"
        }
      }

      Resume text: ${resumeText}
      Job Description: ${jobDescription}

      Ensure your response is ONLY the JSON object, with no additional text or markdown.`;

      const response = await chatSession.sendMessage(prompt);
      const resultText = await response.response.text();

      const jsonMatch = resultText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format');
      }

      const parsedResult = JSON.parse(jsonMatch[0]);

      if (!parsedResult.JDMatch || !Array.isArray(parsedResult.MissingKeywords) || !parsedResult.ProfileSummary || !parsedResult.ScoreBreakdown) {
        throw new Error('Invalid response structure');
      }

      // Save result to state and localStorage
      setResult(parsedResult);
      localStorage.setItem('atsResult', JSON.stringify(parsedResult));
      
      // Reset keyword topics
      setKeywordTopics(null);
      localStorage.removeItem('keywordTopics');
      
      setShowTopics(false);
      localStorage.setItem('showTopics', 'false');
    } catch (error) {
      console.error('Error analyzing resume:', error);
      alert('An error occurred while analyzing the resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const analyzeKeywordTopics = async () => {
    if (!result || !result.MissingKeywords || result.MissingKeywords.length === 0) {
      alert('No missing keywords to analyze');
      return;
    }
    
    setTopicsLoading(true);
    try {
      const prompt = `
        You are a career and technology expert. Analyze the following list of missing keywords from a job application and group them into meaningful technology/skill categories or topics.
        
        Missing keywords: ${result.MissingKeywords.join(', ')}
        
        Return your analysis in strictly valid JSON format with the following structure:
        {
          "categories": {
            "category1": ["keyword1", "keyword2"],
            "category2": ["keyword3", "keyword4"],
            ...
          }
        }
        
        Use 3-7 categories maximum. Group similar technologies and skills together. Categories should be meaningful in a technical/professional context (like "Cloud Technologies", "Programming Languages", "Data Analysis Tools", etc.).
        
        Ensure your response is ONLY the JSON object, with no additional text or markdown.
      `;

      const response = await chatSession.sendMessage(prompt);
      const resultText = await response.response.text();

      const jsonMatch = resultText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format');
      }

      const parsedResult = JSON.parse(jsonMatch[0]);
      
      if (!parsedResult.categories) {
        throw new Error('Invalid response structure');
      }

      // Save keyword topics to state and localStorage
      setKeywordTopics(parsedResult.categories);
      localStorage.setItem('keywordTopics', JSON.stringify(parsedResult.categories));
      
      setShowTopics(true);
      localStorage.setItem('showTopics', 'true');
    } catch (error) {
      console.error('Error analyzing keyword topics:', error);
      alert('An error occurred while analyzing keyword topics. Please try again.');
    } finally {
      setTopicsLoading(false);
    }
  };

  const navigateToRoadmap = (topic: string, keywords: string[]) => {
    // Store the data in localStorage to pass to the roadmap page
    const roadmapData = {
      topic,
      keywords,
      jobDescription: jobDescription
    };
    
    localStorage.setItem('roadmapData', JSON.stringify(roadmapData));
    
    // Redirect to roadmap page
    // router.push('/roadmap');
    navigate('/roadmap');
  };

  const clearAllData = () => {
    // Clear state
    setResult(null);
    setKeywordTopics(null);
    setShowTopics(false);
    
    // Clear localStorage
    localStorage.removeItem('atsResult');
    localStorage.removeItem('keywordTopics');
    localStorage.removeItem('showTopics');
    
    // Optionally clear job description too
    // setJobDescription('');
    // localStorage.removeItem('jobDescription');
  };

  const downloadReport = () => {
    if (!result) return;

    const doc = new jsPDF();
    
    // Function to wrap text inside a defined width
    const wrapText = (text: string, x: number, y: number, maxWidth: number) => {
      const wrappedText = doc.splitTextToSize(text, maxWidth);
      doc.text(wrappedText, x, y);
      return y + (wrappedText.length * 10);  // Adjust y position based on the number of lines
    };

    // Add JDMatch Section
    doc.setFontSize(16);
    doc.text('JD Match:', 10, 10);
    doc.setFontSize(12);
    let yPosition = 20;
    yPosition = wrapText(result.JDMatch, 10, yPosition, 180);  // 180 is the maxWidth for wrapping

    // Add Score Breakdown Section
    doc.setFontSize(16);
    doc.text('Score Breakdown:', 10, yPosition);
    doc.setFontSize(12);
    yPosition += 10;

    const scoreBreakdown = result.ScoreBreakdown;
    yPosition = wrapText(`Keyword Match: ${scoreBreakdown.KeywordMatch}`, 10, yPosition, 180);
    yPosition = wrapText(`Experience Match: ${scoreBreakdown.ExperienceMatch}`, 10, yPosition, 180);
    yPosition = wrapText(`Skills Match: ${scoreBreakdown.SkillsMatch}`, 10, yPosition, 180);
    yPosition = wrapText(`Education Match: ${scoreBreakdown.EducationMatch}`, 10, yPosition, 180);

    // Add Missing Keywords Section
    doc.setFontSize(16);
    doc.text('Missing Keywords:', 10, yPosition);
    doc.setFontSize(12);
    yPosition += 10;

    result.MissingKeywords.forEach((keyword, index) => {
      yPosition = wrapText(`${index + 1}. ${keyword}`, 10, yPosition, 180);
    });

    // Add Keyword Topics Section if available
    if (keywordTopics) {
      doc.setFontSize(16);
      doc.text('Keyword Topics:', 10, yPosition);
      doc.setFontSize(12);
      yPosition += 10;

      Object.keys(keywordTopics).forEach(topic => {
        yPosition = wrapText(`${topic}:`, 10, yPosition, 180);
        keywordTopics[topic].forEach((keyword, index) => {
          yPosition = wrapText(`  - ${keyword}`, 10, yPosition, 180);
        });
        yPosition += 5; // Add space between topics
      });
    }

    // Add Profile Summary Section
    doc.setFontSize(16);
    doc.text('Profile Summary:', 10, yPosition);
    doc.setFontSize(12);
    yPosition += 10;

    yPosition = wrapText(result.ProfileSummary, 10, yPosition, 180);

    // Save the PDF
    doc.save('ATS_Analysis_Report.pdf');
  };

  // Add this function to fetch LinkedIn job data
  const [linkedInJobs, setLinkedInJobs] = useState<any[]>([]);
  
  useEffect(() => {
    // Fetch LinkedIn jobs data when component mounts
    const fetchLinkedInJobs = async () => {
      try {
        const response = await fetch('/src/pages/linkedin_jobs_ML_Intern.json');
        const data = await response.json();
        // Get first 5 jobs
        setLinkedInJobs(data.slice(0, 5));
      } catch (error) {
        console.error('Error fetching LinkedIn jobs:', error);
      }
    };
    
    fetchLinkedInJobs();
  }, []);

  return (
    <Card className="w-full max-w-4xl mx-auto mt-20 bg-black text-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-white">Smart ATS</CardTitle>
        <p className="text-center text-gray-400">Improve Your Resume ATS</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Job Description</label>
          <Textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here..."
            className="h-32 bg-gray-800 text-white border-gray-600"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Upload Resume</label>
          <input
            type="file"
            accept=".pdf"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files || []))}
            className="w-full bg-gray-800 text-gray-300 border-gray-600"
          />
          <p className="text-sm text-gray-500">Please upload PDF files</p>
        </div>

        <div className="flex space-x-2">
          <Button 
            onClick={handleSubmit} 
            disabled={loading}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {loading ? 'Analyzing...' : 'Submit'}
          </Button>
          
          {result && (
            <Button 
              onClick={clearAllData} 
              variant="destructive"
              className="w-1/4 bg-red-600 hover:bg-red-700 text-white"
            >
              Clear Results
            </Button>
          )}
        </div>

        {result && (
          <div id="report-content" className="mt-6 space-y-4">
            <div className="p-4 bg-gray-800 rounded-lg">
              <h3 className="font-semibold text-indigo-400">JD Match</h3>
              <p className="text-2xl font-bold text-emerald-400">{result.JDMatch}</p>
            </div>

            <div className="p-4 bg-gray-800 rounded-lg">
              <h3 className="font-semibold text-indigo-400">Score Breakdown</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Keyword Match</p>
                  <p className="text-lg text-white font-bold">{result.ScoreBreakdown.KeywordMatch}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Experience Match</p>
                  <p className="text-lg text-white font-bold">{result.ScoreBreakdown.ExperienceMatch}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Skills Match</p>
                  <p className="text-lg text-white font-bold">{result.ScoreBreakdown.SkillsMatch}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Education Match</p>
                  <p className="text-lg text-white font-bold">{result.ScoreBreakdown.EducationMatch}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-800 rounded-lg">
              <h3 className="font-semibold text-indigo-400">Missing Keywords</h3>
              <ul className="list-disc list-inside text-gray-300">
                {result.MissingKeywords.map((keyword, index) => (
                  <li key={index}>{keyword}</li>
                ))}
              </ul>
              
              <div className="mt-4">
                <Button 
                  onClick={analyzeKeywordTopics} 
                  disabled={topicsLoading}
                  variant="outline"
                  className="w-full bg-gray-700 hover:bg-gray-600 text-indigo-400"
                >
                  {topicsLoading ? 'Analyzing Topics...' : 'Analyze Missing Keywords by Topic'}
                </Button>
              </div>
            </div>
            
            {showTopics && keywordTopics && (
              <div className="p-4 bg-gray-800 rounded-lg">
                <h3 className="font-semibold text-indigo-400">Keyword Topics</h3>
                <div className="mt-3 space-y-4">
                  {Object.keys(keywordTopics).map((topic, index) => (
                    <div key={index} className="border rounded-md p-3 border-gray-700">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-emerald-400">{topic}</h4>
                        <Button 
                          variant="default"
                          size="sm"
                          className="bg-indigo-600 hover:bg-indigo-700 text-white"
                          onClick={() => navigateToRoadmap(topic, keywordTopics[topic])}
                        >
                          Generate Roadmap
                        </Button>
                      </div>
                      <ul className="mt-2 list-disc list-inside text-gray-300">
                        {keywordTopics[topic].map((keyword, idx) => (
                          <li key={idx}>{keyword}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 bg-gray-800 rounded-lg">
              <h3 className="font-semibold text-indigo-400">Profile Summary</h3>
              <p className="text-gray-300 whitespace-pre-line">{result.ProfileSummary}</p>
            </div>

            <Button onClick={downloadReport} className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white">
              Download Analysis Report (PDF)
            </Button>
            
            {/* Add LinkedIn Jobs Section */}
            <div className="p-4 bg-gray-800 rounded-lg">
              <h3 className="font-semibold text-indigo-400 mb-4">Recommended Job Opportunities</h3>
              <div className="space-y-3">
                {linkedInJobs.map((job, index) => (
                  <div key={index} className="border border-gray-700 rounded-md p-3 flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-emerald-400">{job.Title}</h4>
                      <p className="text-gray-300">{job.Company} • {job.Location}</p>
                    </div>
                    <a 
                      href={job.Link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      Apply
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ATSAnalyzer;

