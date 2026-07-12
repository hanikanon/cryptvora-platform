import { createFileRoute } from "@tanstack/react-router";
import Page from "@/components/pages/news";

export const Route = createFileRoute("/_app/news")({
  head: () => ({
    meta: [
      { title: "News — Cryptvora" },
      { name: "description", content: "Crypto market news feed on Cryptvora." },
    ],
  }),
  component: Page,
});
