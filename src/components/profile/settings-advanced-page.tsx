import { useState, useEffect } from "react";
import { ArrowLeft, Clock, Plus, X, Save } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { updateProfileFn, getCurrentProfileFn } from "@/lib/profile";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const DEFAULT_DELAYS = [5, 15, 30];

export function SettingsAdvancedPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["currentProfile"],
    queryFn: () => getCurrentProfileFn(),
  });

  const profile = data?.profile;

  // State
  const [disableTypingIndicator, setDisableTypingIndicator] = useState(false);
  const [customDelays, setCustomDelays] = useState<number[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Load from profile personal_info
  useEffect(() => {
    if (profile?.personal_info) {
      const info = profile.personal_info;
      if (info.disable_typing_indicator !== undefined) {
        setDisableTypingIndicator(info.disable_typing_indicator === "true");
      }
      if (info.custom_message_delays) {
        try {
          const delays = JSON.parse(info.custom_message_delays);
          if (Array.isArray(delays)) setCustomDelays(delays);
        } catch (_) {}
      }
    }
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: updateProfileFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentProfile"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
  });

  const handleSave = async () => {
    setIsSaving(true);
    await updateMutation.mutateAsync({
      data: {
        personal_info: {
          ...(profile?.personal_info || {}),
          disable_typing_indicator: String(disableTypingIndicator),
          custom_message_delays: JSON.stringify(customDelays),
        },
      },
    });
    setIsSaving(false);
  };

  const addDelay = () => {
    const val = window.prompt("Enter a delay in minutes (number only):");
    if (!val) return;
    const parsed = parseInt(val, 10);
    if (isNaN(parsed) || parsed <= 0) return;
    if (customDelays.includes(parsed)) return;
    setCustomDelays((prev) => [...prev, parsed].sort((a, b) => a - b));
  };

  const removeDelay = (delay: number) => {
    setCustomDelays((prev) => prev.filter((d) => d !== delay));
  };

  const resetToDefaults = () => {
    setCustomDelays([]);
  };

  const usingDefaults = customDelays.length === 0;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080b11] text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080b11] text-white pb-24 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-white/5 bg-[#0d121c] px-4 py-3">
        <div className="flex items-center gap-3">
          <Link to="/settings" className="text-white hover:text-gray-300 transition-colors">
            <ArrowLeft className="size-6" />
          </Link>
          <h1 className="text-xl font-bold">Advanced</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="rounded bg-[#a78b5a] px-5 py-1.5 text-sm font-bold text-[#0d121c] transition-colors hover:bg-[#bda06b] disabled:opacity-50"
        >
          {saved ? "SAVED!" : isSaving ? "SAVING..." : "SAVE"}
        </button>
      </header>

      <main className="mx-auto max-w-2xl p-4 space-y-6">
        <h2 className="text-2xl font-bold">Advanced Preferences</h2>

        {/* Typing Indicator Toggle */}
        <div className="flex items-center justify-between rounded-xl bg-[#0d121c] px-5 py-4">
          <span className="text-base font-medium">Disable Typing Users on Channels</span>
          <button
            role="switch"
            aria-checked={disableTypingIndicator}
            onClick={() => setDisableTypingIndicator((v) => !v)}
            className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
              disableTypingIndicator ? "bg-[#a78b5a]" : "bg-white/20"
            }`}
          >
            <span
              className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-lg transition-transform duration-200 ${
                disableTypingIndicator ? "translate-x-7" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Scheduled Message Delays */}
        <div className="rounded-xl border border-white/10 bg-[#111827] p-5 space-y-4">
          {/* Card Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="size-5 text-gray-400" strokeWidth={1.5} />
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-300">
                Scheduled Message Delays
              </h3>
            </div>
            <button
              onClick={addDelay}
              className="flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10 transition-colors"
            >
              <Plus className="size-4" />
              Add delay
            </button>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-400 leading-relaxed">
            Customize the Send in... menu. Leave this empty to use the default 5, 15, and 30 minute
            options.
          </p>

          {/* Current Delays Display */}
          <div className="rounded-lg bg-white/5 px-4 py-3 text-sm text-gray-300">
            {usingDefaults ? (
              <span>
                Using defaults:{" "}
                {DEFAULT_DELAYS.map((d) => `${d} minutes`).join(", ")}
              </span>
            ) : (
              <div className="flex flex-wrap gap-2">
                {customDelays.map((d) => (
                  <span
                    key={d}
                    className="flex items-center gap-1.5 rounded-full bg-[#1f2937] px-3 py-1 text-sm font-semibold"
                  >
                    {d} min
                    <button
                      onClick={() => removeDelay(d)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Status Text */}
          <p className="text-sm text-gray-500 italic">
            {usingDefaults
              ? "No custom delays saved."
              : `${customDelays.length} custom delay${customDelays.length !== 1 ? "s" : ""} saved.`}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={resetToDefaults}
              disabled={usingDefaults}
              className="flex-1 rounded-lg border border-white/20 bg-[#1f2937] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Reset to defaults
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#a78b5a] px-4 py-3 text-sm font-bold text-[#0d121c] transition-colors hover:bg-[#bda06b] disabled:opacity-50"
            >
              <Save className="size-4" />
              {isSaving ? "Saving..." : "Save delays"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
