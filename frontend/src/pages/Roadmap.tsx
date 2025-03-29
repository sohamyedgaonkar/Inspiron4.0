import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from "react-router-dom";
import { chatSession } from '@/utils/AiModel';
import { ExternalLink, BookOpen, Video, FileText } from 'lucide-react';

interface RoadmapData {
  topic: string;
  keywords: string[];
  jobDescription: string;
}

interface RoadmapStep {
  title: string;
  description: string;
  resources: {
    name: string;
    url?: string;
    type: string;
  }[];
  timeEstimate: string;
}

const RoadmapPage = () => {
  const navigate = useNavigate();
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [roadmap, setRoadmap] = useState<RoadmapStep[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load data from localStorage on component mount
    try {
      const storedData = localStorage.getItem('roadmapData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setRoadmapData(parsedData);
        generateRoadmap(parsedData);
      } else {
        setError('No roadmap data found. Please go back and select a topic.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error loading roadmap data:', error);
      setError('Error loading roadmap data. Please try again.');
      setLoading(false);
    }
  }, []);

  const generateRoadmap = async (data: RoadmapData) => {
    setLoading(true);
    try {
      const prompt = `
        You are an expert career coach and technical trainer. Create a detailed learning roadmap for someone who needs to develop skills in "${data.topic}".
        
        Specifically, they need to learn about the following keywords that were missing from their resume:
        ${data.keywords.join(', ')}
        
        Here's the job description they're targeting:
        ${data.jobDescription}
        
        Create a step-by-step roadmap with 4-6 clear steps that will help them develop these skills efficiently.
        
        Return your response in strictly valid JSON format with the following structure:
        {
          "steps": [
            {
              "title": "Step title",
              "description": "Detailed explanation of what to learn and why it matters",
              "resources": [
                {
                  "name": "Resource name",
                  "url": "URL for the resource (REQUIRED - provide a valid URL for all resources)",
                  "type": "book, course, tutorial, documentation, etc."
                }
              ],
              "timeEstimate": "Estimated time to complete this step"
            }
          ]
        }
        
        Ensure your steps are practical, specific to the keywords, and relevant to the job description.
        Recommend high-quality, current resources that are industry-recognized.
        For each step, include 2-3 resources.
        
        IMPORTANT: You MUST provide a valid URL for EVERY resource. For example:
        - For books: link to Amazon, Goodreads, or the publisher's website
        - For courses: link to the course platform (Coursera, Udemy, edX, etc.)
        - For documentation: link to the official documentation website
        - For tutorials: link to the tutorial webpage
        
        Ensure your response is ONLY the JSON object, with no additional text or markdown.
      `;

      const response = await chatSession.sendMessage(prompt);
      const resultText = await response.response.text();

      const jsonMatch = resultText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format');
      }

      const parsedResult = JSON.parse(jsonMatch[0]);
      
      if (!parsedResult.steps || !Array.isArray(parsedResult.steps)) {
        throw new Error('Invalid response structure');
      }

      // Process the resources to ensure all have URLs
      const processedSteps = parsedResult.steps.map(step => ({
        ...step,
        resources: step.resources.map(resource => ({
          ...resource,
          // If URL is missing or empty, add a default search URL
          url: resource.url && resource.url.trim() !== '' 
            ? resource.url 
            : `https://www.google.com/search?q=${encodeURIComponent(resource.name + ' ' + resource.type)}`
        }))
      }));

      setRoadmap(processedSteps);
    } catch (error) {
      console.error('Error generating roadmap:', error);
      setError('An error occurred while generating your roadmap. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  // Function to handle resource clicks
  const handleResourceClick = (resource: { name: string; url?: string; type: string }) => {
    if (resource.url && resource.url.trim() !== '') {
      // Open external links in a new tab
      window.open(resource.url, '_blank', 'noopener,noreferrer');
    }
  };

  // Function to get the appropriate icon based on resource type
  const getResourceIcon = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('book')) return <BookOpen className="h-4 w-4" />;
    if (lowerType.includes('course') || lowerType.includes('tutorial') || lowerType.includes('video')) return <Video className="h-4 w-4" />;
    if (lowerType.includes('doc')) return <FileText className="h-4 w-4" />;
    return <ExternalLink className="h-4 w-4" />;
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4 bg-black text-white">
      <Button onClick={goBack} variant="outline" className="mb-6 border-gray-700 text-gray-300 hover:bg-gray-800">
        ← Back to Analysis
      </Button>
      
      <Card className="bg-gray-900 shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">
            {roadmapData ? `Learning Roadmap: ${roadmapData.topic}` : 'Learning Roadmap'}
          </CardTitle>
          {roadmapData && (
            <div className="mt-2 text-sm text-gray-400">
              <p>Keywords: {roadmapData.keywords.join(', ')}</p>
            </div>
          )}
        </CardHeader>
        
        <CardContent>
          {loading && (
            <div className="text-center py-10">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
              <p className="mt-4 text-gray-300">Generating your personalized learning roadmap...</p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-600 text-white p-4 rounded-md">
              <p>{error}</p>
            </div>
          )}
          
          {roadmap && (
            <div className="space-y-6">
              {roadmap.map((step, index) => (
                <div key={index} className="border border-gray-700 rounded-lg p-6 bg-gray-800">
                  <div className="flex items-start">
                    <div className="bg-indigo-600 text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 mt-1 text-lg font-bold">
                      {index + 1}
                    </div>
                    <div className="ml-6">
                      <h3 className="text-2xl font-semibold text-indigo-400">{step.title}</h3>
                      <p className="mt-2 text-gray-300">{step.description}</p>
                      
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-300">Resources:</h4>
                        <ul className="mt-2 space-y-3">
                          {step.resources.map((resource, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="inline-block w-8 h-8 bg-emerald-600 text-white rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold mr-3">
                                {idx + 1}
                              </span>
                              <div className="flex-1">
                                <button 
                                  className="flex items-center text-left group hover:bg-gray-700 p-2 rounded-md w-full transition-colors"
                                  onClick={() => handleResourceClick(resource)}
                                >
                                  <div className="mr-3 text-indigo-400">
                                    {getResourceIcon(resource.type)}
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-medium group-hover:text-indigo-400 transition-colors">
                                      {resource.name}
                                    </p>
                                    <div className="flex items-center">
                                      <p className="text-sm text-gray-400">{resource.type}</p>
                                      <ExternalLink className="ml-1 h-4 w-4 text-gray-500" />
                                    </div>
                                  </div>
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="mt-4 inline-block bg-gray-700 px-4 py-2 rounded-full text-sm text-gray-300">
                        Estimated time: <span className="font-semibold text-white">{step.timeEstimate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RoadmapPage;

