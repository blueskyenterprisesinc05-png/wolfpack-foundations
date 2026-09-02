import { useState } from "react";
import { Outlet } from "@tanstack/react-router";
import { BottomNav } from "./BottomNav";
import { ServerNav } from "./ServerNav";
import { Topbar } from "./Topbar";

export function AppLayout() {
  const [navOpen, setNavOpen] = useState(false);
  const [activeCampusId, setActiveCampusId] = useState("trading");
  const [activeChannelId, setActiveChannelId] = useState("daily-lessons-audio");
  const [channelName, setChannelName] = useState("daily-lessons (audio)");

  const handleSelectChannel = (campusId: string, channelId: string) => {
    setActiveCampusId(campusId);
    setActiveChannelId(channelId);
    // derive display name from channelId
    setChannelName(channelId.replace(/-/g, " ").replace(/\(([^)]+)\)/g, "($1)"));
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100dvh",
        width: "100%",
        overflow: "hidden",
        backgroundColor: "var(--bg-obsidian)",
        color: "var(--text-primary)",
      }}
    >
      {/* Top bar */}
      <Topbar
        onHamburgerClick={() => setNavOpen(true)}
        channelName={channelName}
        unreadCount={220}
      />

      {/* Slide-in server/channel nav */}
      <ServerNav
        isOpen={navOpen}
        onClose={() => setNavOpen(false)}
        activeCampusId={activeCampusId}
        activeChannelId={activeChannelId}
        onSelectChannel={handleSelectChannel}
      />

      {/* Main scrollable content area */}
      <main
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          paddingBottom: "64px", // space for BottomNav
        }}
      >
        <Outlet />
      </main>

      {/* Bottom navigation */}
      <BottomNav />
    </div>
  );
}
