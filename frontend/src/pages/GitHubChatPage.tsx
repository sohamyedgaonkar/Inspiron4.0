"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { chatSession } from "@/utils/AiModel";

// GitHub API helper with environment variable token
// Fix the GitHub API headers
const getGithubApi = () => {
  const token = import.meta.env.VITE_PUBLIC_GITHUB_PAT;
  
  return axios.create({
    baseURL: 'https://api.github.com',
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json'
    }
  });
};

// Fix template literals in className
const FileCard = ({ fileName, onAnalyze, isActive }) => (
  <div 
    className={`flex justify-between items-center p-3 ${isActive ? 'bg-blue-800' : 'bg-gray-800'} rounded-lg hover:bg-gray-700 transition-colors duration-200`}
  >
    <span className="font-medium text-white truncate flex-1 mr-2">{fileName}</span>
    <button 
      onClick={() => onAnalyze(fileName)}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Analyze File
    </button>
  </div>
);

const ProjectOverview = ({ overview }) => {
  if (!overview) return null;

  return (
    <div className="bg-gray-900 shadow-lg rounded-lg p-6 mt-4 transition-all duration-300 hover:shadow-xl">
      <h3 className="text-2xl font-bold mb-4 text-white flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        Project Overview
      </h3>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800 p-3 rounded-lg">
            <span className="font-semibold text-blue-400">Project Name:</span> 
            <span className="text-white ml-2">{overview.projectName}</span>
          </div>
          <div className="bg-gray-800 p-3 rounded-lg">
            <span className="font-semibold text-blue-400">Complexity:</span> 
            <span className={`ml-2 px-2 py-1 rounded text-white ${
              overview.complexity === 'High' ? 'bg-red-600' : 
              overview.complexity === 'Medium' ? 'bg-yellow-600' : 
              'bg-green-600'
            }`}>
              {overview.complexity}
            </span>
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg">
          <h4 className="font-semibold mb-2 text-blue-400">Purpose</h4>
          <p className="text-gray-300">{overview.purpose}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h4 className="font-semibold mb-2 text-blue-400">Key Features</h4>
            <ul className="space-y-1">
              {overview.keyFeatures.map((feature, index) => (
                <li key={index} className="text-gray-300 flex items-start">
                  <span className="text-green-500 mr-2">•</span> {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg">
            <h4 className="font-semibold mb-2 text-blue-400">Technologies Used</h4>
            <div className="flex flex-wrap gap-2">
              {overview.technologiesUsed.map((tech, index) => (
                <span key={index} className="bg-blue-900 text-blue-200 px-2 py-1 rounded text-sm">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FileAnalysis = ({ fileResponse }) => {
  if (!fileResponse) return null;

  return (
    <div className="mt-4 bg-gray-800 p-6 rounded-lg shadow-sm transition-all duration-300 hover:shadow-xl" id="file-analysis">
      <h3 className="text-2xl font-bold mb-4 text-white flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
        File Analysis: {fileResponse.fileName}
      </h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-900 p-3 rounded-lg">
            <span className="font-semibold text-blue-400">File Type:</span> 
            <span className="text-white ml-2">{fileResponse.fileType}</span>
          </div>
          <div className="bg-gray-900 p-3 rounded-lg">
            <span className="font-semibold text-blue-400">Complexity:</span> 
            <span className={`ml-2 px-2 py-1 rounded text-white ${
              fileResponse.complexityLevel === 'High' ? 'bg-red-600' : 
              fileResponse.complexityLevel === 'Medium' ? 'bg-yellow-600' : 
              'bg-green-600'
            }`}>
              {fileResponse.complexityLevel}
            </span>
          </div>
        </div>
        
        <div className="bg-gray-900 p-4 rounded-lg">
          <h4 className="font-semibold mb-2 text-blue-400">Purpose</h4>
          <p className="text-gray-300">{fileResponse.purpose}</p>
        </div>

        <div className="bg-gray-900 p-4 rounded-lg">
          <h4 className="font-semibold mb-2 text-blue-400">Brief Explanation</h4>
          <p className="text-gray-300">{fileResponse.briefExplanation}</p>
        </div>

        <div className="bg-gray-900 p-4 rounded-lg">
          <h4 className="font-semibold mb-2 text-blue-400">Technologies Used</h4>
          <div className="flex flex-wrap gap-2">
            {fileResponse.technologiesUsed.map((tech, index) => (
              <span key={index} className="bg-blue-900 text-blue-200 px-2 py-1 rounded text-sm">
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mt-20 mb-2 text-blue-400">Key Components</h4>
          <div className="space-y-4">
            {fileResponse.keyComponents.map((component, index) => (
              <div key={index} className="bg-gray-900 p-4 rounded-lg shadow-sm">
                <h5 className="font-semibold text-lg mb-2 text-white">{component.name}</h5>
                <p className="text-gray-300 mb-3">{component.description}</p>
                <div className="relative">
                  <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto">
                    <code className="text-sm text-white">{component.codeSnippet}</code>
                  </pre>
                  <button 
                    className="absolute top-2 right-2 bg-blue-600 text-white p-1 rounded hover:bg-blue-700"
                    onClick={() => {
                      navigator.clipboard.writeText(component.codeSnippet);
                      // Could add a toast notification here
                    }}
                    title="Copy code"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-2M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-10">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const GitHubChatPage = () => {
  const [repoUrl, setRepoUrl] = useState("");
  const [repoData, setRepoData] = useState(null);
  const [fileContents, setFileContents] = useState({});
  const [projectOverview, setProjectOverview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileResponse, setFileResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [tokenConfigured, setTokenConfigured] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const MAX_RETRIES = 3;

  useEffect(() => {
    // Check if token is configured on component mount
    setTokenConfigured(!!import.meta.env.VITE_PUBLIC_GITHUB_PAT);
  }, []);

  const cleanJsonString = (str) => {
      // First, try to extract JSON from markdown code blocks
      const jsonBlockMatch = str.match(/```json\n([\s\S]*?)\n```/);
      if (jsonBlockMatch && jsonBlockMatch[1]) {
        str = jsonBlockMatch[1];
      }
  
      // Remove common problematic characters
      return str
        .replace(/[\x00-\x1F]/g, '') // Remove control characters
        .replace(/\\'/g, "'")        // Replace escaped single quotes
        .replace(/\\"/g, '"')        // Replace escaped double quotes
        .replace(/\\n/g, '\n')       // Unescape newlines
        .replace(/\\t/g, '\t')       // Unescape tabs
        .replace(/\\r/g, '\r')       // Unescape carriage returns
        .replace(/\r?\n|\r/g, ' ')   // Normalize line endings
        .replace(/\s+/g, ' ')        // Collapse multiple spaces
        .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
        .trim();
    };
  
  const parseJsonResponse = (rawResponse) => {
    try {
      // First try to parse directly
      return JSON.parse(rawResponse);
    } catch (initialError) {
      // If direct parse fails, try cleaning the string
      try {
        const cleaned = cleanJsonString(rawResponse);
        return JSON.parse(cleaned);
      } catch (cleaningError) {
        // If cleaning fails, try to extract JSON from the string
        try {
          const jsonStart = rawResponse.indexOf('{');
          const jsonEnd = rawResponse.lastIndexOf('}') + 1;
          if (jsonStart >= 0 && jsonEnd > jsonStart) {
            const potentialJson = rawResponse.slice(jsonStart, jsonEnd);
            return JSON.parse(cleanJsonString(potentialJson));
          }
          throw new Error("No valid JSON found in response");
        } catch (extractionError) {
          console.error("Original response:", rawResponse);
          throw new Error(`Failed to parse JSON: ${extractionError.message}`);
        }
      }
    }
  };

  const isValidJson = (obj) => {
    try {
      JSON.stringify(obj);
      return true;
    } catch (e) {
      return false;
    }
  };

  const validateGithubUrl = (url) => {
    const urlPattern = /^https?:\/\/(?:www\.)?github\.com\/([^\/]+)\/([^\/]+)/;
    return urlPattern.test(url);
  };

  const extractOwnerAndRepo = (url) => {
    const urlPattern = /github\.com\/([^\/]+)\/([^\/]+)/;
    const match = url.match(urlPattern);
    
    if (!match) {
      throw new Error("Invalid GitHub repository URL");
    }

    return { owner: match[1], repo: match[2] };
  };

  const fetchFileContents = async (files, owner, repo, path = '') => {
    const githubApi = getGithubApi();
    setStatusMessage(`Fetching file contents from ${path || 'root directory'}...`);

    const contentsPromises = files.map(async (file) => {
      const fullPath = path ? `${path}/${file.name}` : file.name;
      
      try {
        if (file.type === 'file') {
          const contentResponse = await getGithubApi().get(
`/repos/${owner}/${repo}/contents/${fullPath}`
          );
          return { 
            name: fullPath, 
            content: atob(contentResponse.data.content) 
          };
        } else if (file.type === 'dir') {
          const dirContentsResponse = await githubApi.get(
            `/repos/${owner}/${repo}/contents/${fullPath}`
          );
          return await fetchFileContents(
            dirContentsResponse.data, 
            owner, 
            repo, 
            fullPath
          );
        }
      } catch (error) {
        console.error(`Error fetching ${file.type} ${fullPath}:`, error);
        return null;
      }
      return null;
    });

    const contents = await Promise.all(contentsPromises);
    return contents.flat().filter(Boolean);
  };

  const getProjectOverview = async (fileContents) => {
    if (!chatSession) {
      throw new Error("Chat session is not initialized");
    }

    setStatusMessage("Analyzing project structure and generating overview...");

    const fileNames = Object.keys(fileContents);
    const fileContentsStr = fileNames.slice(0, 5)
      .map(name => `File: ${name}\nContent:\n${fileContents[name]}`)
      .join('\n\n');

    const chatResponse = await chatSession.sendMessage(
      `Analyze these files from a GitHub repository and provide a comprehensive project overview. 
       Provide the response in this JSON format:
       {
         "projectName": "Name of the project",
         "purpose": "Main objective of the project",
         "keyFeatures": ["Feature 1", "Feature 2"],
         "technologiesUsed": ["Technology 1", "Technology 2"],
         "complexity": "Low/Medium/High"
       }
       
       IMPORTANT: Your response must be valid JSON only, without any additional text or markdown formatting.
       
       Files to analyze:\n${fileContentsStr}`
    );

    const rawResponse = await chatResponse.response.text();
    console.log("Raw overview response:", rawResponse);
    
    const response = parseJsonResponse(rawResponse);
    
    if (!isValidJson(response)) {
      throw new Error("Invalid JSON response from AI");
    }

    const requiredFields = [
      "projectName",
      "purpose",
      "keyFeatures",
      "technologiesUsed",
      "complexity"
    ];
    
    const missingFields = requiredFields.filter(field => !(field in response));
    
    if (missingFields.length > 0) {
      throw new Error(`Invalid response structure. Missing fields: ${missingFields.join(", ")}`);
    }

    return response;
  };

  const chatWithFile = async (fileName) => {
    setSelectedFile(fileName);
    setAnalyzing(true);
    setError("");
    setRetryCount(0);

    try {
      const fileContent = fileContents[fileName];
      setStatusMessage(`Analyzing ${fileName}...`);

      const chatResponse = await chatSession.sendMessage(
        `Analyze the following code file and provide a detailed explanation in this JSON format:
        {
          "fileName": "${fileName}",
          "fileType": "Determine the file type/language",
          "purpose": "Explain the main purpose of this file",
          "keyComponents": [
            {
              "name": "Name of the function/class",
              "description": "Explain its purpose and functionality",
              "codeSnippet": "Relevant code snippet"
            }
          ],
          "technologiesUsed": ["List technologies/libraries and how they are being used"],
          "complexityLevel": "Low/Medium/High",
          "briefExplanation": "Concise description of file's functionality"
        }
        
        IMPORTANT: Your response must be valid JSON only, without any additional text or markdown formatting.
        
        Code:\n${fileContent}`
      );

      const rawResponse = await chatResponse.response.text();
      console.log("Raw AI response:", rawResponse);
      
      let response;
      try {
        response = parseJsonResponse(rawResponse);
      } catch (parseError) {
        console.error("Parse error:", parseError);
        throw new Error(`The AI returned malformed JSON. Please try again. Error: ${parseError.message}`);
      }

      if (!isValidJson(response)) {
        throw new Error("Response contains invalid JSON data");
      }

      // Validate the response structure
      const requiredFields = [
        "fileName",
        "fileType",
        "purpose",
        "keyComponents",
        "technologiesUsed",
        "complexityLevel",
        "briefExplanation"
      ];
      
      const missingFields = requiredFields.filter(field => !(field in response));
      
      if (missingFields.length > 0) {
        throw new Error(`Invalid response structure. Missing fields: ${missingFields.join(", ")}`);
      }

      // Ensure keyComponents is an array
      if (!Array.isArray(response.keyComponents)) {
        throw new Error("keyComponents must be an array");
      }

      setFileResponse(response);
      
      // Scroll to analysis section
      setTimeout(() => {
        const analysisElement = document.getElementById('file-analysis');
        if (analysisElement) {
          analysisElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      
    } catch (error) {
      console.error("Error analyzing file:", error);
      setError(`Failed to analyze file: ${error.message}`);
      
      // Optionally retry automatically
      if (error.message.includes("malformed JSON") && retryCount < MAX_RETRIES) {
        setRetryCount(retryCount + 1);
        setTimeout(() => {
          setError(`Retrying analysis (attempt ${retryCount + 1}/${MAX_RETRIES})...`);
          chatWithFile(fileName);
        }, 2000);
      } else {
        setError(`Failed after ${MAX_RETRIES} attempts: ${error.message}`);
      }
    } finally {
      setAnalyzing(false);
      setStatusMessage("");
    }
  };

  const fetchRepoData = async () => {
    if (!repoUrl) {
      setError("Please enter a repository URL");
      return;
    }

    if (!tokenConfigured) {
      setError("GitHub PAT token is not configured in environment variables");
      return;
    }

    if (!validateGithubUrl(repoUrl)) {
      setError("Invalid GitHub repository URL format");
      return;
    }

    setLoading(true);
    setError("");
    setStatusMessage("Initializing repository analysis...");
    setFileContents({});
    setProjectOverview(null);
    setFileResponse(null);
    setSelectedFile(null);

    try {
      const { owner, repo } = extractOwnerAndRepo(repoUrl);
      const githubApi = getGithubApi();
      
      setStatusMessage(`Fetching repository structure for ${owner}/${repo}...`);
      const response = await githubApi.get(`/repos/${owner}/${repo}/contents`);
      setRepoData(response.data);

      const allFileContents = await fetchFileContents(response.data, owner, repo);
      const contentsMap = allFileContents.reduce((acc, file) => {
        if (file) {
          acc[file.name] = file.content;
        }
        return acc;
      }, {});

      setFileContents(contentsMap);
      
      const overview = await getProjectOverview(contentsMap);
      setProjectOverview(overview);
      setStatusMessage("Analysis complete!");
      
      // Clear status message after a delay
      setTimeout(() => setStatusMessage(""), 2000);

    } catch (error) {
      console.error("Error fetching repository data:", error);
      if (error.response?.status === 401) {
        setError("Authentication failed. Check your GitHub PAT token in environment variables");
      } else if (error.response?.status === 403) {
        setError("Rate limit exceeded or insufficient permissions with current token");
      } else if (error.response?.status === 404) {
        setError("Repository not found or private. Check permissions of your PAT token");
      } else {
        setError("Failed to fetch repository data: " + (error.message || "Unknown error"));
      }
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort files
  const filteredFiles = Object.keys(fileContents).filter(fileName => 
    fileName.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    if (sortBy === "name") {
      return a.localeCompare(b);
    } else if (sortBy === "extension") {
      const extA = a.split('.').pop() || '';
      const extB = b.split('.').pop() || '';
      return extA.localeCompare(extB);
    }
    return 0;
  });

  return (
    <div className="container mx-auto p-4 max-w-6xl bg-black text-white min-h-screen">
      <div className="bg-gray-900 shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4 mt-20 text-white flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          GitHub Repository Analyzer
        </h2>
        
        {!tokenConfigured && (
          <div className="mb-4 p-4 bg-yellow-600 text-yellow-100 rounded-lg">
            <p className="font-medium">GitHub PAT token not configured!</p>
            <p className="text-sm">Add <code>VITE_PUBLIC_GITHUB_PAT</code> to your environment variables.</p>
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="repo-url" className="block text-sm font-medium text-gray-400 mb-1">
            Repository URL
          </label>
          <div className="flex gap-2">
            <input
              id="repo-url"
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/owner/repo"
              className="flex-1 border border-gray-700 bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button 
              onClick={fetchRepoData}
              disabled={loading || !tokenConfigured}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Analyze Repo
                </>
              )}
            </button>
          </div>
        </div>
        {error && (
          <div className="mt-4 p-4 bg-red-900 text-red-100 rounded-lg border border-red-700">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}
        {statusMessage && (
          <div className="mt-4 p-4 bg-blue-900 text-blue-100 rounded-lg flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {statusMessage}
          </div>
        )}
      </div>

      {projectOverview && <ProjectOverview overview={projectOverview} />}

      {fileContents && Object.keys(fileContents).length > 0 && (
        <div className="bg-gray-900 shadow-lg rounded-lg p-6 mt-6">
          <h3 className="text-2xl font-bold mb-4 text-white flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            Repository Files
          </h3>
          
          <div className="flex flex-col md:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search files..."
                className="w-full border border-gray-700 bg-gray-800 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-700 bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Sort by Name</option>
              <option value="extension">Sort by Extension</option>
            </select>
          </div>
          
          <div className="space-y-2 max-h-96 overflow-y-auto p-2 rounded-lg bg-gray-950">
            {filteredFiles.length > 0 ? (
              filteredFiles.map((fileName, index) => (
                <FileCard 
                  key={index}
                  fileName={fileName}
                  onAnalyze={chatWithFile}
                  isActive={selectedFile === fileName}
                />
              ))
            ) : (
              <div className="text-center p-4 text-gray-500">
                {searchTerm ? "No files match your search" : "No files found in repository"}
              </div>
            )}
          </div>
        </div>
      )}

      {analyzing && (
        <div className="mt-6">
          <LoadingSpinner />
          <p className="text-center text-gray-400">Analyzing {selectedFile}...</p>
        </div>
      )}

      {fileResponse && <FileAnalysis fileResponse={fileResponse} />}
    </div>
  );
};

export default GitHubChatPage;