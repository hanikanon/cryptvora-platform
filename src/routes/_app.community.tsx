import { createFileRoute } from "@tanstack/react-router";
import { CommunityChat } from "@/components/community/CommunityChat";

export const Route = createFileRoute("/_app/community")({
  head: () => ({
    meta: [
      { title: "Community — Cryptvora" },
      { name: "description", content: "Cryptvora community chat: rooms, signals, private messages and AI assistant." },
    ],
  }),
  component: CommunityChat,
});
