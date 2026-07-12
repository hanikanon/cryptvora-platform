import { createFileRoute } from "@tanstack/react-router";
import Page from "@/components/pages/exchanges";

export const Route = createFileRoute("/_app/exchanges")({
  head: () => ({
    meta: [
      { title: "Exchanges — Cryptvora" },
      { name: "description", content: "Multi-exchange API connectivity on Cryptvora." },
    ],
  }),
  component: Page,
});
