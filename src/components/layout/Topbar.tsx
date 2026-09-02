interface TopbarProps {
  onHamburgerClick: () => void;
  channelName?: string;
  unreadCount?: number;
}

export function Topbar({ onHamburgerClick, channelName = "daily-lessons (audio)", unreadCount = 220 }: TopbarProps) {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        left: 0,
        right: 0,
        height: "48px",
        backgroundColor: "var(--bg-obsidian)",
        borderBottom: "1px solid var(--border-graphite)",
        display: "flex",
        alignItems: "center",
        padding: "0 8px 0 4px",
        gap: "6px",
        zIndex: 50,
        flexShrink: 0,
      }}
    >
      {/* Hamburger / menu button with unread badge */}
      <button
        onClick={onHamburgerClick}
        style={{
          background: "none",
          border: "none",
          color: "var(--text-primary)",
          cursor: "pointer",
          padding: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          flexShrink: 0,
        }}
        aria-label="Open navigation"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round"/>
          <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round"/>
          <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round"/>
        </svg>
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "4px",
              right: "4px",
              backgroundColor: "var(--brand-crimson)",
              color: "#fff",
              borderRadius: "9999px",
              fontSize: "8px",
              fontWeight: 700,
              lineHeight: 1,
              padding: "2px 4px",
              minWidth: "14px",
              textAlign: "center",
            }}
          >
            {unreadCount > 999 ? "999+" : unreadCount}
          </span>
        )}
      </button>

      {/* Hash / channel icon */}
      <span style={{ color: "var(--text-muted)", flexShrink: 0 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <line x1="4" y1="9" x2="20" y2="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <line x1="4" y1="15" x2="20" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <line x1="10" y1="3" x2="8" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <line x1="16" y1="3" x2="14" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </span>

      {/* Channel name */}
      <span
        style={{
          color: "var(--text-primary)",
          fontFamily: "var(--font-body)",
          fontSize: "14px",
          fontWeight: 600,
          flex: 1,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {channelName}
      </span>

      {/* Search icon */}
      <button
        style={{
          background: "none",
          border: "none",
          color: "var(--text-muted)",
          cursor: "pointer",
          padding: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
        aria-label="Search"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
          <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>

      {/* Member list icon */}
      <button
        style={{
          background: "none",
          border: "none",
          color: "var(--text-muted)",
          cursor: "pointer",
          padding: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
        aria-label="Member list"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
    </header>
  );
}
