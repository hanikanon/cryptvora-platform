import { createFileRoute } from "@tanstack/react-router";
import Page from "@/components/pages/levels";

export const Route = createFileRoute("/_app/levels")({
  head: () => ({
    meta: [
      { title: "Levels — Cryptvora" },
      { name: "description", content: "Two parallel 20-tier progression tracks: Portfolio and Trader." },
    ],
  }),
  component: Page,
});
