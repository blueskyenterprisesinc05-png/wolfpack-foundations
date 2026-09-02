import { useState } from "react";

type Channel = {
  id: string;
  emoji?: string;
  name: string;
  hasLive?: boolean;
  unreadCount?: number;
};

type ChannelCategory = {
  id: string;
  name: string;
  channels: Channel[];
};

type Campus = {
  id: string;
  name: string;
  emoji: string;
  unreadCount?: number;
  categories: ChannelCategory[];
};

const CAMPUSES: Campus[] = [
  {
    id: "trading",
    name: "Trading Campus",
    emoji: "📈",
    unreadCount: 220,
    categories: [
      {
        id: "trading-campus",
        name: "TRADING CAMPUS 📋",
        channels: [
          { id: "start-here", name: "start-here" },
          { id: "trading-announcements", emoji: "📢", name: "trading-announcements" },
          { id: "trading-wins", emoji: "💰", name: "trading-wins" },
          { id: "trading-competition", emoji: "🏆", name: "trading-competition" },
        ],
      },
      {
        id: "got-a-question",
        name: "GOT A QUESTION? ❓",
        channels: [
          { id: "ask-the-team", name: "ask-the-team" },
          { id: "beginner-help", name: "beginner-help" },
        ],
      },
      {
        id: "videos-lessons",
        name: "VIDEOS & LESSONS 📺🎧",
        channels: [
          { id: "daily-levels", emoji: "📊", name: "daily-levels" },
          { id: "trade-of-the-day", name: "trade-of-the-day" },
          { id: "daily-lessons-audio", name: "daily-lessons (audio)" },
          { id: "daily-streams", name: "daily-streams" },
          { id: "weekly-monthly-analysis", name: "weekly-monthly-analysis" },
        ],
      },
    ],
  },
  {
    id: "hustlers",
    name: "Hustler's Campus",
    emoji: "💼",
    categories: [
      {
        id: "general-info",
        name: "GENERAL INFO",
        channels: [
          { id: "begin-here", emoji: "👉", name: "BEGIN HERE" },
          { id: "announcements", emoji: "📢", name: "Announcements" },
          { id: "introduce-yourself", emoji: "💡", name: "Introduce Yourself" },
        ],
      },
      {
        id: "proof-of-work",
        name: "PROOF OF WORK",
        channels: [
          { id: "money-wins", emoji: "🏆", name: "Money Wins" },
          { id: "leaderboard", emoji: "📊", name: "Leaderboard" },
        ],
      },
      {
        id: "do-this-daily",
        name: "DO THIS DAILY",
        channels: [
          { id: "gmm", emoji: "☀️", name: "GMM" },
          { id: "wisdom", emoji: "🔥", name: "Wisdom" },
          { id: "gratitude", emoji: "⚡", name: "Gratitude" },
          { id: "daily-lesson", emoji: "💰", name: "Daily Lesson" },
          { id: "daily-checklist", emoji: "☑️", name: "Daily Checklist" },
          { id: "moneybags-journal", emoji: "🌸", name: "Moneybag's Journal" },
          { id: "daily-accomplishment", emoji: "💎", name: "Daily Accomplishment" },
        ],
      },
    ],
  },
];

interface ServerNavProps {
  isOpen: boolean;
  onClose: () => void;
  activeCampusId: string;
  activeChannelId: string;
  onSelectChannel: (campusId: string, channelId: string) => void;
}

export function ServerNav({
  isOpen,
  onClose,
  activeCampusId,
  activeChannelId,
  onSelectChannel,
}: ServerNavProps) {
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());
  const [showCampusSwitcher, setShowCampusSwitcher] = useState(false);

  const campus = CAMPUSES.find((c) => c.id === activeCampusId) ?? CAMPUSES[0];

  const toggleCategory = (id: string) => {
    setCollapsedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 200,
          }}
        />
      )}

      {/* Sidebar panel */}
      <aside
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: "min(85vw, 320px)",
          backgroundColor: "var(--surface-charcoal)",
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 280ms cubic-bezier(0.16, 1, 0.3, 1)",
          zIndex: 210,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        {/* Campus header */}
        <div
          style={{
            padding: "16px 16px 12px",
            borderBottom: "1px solid var(--border-graphite)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            backgroundColor: "var(--surface-charcoal)",
            zIndex: 1,
          }}
        >
          <button
            onClick={() => setShowCampusSwitcher(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: "none",
              border: "none",
              color: "var(--text-primary)",
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              fontSize: "16px",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <span style={{ fontSize: "22px" }}>{campus.emoji}</span>
            <span>{campus.name}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ color: "var(--text-muted)" }}>
              <polyline points="6 9 12 15 18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* 3-dot menu */}
          <button
            style={{
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              padding: "4px",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="5" r="1.5" fill="currentColor"/>
              <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
              <circle cx="12" cy="19" r="1.5" fill="currentColor"/>
            </svg>
          </button>
        </div>

        {/* Channel list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 0 80px" }}>
          {campus.categories.map((cat) => {
            const isCollapsed = collapsedCategories.has(cat.id);
            return (
              <div key={cat.id}>
                {/* Category header */}
                <button
                  onClick={() => toggleCategory(cat.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    width: "100%",
                    padding: "10px 16px 4px",
                    background: "none",
                    border: "none",
                    color: "var(--text-muted)",
                    fontSize: "11px",
                    fontWeight: 600,
                    fontFamily: "var(--font-body)",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    style={{
                      transform: isCollapsed ? "rotate(-90deg)" : "rotate(0deg)",
                      transition: "transform 180ms ease",
                      flexShrink: 0,
                    }}
                  >
                    <polyline points="6 9 12 15 18 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {cat.name}
                </button>

                {/* Channels */}
                {!isCollapsed && cat.channels.map((ch) => {
                  const isActive = ch.id === activeChannelId;
                  return (
                    <button
                      key={ch.id}
                      onClick={() => {
                        onSelectChannel(campus.id, ch.id);
                        onClose();
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        width: "100%",
                        padding: "7px 12px 7px 16px",
                        background: isActive ? "var(--bg-obsidian)" : "none",
                        border: "none",
                        borderRadius: isActive ? "6px" : 0,
                        marginLeft: isActive ? 0 : 0,
                        color: isActive ? "var(--text-primary)" : "var(--text-muted)",
                        fontFamily: "var(--font-body)",
                        fontSize: "14px",
                        fontWeight: isActive ? 600 : 400,
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "background 120ms ease, color 120ms ease",
                      }}
                    >
                      {ch.emoji ? (
                        <span style={{ fontSize: "15px", flexShrink: 0 }}>{ch.emoji}</span>
                      ) : (
                        <span style={{ color: "var(--text-muted)", flexShrink: 0, fontWeight: 400, fontSize: "14px" }}>|</span>
                      )}
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {ch.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </aside>

      {/* Campus Switcher Bottom Sheet */}
      {showCampusSwitcher && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            zIndex: 300,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
          onClick={() => setShowCampusSwitcher(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "var(--surface-charcoal)",
              borderRadius: "16px 16px 0 0",
              padding: "20px 0 40px",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            {/* Sheet header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 20px 16px",
                borderBottom: "1px solid var(--border-graphite)",
                marginBottom: "8px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.75"/>
                  <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.75"/>
                  <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.75"/>
                  <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.75"/>
                </svg>
                <span style={{ color: "var(--text-primary)", fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "16px" }}>
                  My Campuses
                </span>
              </div>
              <button
                onClick={() => setShowCampusSwitcher(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                  fontSize: "20px",
                  cursor: "pointer",
                  lineHeight: 1,
                  padding: "4px",
                }}
              >
                ✕
              </button>
            </div>

            {/* Campus list */}
            {CAMPUSES.map((c) => {
              const isSelected = c.id === activeCampusId;
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    onSelectChannel(c.id, c.categories[0]?.channels[0]?.id ?? "");
                    setShowCampusSwitcher(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    width: "100%",
                    padding: "12px 20px",
                    background: isSelected ? "var(--brand-gold)22" : "none",
                    border: "none",
                    borderLeft: isSelected ? "3px solid var(--brand-gold)" : "3px solid transparent",
                    color: isSelected ? "var(--text-primary)" : "var(--text-muted)",
                    fontFamily: "var(--font-body)",
                    fontSize: "15px",
                    fontWeight: isSelected ? 700 : 400,
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <span
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      backgroundColor: "var(--bg-obsidian)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "20px",
                      flexShrink: 0,
                      position: "relative",
                    }}
                  >
                    {c.emoji}
                    {c.unreadCount ? (
                      <span
                        style={{
                          position: "absolute",
                          top: "-4px",
                          right: "-6px",
                          backgroundColor: "var(--brand-crimson)",
                          color: "#fff",
                          borderRadius: "9999px",
                          fontSize: "9px",
                          fontWeight: 700,
                          padding: "2px 5px",
                          lineHeight: 1,
                        }}
                      >
                        {c.unreadCount}
                      </span>
                    ) : null}
                  </span>
                  <span style={{ flex: 1 }}>{c.name}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: "var(--text-muted)" }}>
                    <polyline points="9 18 15 12 9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              );
            })}

            {/* Add campus */}
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                width: "100%",
                padding: "12px 20px",
                background: "none",
                border: "none",
                color: "var(--brand-gold)",
                fontFamily: "var(--font-body)",
                fontSize: "15px",
                fontWeight: 500,
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <span
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: "var(--bg-obsidian)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
                  color: "var(--brand-gold)",
                  flexShrink: 0,
                }}
              >
                +
              </span>
              Add Campus
            </button>
          </div>
        </div>
      )}
    </>
  );
}
