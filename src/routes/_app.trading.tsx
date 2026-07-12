import { createFileRoute } from "@tanstack/react-router";
import Page from "@/components/pages/trading";

export const Route = createFileRoute("/_app/trading")({
  head: () => ({
    meta: [
      { title: "Trading — Cryptvora" },
      { name: "description", content: "Trading terminal with candlestick charts, order book and execution on Cryptvora." },
    ],
  }),
  component: Page,
});
