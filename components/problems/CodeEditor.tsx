"use client";

import { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { CaretDown, Copy, Check, FloppyDisk, CircleNotch } from "@phosphor-icons/react";
import { FaPaste } from "react-icons/fa";

const LANGUAGES = [
  { id: "cpp", label: "C++" },
  { id: "java", label: "Java" },
  { id: "python", label: "Python" },
  { id: "javascript", label: "JavaScript" },
  { id: "typescript", label: "TypeScript" },
];

type CodeEditorProps = {
  code?: string;
  approach?: "brute" | "optimal";
  setApproach: (approach: "brute" | "optimal") => void;
  problemId?: string;
  hasNote?: boolean;
  language?: string;
  setLanguage?: (language: string) => void;
  onSaved?: (approach: "brute" | "optimal", savedCode: string) => void;
};


function CodeEditor({
  code,
  approach = "brute",
  setApproach,
  problemId,
  hasNote,
  onSaved,
  language,
  setLanguage
}: CodeEditorProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pasted, setPasted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">("idle");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);

  const handleSaveCode = async () => {
    if (!problemId || isSaving) return;

    const currentText = editorRef.current ? editorRef.current.getValue() : code || "";
    setIsSaving(true);
    setSaveStatus("idle");

    const payload =
      approach === "brute"
        ? { bruteForceApproach: currentText, language }
        : { optimizedApproach: currentText, language };

    try {
      // If note already exists, use PATCH; otherwise create it with POST
      const method = hasNote ? "PATCH" : "POST";
      const res = await fetch(`/api/problems/${problemId}/note`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok && res.status === 409) {
        // If conflict (e.g. note was created elsewhere), retry as PATCH
        await fetch(`/api/problems/${problemId}/note`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        setSaveStatus("saved");
        onSaved?.(approach, currentText);
        setTimeout(() => setSaveStatus("idle"), 2500);
      } else {
        setSaveStatus("error");
        setTimeout(() => setSaveStatus("idle"), 2500);
      }
    } catch (err) {
      console.error("Failed to save code:", err);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 2500);
    } finally {
      setIsSaving(false);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCopyCode = () => {
    const codeToCopy = editorRef.current ? editorRef.current.getValue() : "";
    if (codeToCopy) {
      navigator.clipboard.writeText(codeToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePasteCode = () => {
    navigator.clipboard.readText().then((text) => {
      if (editorRef.current) {
        editorRef.current.setValue(text);
      }
    });
    setPasted(true);
    setTimeout(() => setPasted(false), 2000);
  }

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    monaco.editor.defineTheme("trace-dark", {
      base: "vs-dark",
      inherit: true,

      rules: [
        {
          token: "keyword",
          foreground: "C678DD",
        },
        {
          token: "string",
          foreground: "98C379",
        },
        {
          token: "number",
          foreground: "D19A66",
        },
        {
          token: "comment",
          foreground: "6A737D",
        },
        {
          token: "type",
          foreground: "61AFEF",
        },
      ],

      colors: {
        "editor.background": "#18181BB3",
        "editor.foreground": "#E6EDF3",
        "editorLineNumber.foreground": "#484F58",
        "editorLineNumber.activeForeground": "#A6E795",
        "editorCursor.foreground": "#A6E795",
        "editor.selectionBackground": "#264F36",
      },
    });

    monaco.editor.setTheme("trace-dark");
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/70">
      {/* Mac-style header */}
      <div className="flex h-12 items-center justify-between border-b border-zinc-800 bg-zinc-900/70 px-4">
        {/* Left: Traffic lights & Approach Buttons */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>

          <div className="flex items-center gap-1 rounded-lg border border-zinc-700/60 bg-zinc-800/80 p-0.5 shadow-sm">
            <button
              type="button"
              onClick={() => setApproach("brute")}
              className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${approach === "brute"
                ? "bg-[#A6E795]/15 text-[#A6E795] shadow-xs"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/40"
                }`}
            >
              Brute Force
            </button>
            <button
              type="button"
              onClick={() => setApproach("optimal")}
              className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${approach === "optimal"
                ? "bg-[#A6E795]/15 text-[#A6E795] shadow-xs"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/40"
                }`}
            >
              Optimal
            </button>
          </div>
        </div>

        {/* Right Toolbar: Language Dropdown, Copy, Paste & Save */}
        <div className="flex items-center gap-2">
          {/* Custom Dark Theme Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-700/60 bg-zinc-800/80 px-2.5 py-1 text-xs font-semibold text-zinc-200 transition-colors hover:border-zinc-600 hover:bg-zinc-800 focus:border-[#A6E795]/60 shadow-sm"
            >
              <span>{LANGUAGES.find((l) => l.id === language)?.label || "C++"}</span>
              <CaretDown
                size={11}
                weight="bold"
                className={`text-zinc-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180 text-[#A6E795]" : ""
                  }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-36 rounded-xl border border-zinc-800 bg-[#0C0E15] p-1 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-100">
                {LANGUAGES.map((lang) => {
                  const isSelected = lang.id === language;
                  return (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() => {
                        setLanguage?.(lang.id);
                        setIsDropdownOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${isSelected
                        ? "bg-[#A6E795]/15 text-[#A6E795] font-semibold"
                        : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200"
                        }`}
                    >
                      <span>{lang.label}</span>
                      {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-[#A6E795]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Copy Button with Feedback */}
          <button
            type="button"
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-700/60 bg-zinc-800/80 px-2.5 py-1 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:bg-zinc-800 hover:text-white"
            title="Copy code"
          >
            {copied ? (
              <>
                <Check size={12} weight="bold" className="text-[#A6E795]" />
                <span className="text-[11px] font-semibold text-[#A6E795]">Copied!</span>
              </>
            ) : (
              <>
                <Copy size={12} className="text-zinc-400" />
                <span className="text-[11px]">Copy</span>
              </>
            )}
          </button>

          {/* Paste Button */}
          <button
            type="button"
            onClick={handlePasteCode}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-700/60 bg-zinc-800/80 px-2.5 py-1 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:bg-zinc-800 hover:text-white"
            title="Paste code"
          >
            {pasted ? (
              <>
                <Check size={12} weight="bold" className="text-[#A6E795]" />
                <span className="text-[11px] font-semibold text-[#A6E795]">Pasted!</span>
              </>
            ) : (
              <>
                <FaPaste size={12} className="text-zinc-400" />
                <span className="text-[11px]">Paste</span>
              </>
            )}
          </button>

          {/* Save Button (Ctrl+S / Cmd+S) */}
          <button
            type="button"
            onClick={handleSaveCode}
            disabled={isSaving}
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${saveStatus === "saved"
              ? "border-[#A6E795]/50 bg-[#A6E795]/15 text-[#A6E795]"
              : saveStatus === "error"
                ? "border-rose-500/50 bg-rose-500/10 text-rose-400"
                : isSaving
                  ? "border-zinc-700 bg-zinc-800/60 text-zinc-400 cursor-not-allowed"
                  : "border-[#A6E795]/30 bg-[#A6E795]/10 text-[#A6E795] hover:bg-[#A6E795]/20 hover:border-[#A6E795]/60"
              }`}
            title="Save code to database (Ctrl+S)"
          >
            {isSaving ? (
              <>
                <CircleNotch size={12} className="animate-spin text-[#A6E795]" />
                <span className="text-[11px]">Saving...</span>
              </>
            ) : saveStatus === "saved" ? (
              <>
                <Check size={12} weight="bold" className="text-[#A6E795]" />
                <span className="text-[11px]">Saved!</span>
              </>
            ) : saveStatus === "error" ? (
              <span className="text-[11px]">Error</span>
            ) : (
              <>
                <FloppyDisk size={12} weight="bold" />
                <span className="text-[11px]">Save</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Monaco */}
      <Editor
        height="400px"
        width="100%"
        language={language}
        onMount={handleEditorDidMount}
        value={code ? code : ''}
        theme="trace-dark"
        options={{
          minimap: {
            enabled: false,
          },
          fontSize: 14,
          lineHeight: 22,
          padding: {
            top: 16,
            bottom: 16,
          },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          smoothScrolling: true,
          cursorBlinking: "smooth",
          bracketPairColorization: {
            enabled: true,
          },
        }}
      />
    </div>
  );
}

export default CodeEditor;
