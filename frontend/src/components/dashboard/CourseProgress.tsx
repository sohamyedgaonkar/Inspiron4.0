import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// 🔹 Replace with your actual Supabase credentials
const supabase = createClient(
  "https://your-project-url.supabase.co",  // Replace this
  "your-anon-key"  // Replace this
);

const CourseProgress = () => {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch course progress for the authenticated user
  const fetchProgress = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("course_progress")  // Make sure this matches your Supabase table
        .select("video_id, completed, quiz_passed, quiz_score")
        .eq("user_id", user.id);

      if (error) throw error;

      setProgress(data);
    } catch (err) {
      console.error("Error fetching progress:", err);
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Course Progress</h2>
      
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>⚠️ {error}</p>}

      {!loading && !error && progress.length === 0 && <p>No progress data found.</p>}

      {!loading && !error && progress.length > 0 && (
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>Video ID</th>
              <th>Completed</th>
              <th>Quiz Passed</th>
              <th>Quiz Score</th>
            </tr>
          </thead>
          <tbody>
            {progress.map((row, index) => (
              <tr key={index}>
                <td>{row.video_id}</td>
                <td>{row.completed ? "✅ Yes" : "❌ No"}</td>
                <td>{row.quiz_passed ? "✅ Yes" : "❌ No"}</td>
                <td>{row.quiz_score ?? "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CourseProgress;
