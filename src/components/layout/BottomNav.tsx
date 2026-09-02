import { Link, useRouterState } from "@tanstack/react-router";

const NAV_ITEMS = [
  {
    to: "/chat",
    label: "Chat",
    badge: 107,
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
          stroke="currentColor" strokeWidth={active ? 2.25 : 1.75}
          strokeLinecap="round" strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    to: "/courses",
    label: "Courses",
    badge: 0,
    icon: () => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    to: "/inbox",
    label: "Inbox",
    badge: 0,
    icon: () => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    to: "/market",
    label: "Market",
    badge: 0,
    icon: () => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="3" width="7" height="9" rx="1" stroke="currentColor" strokeWidth="1.75"/>
        <rect x="15" y="3" width="7" height="9" rx="1" stroke="currentColor" strokeWidth="1.75"/>
        <rect x="2" y="15" width="7" height="6" rx="1" stroke="currentColor" strokeWidth="1.75"/>
        <rect x="15" y="15" width="7" height="6" rx="1" stroke="currentColor" strokeWidth="1.75"/>
      </svg>
    ),
  },
  {
    to: "/more",
    label: "More",
    badge: 0,
    icon: () => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="5" cy="12" r="1.5" fill="currentColor"/>
        <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
        <circle cx="19" cy="12" r="1.5" fill="currentColor"/>
      </svg>
    ),
  },
];

export function BottomNav() {
  const { location } = useRouterState();
  const path = location.pathname;

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "64px",
        backgroundColor: "var(--bg-obsidian)",
        borderTop: "1px solid var(--border-graphite)",
        display: "flex",
        zIndex: 100,
      }}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = path === item.to || path.startsWith(item.to + "/");
        return (
          <Link
            key={item.to}
            to={item.to}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "3px",
              textDecoration: "none",
              color: isActive ? "var(--brand-gold)" : "var(--text-muted)",
              fontSize: "10px",
              fontFamily: "var(--font-body)",
              fontWeight: 500,
              position: "relative",
              transition: "color 150ms ease",
            }}
          >
            {item.badge > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "6px",
                  left: "calc(50% + 4px)",
                  backgroundColor: "var(--brand-crimson)",
                  color: "#fff",
                  borderRadius: "9999px",
                  fontSize: "9px",
                  fontWeight: 700,
                  lineHeight: 1,
                  padding: "2px 5px",
                  minWidth: "16px",
                  textAlign: "center",
                }}
              >
                {item.badge > 99 ? "99+" : item.badge}
              </span>
            )}
            <span style={{ width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {item.icon(isActive)}
            </span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
