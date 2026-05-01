import {
  FileText,
  Mic,
  TrendingUp,
  Briefcase,
  Brain,
  Target,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

function Dashboard({ resumeData, setResumeData }) {
  const hasResume = !!resumeData;
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ---------------- UPLOAD ----------------
  const handleResumeUpload = async () => {
    if (!selectedFile) {
      alert("Please select a PDF resume first");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setLoading(true);
      setError("");

      const res = await fetch("http://localhost:5000/analyze-resume", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("AI RESPONSE:", data);

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      localStorage.setItem("resumeData", JSON.stringify(data));
      setResumeData(data);

      alert("Resume analyzed successfully");
    } catch (err) {
      console.error(err);
      setError("Backend not connected or failed");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- STATS ----------------
  const stats = [
    {
      title: "Resume Score",
      value: hasResume ? `${resumeData.score || 0}%` : "--",
      icon: FileText,
    },
    {
      title: "Interview Score",
      value: "--",
      icon: Mic,
    },
    {
      title: "Job Readiness",
      value: hasResume ? `${resumeData.job_readiness || 0}%` : "--",
      icon: TrendingUp,
    },
    {
      title: "Job Matches",
      value: hasResume ? resumeData.job_matches || 0 : "--",
      icon: Briefcase,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0b1a] to-[#12122a] text-white p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold">SmartHire AI</h1>
          <p className="text-gray-400 mt-1">
            Your personal placement trainer
          </p>
        </div>

        <div className="flex gap-4">
          <Link
            to="/mock-interview"
            className="bg-gradient-to-r from-purple-600 to-blue-500 px-6 py-3 rounded-xl font-semibold hover:scale-105 transition"
          >
            Start Interview
          </Link>

          <button
            onClick={() => {
              localStorage.removeItem("resumeData");
              setResumeData(null);
              window.location.reload();
            }}
            className="bg-red-500 hover:bg-red-600 px-5 py-3 rounded-xl font-semibold"
          >
            Reset
          </button>
        </div>
      </div>

      {/* UPLOAD */}
      {!hasResume && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-semibold">Upload Resume</h2>

          <div className="flex items-center gap-4 mt-4">
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className="bg-black/40 p-3 rounded-lg border border-white/10"
            />

            <button
              onClick={handleResumeUpload}
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-blue-500 px-6 py-3 rounded-xl font-semibold disabled:opacity-50"
            >
              {loading ? "Analyzing..." : "Analyze"}
            </button>
          </div>

          {error && <p className="text-red-400 mt-3">{error}</p>}
        </div>
      )}

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="bg-white/5 border border-white/10 rounded-2xl p-5"
            >
              <Icon className="text-purple-400" size={28} />
              <p className="text-gray-400 mt-4">{item.title}</p>
              <h2 className="text-3xl font-bold mt-1">{item.value}</h2>
            </div>
          );
        })}
      </div>

      {/* MAIN GRID */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* SKILLS */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-semibold flex gap-2 items-center">
            <Brain className="text-purple-400" />
            Skill Analysis
          </h2>

          {hasResume ? (
            <div className="mt-4">
              <p className="text-gray-400 mb-3">
                Role:{" "}
                <span className="text-blue-400">
                  {resumeData.detected_role || "Unknown"}
                </span>
              </p>

              <div className="flex flex-wrap gap-3">
                {resumeData.skills_found &&
                resumeData.skills_found.length > 0 ? (
                  resumeData.skills_found.map((skill) => (
                    <span
                      key={skill}
                      className="bg-green-500/20 text-green-400 px-4 py-2 rounded-lg"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-red-400">No skills detected</p>
                )}
              </div>

              {/* Missing Skills */}
              {resumeData.missing_skills &&
                resumeData.missing_skills.length > 0 && (
                  <>
                    <p className="text-gray-400 mt-5">
                      Missing Skills:
                    </p>
                    <div className="flex flex-wrap gap-3 mt-2">
                      {resumeData.missing_skills.map((skill) => (
                        <span
                          key={skill}
                          className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </>
                )}
            </div>
          ) : (
            <p className="text-gray-500 mt-4">
              Upload resume to see analysis
            </p>
          )}
        </div>

        {/* NEXT STEP */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-semibold flex gap-2 items-center">
            <Target className="text-blue-400" />
            Next Step
          </h2>

          {hasResume ? (
            <Link
              to="/mock-interview"
              className="block text-center mt-5 bg-gradient-to-r from-purple-600 to-blue-500 py-3 rounded-xl font-semibold"
            >
              Start Mock Interview
            </Link>
          ) : (
            <p className="text-gray-500 mt-4">
              Upload resume first
            </p>
          )}
        </div>
      </div>

      {/* AI SUGGESTIONS */}
      <div className="mt-8 bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-500/20 rounded-2xl p-6">
        <h2 className="text-xl font-semibold flex gap-2 items-center">
          <Sparkles className="text-purple-400" />
          AI Suggestions
        </h2>

        {hasResume ? (
          <ul className="mt-4 space-y-2 text-gray-300">
            <li>• Improve missing skills shown above</li>
            <li>• Practice role-based mock interview</li>
            <li>• Add measurable achievements</li>
          </ul>
        ) : (
          <p className="text-gray-400 mt-4">
            Suggestions will appear after upload
          </p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;