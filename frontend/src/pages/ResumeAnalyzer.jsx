import { useState } from "react";

function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Select file first");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const res = await fetch("http://127.0.0.1:5000/analyze-resume", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      setData(result);
    } catch (err) {
      alert("Error connecting backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b1a] text-white p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Resume Analyzer</h1>
          <p className="text-gray-400 text-sm">
            Upload your resume to get ATS score & insights
          </p>
        </div>

        {data && (
          <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded-xl">
            ATS Score: {data.ats_score}%
          </div>
        )}
      </div>

      {/* UPLOAD BOX */}
      <div className="border border-dashed border-purple-500/40 rounded-2xl p-8 text-center">
        <p className="text-gray-300">
          Drop your resume here or click to upload
        </p>

        <div className="mt-4 flex justify-center gap-3">
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="bg-black/40 p-2 rounded"
          />

          <button
            onClick={handleUpload}
            className="bg-gradient-to-r from-purple-600 to-blue-500 px-5 py-2 rounded-xl"
          >
            {loading ? "Analyzing..." : "Analyze Resume"}
          </button>
        </div>
      </div>

      {data && (
        <div className="grid grid-cols-3 gap-6 mt-6">

          {/* LEFT */}
          <div className="col-span-2 space-y-5">

            {/* SKILLS */}
            <div className="bg-[#111122] p-5 rounded-xl">
              <h2 className="font-semibold mb-3">
                Extracted Skills ({data.skills_found.length})
              </h2>

              <div className="flex flex-wrap gap-2">
                {data.skills_found.map((s) => (
                  <span
                    key={s}
                    className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-sm"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT */}
          <div className="space-y-5">

            {/* ATS BREAKDOWN */}
            <div className="bg-[#111122] p-5 rounded-xl">
              <h2 className="font-semibold mb-3">ATS Breakdown</h2>

              <div className="text-sm text-gray-300">
                Keyword Match: {data.ats_breakdown?.keyword_match}%
              </div>
              <div className="text-sm text-gray-300">
                Formatting: {data.ats_breakdown?.formatting}%
              </div>
              <div className="text-sm text-gray-300">
                Experience: {data.ats_breakdown?.experience_clarity}%
              </div>
            </div>

            {/* MISSING SKILLS */}
            <div className="bg-[#111122] p-5 rounded-xl">
              <h2 className="font-semibold mb-3">
                Missing Skills
              </h2>

              {data.missing_skills?.map((m, i) => (
                <div key={i} className="flex justify-between text-sm mb-2">
                  <span>{m.skill}</span>
                  <span className="text-red-400">{m.priority}</span>
                </div>
              ))}
            </div>

            {/* AI TIPS */}
            <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 p-5 rounded-xl border border-purple-500/20">
              <h2 className="font-semibold mb-3">AI Tips</h2>

              <ul className="text-sm text-gray-300 space-y-2">
                {data.resume_tips?.map((t, i) => (
                  <li key={i}>• {t}</li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default ResumeAnalyzer;