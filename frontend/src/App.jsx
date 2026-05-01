import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";

function MockInterview() {
  return <h1 className="text-4xl font-bold">Mock Interview Page</h1>;
}

function Performance() {
  return <h1 className="text-4xl font-bold">Performance Page</h1>;
}

function JobMatches() {
  return <h1 className="text-4xl font-bold">Job Matches Page</h1>;
}

function App() {
  const [resumeData, setResumeData] = useState(() => {
  const saved = localStorage.getItem("resumeData");
  return saved ? JSON.parse(saved) : null;
});

  return (
    <BrowserRouter>
      <div className="min-h-screen w-full bg-[#080812] text-white flex">
        <Sidebar />

        <main className="flex-1 p-8 overflow-y-auto">
          <Routes>
            <Route
  path="/"
  element={<Dashboard resumeData={resumeData} setResumeData={setResumeData} />}
/>
            <Route
              path="/resume"
              element={<ResumeAnalyzer setResumeData={setResumeData} />}
            />
            <Route path="/mock-interview" element={<MockInterview />} />
            <Route path="/performance" element={<Performance />} />
            <Route path="/jobs" element={<JobMatches />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;