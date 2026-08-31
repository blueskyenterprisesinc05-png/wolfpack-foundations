import { ReactNode } from "react";
import { CampusSidebar } from "./campus-sidebar";
import { MemberSidebar } from "./member-sidebar";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Users, Hash } from "lucide-react";

export function ChatLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-[calc(100dvh-3.5rem-4rem)] lg:h-[100dvh] w-full overflow-hidden bg-background">
      {/* Desktop Left Sidebar - Campus Navigation */}
      <aside className="hidden w-64 flex-col border-r border-border bg-charcoal md:flex">
        <CampusSidebar />
      </aside>

      {/* Main Chat Feed Area */}
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden relative">
        {/* Mobile headers for sidebars */}
        <div className="flex items-center justify-between border-b border-border bg-charcoal px-4 py-2 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0 border-r border-border">
              <SheetHeader className="sr-only">
                <SheetTitle>Campus Navigation</SheetTitle>
              </SheetHeader>
              <CampusSidebar />
            </SheetContent>
          </Sheet>
          <span className="flex items-center gap-2 font-semibold text-foreground text-sm"><Hash className="size-4" /> General Chat</span>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <Users className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0 border-l border-border">
              <SheetHeader className="sr-only">
                <SheetTitle>Campus Members</SheetTitle>
              </SheetHeader>
              <MemberSidebar />
            </SheetContent>
          </Sheet>
        </div>

        {children}
      </main>

      {/* Desktop Right Sidebar - Members */}
      <aside className="hidden w-64 flex-col border-l border-border bg-charcoal xl:flex">
        <MemberSidebar />
      </aside>
    </div>
  );
}
