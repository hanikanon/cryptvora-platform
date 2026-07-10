import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { LeftSidebar } from "@/components/community/LeftSidebar";
import { RightPanel } from "@/components/community/RightPanel";
import { MessageList } from "@/components/community/MessageList";
import { Composer } from "@/components/community/Composer";
import {
  ConversationHeader,
  MobileBottomNavImpl,
  NotificationPopover,
  Drawer,
} from "@/components/community/Chrome";
import {
  ChatCustomizer,
  SearchOverlay,
  CardGallerySheet,
  CommunitySheet,
  ProfileSheet,
} from "@/components/community/panels";
import { ScrollToBottom } from "@/components/community/interactions";
import { useChatSettings, WALLPAPER_CLASS } from "@/components/community/settings";

export const Route = createFileRoute("/app/community")({
  component: CommunityChat,
});

function CommunityChat() {
  const [active, setActive] = useState("signals");
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cardsOpen, setCardsOpen] = useState(false);
  const [communityOpen, setCommunityOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showScroll, setShowScroll] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const { settings, update, reset } = useChatSettings();

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowScroll(el.scrollHeight - el.scrollTop - el.clientHeight > 240);
  };

  const toBottom = () => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  };

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-background">
      {/* Desktop left sidebar */}
      <aside className="hidden w-[300px] shrink-0 border-r border-border lg:block">
        <LeftSidebar
          active={active}
          onSelect={setActive}
          onOpenProfile={() => setProfileOpen(true)}
          onCustomize={() => setCustomizeOpen(true)}
        />
      </aside>

      {/* Center conversation */}
      <main className="relative flex min-w-0 flex-1 flex-col">
        <ConversationHeader
          onOpenLeft={() => setLeftOpen(true)}
          onOpenRight={() => setRightOpen(true)}
          onToggleNotif={() => setNotifOpen((v) => !v)}
          onSearch={() => setSearchOpen(true)}
          onCustomize={() => setCustomizeOpen(true)}
          onCards={() => setCardsOpen(true)}
        />

        <div
          ref={scrollRef}
          onScroll={onScroll}
          className={cn("relative flex-1 overflow-y-auto thin-scroll", WALLPAPER_CLASS[settings.wallpaper])}
        >
          <div className="mx-auto max-w-3xl">
            <MessageList settings={settings} />
          </div>
        </div>

        <ScrollToBottom show={showScroll} onClick={toBottom} />

        <Composer />
        <MobileBottomNavImpl
          onOpenLeft={() => setLeftOpen(true)}
          onExplore={() => setCommunityOpen(true)}
          onSaved={() => setCardsOpen(true)}
        />

        {notifOpen && <NotificationPopover onClose={() => setNotifOpen(false)} />}
      </main>

      {/* Desktop right panel */}
      <aside className="hidden w-[320px] shrink-0 border-l border-border xl:block">
        <RightPanel />
      </aside>

      {/* Mobile drawers */}
      <Drawer side="left" open={leftOpen} onClose={() => setLeftOpen(false)}>
        <LeftSidebar
          active={active}
          onSelect={(id) => {
            setActive(id);
            setLeftOpen(false);
          }}
          onOpenProfile={() => {
            setLeftOpen(false);
            setProfileOpen(true);
          }}
          onCustomize={() => {
            setLeftOpen(false);
            setCustomizeOpen(true);
          }}
        />
      </Drawer>
      <Drawer side="right" open={rightOpen} onClose={() => setRightOpen(false)}>
        <RightPanel />
      </Drawer>

      {/* Premium feature overlays */}
      <ChatCustomizer
        open={customizeOpen}
        onClose={() => setCustomizeOpen(false)}
        settings={settings}
        update={update}
        reset={reset}
      />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CardGallerySheet open={cardsOpen} onClose={() => setCardsOpen(false)} />
      <CommunitySheet open={communityOpen} onClose={() => setCommunityOpen(false)} />
      <ProfileSheet open={profileOpen} onClose={() => setProfileOpen(false)} />
    </div>
  );
}
