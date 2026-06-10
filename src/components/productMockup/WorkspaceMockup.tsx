import { useState } from "react";
import { ChevronDown, ChevronRight, Folder, FileText, Search, Plus, Edit2 } from "lucide-react";

export function WorkspaceMockup() {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    Product: true,
    Design: false,
    Engineering: false,
  });
  const [selectedPage, setSelectedPage] = useState("Roadmap");

  const toggleFolder = (name: string) => {
    setExpandedFolders((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const pages = {
    Product: ["Roadmap", "Release Notes", "Feedback"],
    Design: ["UI Kit", "Wireframes"],
    Engineering: ["API Docs", "Sprint Board"],
  };

  return (
    <div className="rounded-2xl border border-[#EAEAEA] shadow-lg overflow-hidden bg-white flex h-[420px]">
      {/* Sidebar */}
      <div className="w-44 border-r border-[#EAEAEA] bg-[#FAFAFA] p-2 overflow-auto">
        <div className="mb-3 flex items-center gap-1 text-xs font-medium text-[#111111]/60">
          <Search className="w-3 h-3" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-full text-[#111111]"
          />
        </div>
        {Object.keys(expandedFolders).map((folder) => (
          <div key={folder}>
            <button
              onClick={() => toggleFolder(folder)}
              className="flex items-center gap-1 w-full text-left px-2 py-1 rounded-md hover:bg-[#EAEAEA] text-sm font-medium"
            >
              {expandedFolders[folder] ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
              <Folder className="w-3 h-3" />
              <span>{folder}</span>
            </button>
            {expandedFolders[folder] && (
              <div className="ml-5 space-y-0.5 mt-0.5">
                {pages[folder as keyof typeof pages].map((page) => (
                  <button
                    key={page}
                    onClick={() => setSelectedPage(page)}
                    className={`flex items-center gap-1 w-full text-left px-2 py-1 rounded-md text-xs ${
                      selectedPage === page
                        ? "bg-[#4F46E5]/10 text-[#4F46E5] font-medium"
                        : "hover:bg-[#EAEAEA] text-[#111111]/70"
                    }`}
                  >
                    <FileText className="w-3 h-3" />
                    {page}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Main Area */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-[#111111]">{selectedPage}</h3>
          <div className="flex gap-1">
            <button className="p-1 rounded-md hover:bg-[#EAEAEA]">
              <Plus className="w-3 h-3" />
            </button>
            <button className="p-1 rounded-md hover:bg-[#EAEAEA]">
              <Edit2 className="w-3 h-3" />
            </button>
          </div>
        </div>
        <div className="text-sm text-[#111111]/70 space-y-2">
          {selectedPage === "Roadmap" && (
            <>
              <p>✓ Q2 goals defined</p>
              <p>• AI feature research</p>
              <p>• Design system update</p>
            </>
          )}
          {selectedPage === "Release Notes" && <p>v2.4.0 — Improved performance</p>}
          {selectedPage === "Feedback" && <p>User suggestions: dark mode, API rate limits</p>}
          {selectedPage === "UI Kit" && <p>Components: buttons, modals, forms</p>}
          {selectedPage === "Wireframes" && <p>Figma link: [draft]</p>}
          {selectedPage === "API Docs" && <p>REST endpoints, authentication</p>}
          {selectedPage === "Sprint Board" && <p>Current sprint: 3 tasks left</p>}
        </div>
      </div>
    </div>
  );
}