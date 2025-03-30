import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const CareerProgress = () => {
  const [careerGoal, setCareerGoal] = useState<{
    goal: string;
    current_progress: number;
    skills: string[];
  } | null>(null);

  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [missingSkills, setMissingSkills] = useState<string[]>([]);
  const [company, setCompany] = useState(""); // User-input company name

  useEffect(() => {
    // Fetch user's career goal progress (general progress, not company-specific)
    fetch("/api/get-career-goal", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setCareerGoal(data);
        }
      })
      .catch((error) => console.error("Error fetching career goal:", error));
  }, []);

  const fetchRequiredSkills = () => {
    if (!company.trim()) return;

    fetch("/api/get-required-skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setRequiredSkills(data.skills);
        } else {
          setRequiredSkills([]);
        }
      })
      .catch((error) => console.error("Error fetching required skills:", error));
  };

  // Compare required skills with user’s current skills
  useEffect(() => {
    if (careerGoal && requiredSkills.length > 0) {
      const missing = requiredSkills.filter(
        (skill) => !careerGoal.skills.includes(skill)
      );
      setMissingSkills(missing);
    }
  }, [careerGoal, requiredSkills]);

  return (
    <Card className="w-full bg-black/50 border-border/50 p-4">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Career Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {careerGoal ? (
          <>
            <p className="text-lg font-medium">{careerGoal.goal}</p>
            <p>Progress: {careerGoal.current_progress}%</p>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${careerGoal.current_progress}%` }}
              />
            </div>

            <p className="font-semibold">Your Skills:</p>
            <ul className="list-disc pl-4">
              {careerGoal.skills.map((skill, i) => (
                <li key={i}>{skill}</li>
              ))}
            </ul>

            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Enter company name (e.g., Google)"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
              <Button onClick={fetchRequiredSkills} className="w-full">
                Fetch Required Skills
              </Button>
            </div>

            {requiredSkills.length > 0 && (
              <>
                <p className="font-semibold">Required Skills for {company}:</p>
                <ul className="list-disc pl-4">
                  {requiredSkills.map((skill, i) => (
                    <li key={i}>{skill}</li>
                  ))}
                </ul>
              </>
            )}

            {missingSkills.length > 0 && (
              <>
                <p className="font-semibold text-red-500">
                  Skills You Need to Improve:
                </p>
                <ul className="list-disc pl-4 text-red-400">
                  {missingSkills.map((skill, i) => (
                    <li key={i}>{skill}</li>
                  ))}
                </ul>
              </>
            )}
          </>
        ) : (
          <p>Loading career goal data...</p>
        )}
      </CardContent>
    </Card>
  );
};

export default CareerProgress;