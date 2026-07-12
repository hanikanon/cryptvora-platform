import { createFileRoute } from "@tanstack/react-router";
import Page from "@/components/pages/markets";

export const Route = createFileRoute("/_app/markets")({
  head: () => ({
    meta: [
      { title: "Markets — Cryptvora" },
      { name: "description", content: "Live crypto market prices, movers and heatmap on Cryptvora." },
    ],
  }),
  component: Page,
});
