import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card'; // Adjusted imports
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { chatSession } from '@/utils/AiModel'; // Adjust path if needed
import { ExternalLink, BookOpen, Video, FileText, Loader2 } from 'lucide-react'; // Added Loader2

// Define the structure for each step in the generated roadmap
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

const StudentRoadmapGenerator = () => {
  // State for user inputs
  const [currentSkills, setCurrentSkills] = useState('');
  const [desiredRole, setDesiredRole] = useState('');

  // State for roadmap generation process
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<RoadmapStep[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateRoadmap = async () => {
    if (!currentSkills.trim() || !desiredRole.trim()) {
      setError("Please enter both your current skills and desired role.");
      return;
    }

    setLoading(true);
    setError(null);
    setRoadmap(null); // Clear previous roadmap

    try {
      const prompt = `
        You are an expert career advisor and curriculum designer specializing in personalized learning paths.
        A student has provided their current skills and their desired future role. Your task is to create a detailed, actionable learning roadmap to help them bridge the skill gap and achieve their goal.

        Student's Current Skills:
        ${currentSkills}

        Student's Desired Future Role:
        "${desiredRole}"

        Based on this information, create a step-by-step learning roadmap with 4-6 distinct steps.
        For each step:
        1. Identify key skills or knowledge areas needed to progress from their current state towards the desired role. Focus on bridging the gap.
        2. Provide a clear title and a detailed description explaining what to learn and why it's important for the desired role.
        3. Recommend 2-3 specific, high-quality, and current learning resources. Include the resource name, type (e.g., book, online course, tutorial, documentation, project idea, article), and a MANDATORY valid URL.
            - For books: link to Amazon, Goodreads, publisher, etc.
            - For courses: link to Coursera, Udemy, edX, Pluralsight, official platform, etc.
            - For documentation/articles: link to the official source or reputable site.
            - For project ideas: Link to a relevant tutorial, guide, or example repository if possible.
        4. Provide a realistic time estimate for completing the step (e.g., "1-2 weeks", "40 hours").

        Return your response ONLY as a strictly valid JSON object adhering to the following structure:
        {
          "steps": [
            {
              "title": "Step Title",
              "description": "Detailed explanation of the learning objective and its relevance.",
              "resources": [
                {
                  "name": "Resource Name",
                  "url": "VALID_URL_HERE", // MUST be a valid URL
                  "type": "Resource Type (e.g., book, course, documentation)"
                }
              ],
              "timeEstimate": "Estimated time (e.g., '2 weeks', '30 hours')"
            }
            // ... more steps (4-6 total)
          ]
        }

        Ensure the roadmap logically progresses towards the skills required for the "${desiredRole}". Make the steps practical and achievable. Focus on resources that are well-regarded in the relevant industry.
        Do not include any introductory text, explanations, or markdown formatting outside the JSON object itself.
      `;

      console.log("Sending prompt to AI..."); // Log for debugging

      const response = await chatSession.sendMessage(prompt);
      const resultText = await response.response.text();

      console.log("Received raw response from AI:", resultText); // Log raw response

      // Extract JSON part from the response (robust extraction)
      const jsonMatch = resultText.match(/\{[\s\S]*\}/);
      if (!jsonMatch || !jsonMatch[0]) {
         console.error("Failed to extract JSON from response:", resultText);
        throw new Error('Invalid response format from AI. Could not find JSON object.');
      }

      let parsedResult;
      try {
         parsedResult = JSON.parse(jsonMatch[0]);
      } catch(parseError) {
          console.error("Failed to parse JSON:", jsonMatch[0], parseError);
          throw new Error('Invalid JSON format received from AI.');
      }


      if (!parsedResult.steps || !Array.isArray(parsedResult.steps)) {
        console.error("Invalid response structure:", parsedResult);
        throw new Error('Invalid response structure: "steps" array is missing or not an array.');
      }

      // Process the resources to ensure all have URLs (fallback)
      const processedSteps = parsedResult.steps.map((step: any) => ({
        title: step.title || 'Untitled Step',
        description: step.description || 'No description provided.',
        timeEstimate: step.timeEstimate || 'N/A',
        resources: Array.isArray(step.resources) ? step.resources.map((resource: any) => ({
          name: resource.name || 'Unnamed Resource',
          url: resource.url && String(resource.url).trim() !== '' && String(resource.url).trim().toLowerCase() !== 'n/a'
            ? String(resource.url).trim()
            : `https://www.google.com/search?q=${encodeURIComponent((resource.name || 'resource') + ' ' + (resource.type || ''))}`,
          type: resource.type || 'link',
        })) : [],
      }));

      setRoadmap(processedSteps as RoadmapStep[]);
    } catch (error: any) {
      console.error('Error generating roadmap:', error);
      setError(`An error occurred while generating your roadmap: ${error.message || 'Please try again.'}`);
      setRoadmap(null); // Clear roadmap on error
    } finally {
      setLoading(false);
    }
  };

  // Function to handle resource clicks (opens in new tab)
  const handleResourceClick = (resource: { name: string; url?: string; type: string }) => {
    if (resource.url && resource.url.trim() !== '' && resource.url.startsWith('http')) {
      window.open(resource.url, '_blank', 'noopener,noreferrer');
    } else {
        console.warn(`Invalid or missing URL for resource "${resource.name}": ${resource.url}`);
        // Optional: Show a message to the user or handle differently
    }
  };

  // Function to get the appropriate icon based on resource type
  const getResourceIcon = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('book')) return <BookOpen className="h-4 w-4" />;
    if (lowerType.includes('course') || lowerType.includes('video')) return <Video className="h-4 w-4" />;
    if (lowerType.includes('tutorial')) return <Video className="h-4 w-4" />;
    if (lowerType.includes('doc')) return <FileText className="h-4 w-4" />;
    if (lowerType.includes('article')) return <FileText className="h-4 w-4" />;
    if (lowerType.includes('project')) return <ExternalLink className="h-4 w-4" />;
    return <ExternalLink className="h-4 w-4" />;
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4 bg-background text-foreground min-h-screen"> {/* Use theme vars */}
      <h1 className="text-3xl font-bold text-center mb-8">Personalized Learning Roadmap Generator</h1>

      {/* Input Card */}
      <Card className="mb-8 shadow-lg bg-card text-card-foreground">
        <CardHeader>
          <CardTitle>Your Details</CardTitle>
          <CardDescription>Enter your current skills and the role you aspire to.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="current-skills">Current Skills</Label>
            <Textarea
              id="current-skills"
              placeholder="e.g., JavaScript, HTML, CSS, basic Python"
              value={currentSkills}
              onChange={(e) => setCurrentSkills(e.target.value)}
              className="min-h-[100px] bg-input text-foreground" // Use theme vars
              disabled={loading}
            />
             <p className="text-sm text-muted-foreground">
                List skills you already possess, separated by commas or new lines.
             </p>
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="desired-role">Desired Future Role</Label>
            <Input
              id="desired-role"
              type="text"
              placeholder="e.g., Full-Stack Web Developer, Data Scientist, UX Designer"
              value={desiredRole}
              onChange={(e) => setDesiredRole(e.target.value)}
              className="bg-input text-foreground" // Use theme vars
              disabled={loading}
            />
             <p className="text-sm text-muted-foreground">
                What job title or career path are you aiming for?
             </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={generateRoadmap}
            disabled={loading || !currentSkills.trim() || !desiredRole.trim()}
            className="w-full sm:w-auto" // Full width on small screens
            >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Roadmap'
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-10">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" /> {/* Use theme primary color */}
          <p className="mt-4 text-muted-foreground">Generating your personalized learning roadmap...</p>
          <p className="text-sm text-muted-foreground">(This may take a moment)</p>
        </div>
      )}

      {/* Error Display */}
      {error && !loading && (
        <Card className="bg-destructive/10 border-destructive text-destructive-foreground p-4 my-6 shadow-md">
          <CardHeader className="p-0 mb-2">
            <CardTitle className="text-lg">Error Generating Roadmap</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <p>{error}</p>
            {/* Optional: Add a retry button if applicable */}
            {/* <Button variant="destructive" size="sm" onClick={generateRoadmap} className="mt-3">Retry</Button> */}
          </CardContent>
        </Card>
      )}

      {/* Roadmap Display */}
      {roadmap && !loading && !error && (
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Your Learning Roadmap for: <span className="text-primary">{desiredRole}</span>
          </h2>
          <div className="space-y-6">
            {roadmap.map((step, index) => (
              <Card key={index} className="bg-card text-card-foreground border shadow-md overflow-hidden">
                 <CardHeader className="bg-muted/30 p-4 sm:p-6 flex flex-row items-center space-x-4">
                     {/* Step Number */}
                    <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0 text-lg font-bold">
                      {index + 1}
                    </div>
                     {/* Step Title */}
                    <div className="flex-1">
                      <CardTitle className="text-xl sm:text-2xl">{step.title}</CardTitle>
                    </div>
                 </CardHeader>
                 <CardContent className="p-4 sm:p-6">
                    <p className="text-muted-foreground mb-4 text-sm sm:text-base">{step.description}</p>

                    {/* Resources Section */}
                    {step.resources && step.resources.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium text-foreground mb-3 text-base sm:text-lg">Recommended Resources:</h4>
                        <ul className="space-y-3">
                          {step.resources.map((resource, idx) => (
                            <li key={idx} className="flex items-start group border-b border-border pb-3 last:border-b-0 last:pb-0">
                              {/* Resource Icon */}
                              <div className="mr-3 text-primary pt-1 flex-shrink-0">
                                {getResourceIcon(resource.type)}
                              </div>
                              {/* Resource Link/Button */}
                              <div className="flex-1">
                                <button
                                  className="text-left w-full disabled:opacity-60 disabled:cursor-not-allowed group"
                                  onClick={() => handleResourceClick(resource)}
                                  disabled={!resource.url || !resource.url.startsWith('http')}
                                  title={resource.url && resource.url.startsWith('http') ? `Open ${resource.name}` : 'Link unavailable'}
                                >
                                  <p className={`font-medium text-sm sm:text-base ${resource.url && resource.url.startsWith('http') ? 'group-hover:text-primary group-hover:underline' : 'text-muted-foreground'} transition-colors`}>
                                    {resource.name}
                                  </p>
                                  <div className="flex items-center mt-0.5">
                                    <p className="text-xs sm:text-sm text-muted-foreground capitalize">{resource.type}</p>
                                    {resource.url && resource.url.startsWith('http') && (
                                      <ExternalLink className="ml-1.5 h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                                    )}
                                  </div>
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Time Estimate */}
                    <div className="mt-5 inline-block bg-secondary text-secondary-foreground px-3 py-1.5 rounded-full text-xs sm:text-sm">
                      Estimated time: <span className="font-semibold">{step.timeEstimate}</span>
                    </div>
                 </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentRoadmapGenerator;