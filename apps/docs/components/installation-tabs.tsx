"use client";

import { useMemo, useState } from "react";

type InstallTab = "command" | "manual";
type InstallCommand = {
  id: string;
  label: string;
  command: string;
};

export function InstallationTabs() {
  const [activeTab, setActiveTab] = useState<InstallTab>("command");
  const [copiedCommandId, setCopiedCommandId] = useState<string | null>(null);

  const commandInstall = useMemo<InstallCommand[]>(
    () => [
      {
        id: "install-latest",
        label: "Install latest package",
        command: "pnpm add @calendar-kit/registry"
      },
      {
        id: "install-next",
        label: "Install prerelease channel",
        command: "pnpm add @calendar-kit/registry@next"
      }
    ],
    []
  );

  const manualInstall = useMemo<InstallCommand[]>(
    () => [
      {
        id: "manual-core-deps",
        label: "Install base dependencies",
        command: "pnpm add date-fns lucide-react"
      },
      {
        id: "manual-radix-deps",
        label: "Install Radix dependencies",
        command:
          "pnpm add @radix-ui/react-popover @radix-ui/react-select @radix-ui/react-scroll-area"
      },
      {
        id: "manual-utils-deps",
        label: "Install utility dependencies",
        command: "pnpm add class-variance-authority clsx tailwind-merge"
      }
    ],
    []
  );

  const activeCommands = activeTab === "command" ? commandInstall : manualInstall;

  const handleCopy = async (commandId: string, command: string) => {
    try {
      await navigator.clipboard.writeText(command);
      setCopiedCommandId(commandId);
      window.setTimeout(() => setCopiedCommandId(null), 1500);
    } catch {
      setCopiedCommandId(null);
    }
  };

  return (
    <div className="mt-4">
      <div
        role="tablist"
        aria-label="Installation modes"
        className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "command"}
          className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
            activeTab === "command"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
          onClick={() => setActiveTab("command")}
        >
          Command
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "manual"}
          className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
            activeTab === "manual"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
          onClick={() => setActiveTab("manual")}
        >
          Manual
        </button>
      </div>

      <div className="mt-3 space-y-3">
        {activeCommands.map((item) => (
          <div key={item.id}>
            <p className="mb-1 text-sm font-medium text-slate-700">{item.label}</p>
            <pre className="relative overflow-x-auto rounded-lg bg-slate-900 p-4 pr-24 text-sm text-slate-100">
              {item.command}
              <button
                type="button"
                className="absolute right-2 top-2 rounded-md border border-slate-600 bg-slate-800 px-2.5 py-1 text-xs text-slate-100 hover:bg-slate-700"
                onClick={() => handleCopy(item.id, item.command)}
              >
                {copiedCommandId === item.id ? "Copied" : "Copy"}
              </button>
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
