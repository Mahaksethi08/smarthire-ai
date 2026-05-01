import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Mic,
  TrendingUp,
  Briefcase,
} from "lucide-react";

function Sidebar() {
  const links = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Resume Analyzer", path: "/resume", icon: FileText },
    { name: "Mock Interview", path: "/mock-interview", icon: Mic },
    { name: "Performance", path: "/performance", icon: TrendingUp },
    { name: "Job Matches", path: "/jobs", icon: Briefcase },
  ];

  return (
    <aside className="w-64 min-h-screen bg-[#0f0f1b] border-r border-white/10 flex flex-col">
      <div className="p-6 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500"></div>
        <h1 className="font-bold text-lg">SmartHire AI</h1>
      </div>

      <nav className="px-4 mt-6 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  isActive
                    ? "bg-[#1b1b32] text-purple-400"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <Icon size={20} />
              <span>{link.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto p-5 border-t border-white/10 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center font-bold">
          AR
        </div>
        <div>
          <p className="font-semibold text-sm">Arjun Rathore</p>
          <p className="text-xs text-gray-500">CSE Final Year</p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;