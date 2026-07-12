import { createFileRoute } from "@tanstack/react-router";
import Page from "@/components/pages/profile";

export const Route = createFileRoute("/_app/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Cryptvora" },
      { name: "description", content: "Your Cryptvora profile, levels and achievements on Cryptvora." },
    ],
  }),
  component: Page,
});
