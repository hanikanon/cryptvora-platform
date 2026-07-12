import { createFileRoute } from "@tanstack/react-router";
import Page from "@/components/pages/risk";

export const Route = createFileRoute("/_app/risk")({
  head: () => ({
    meta: [
      { title: "Risk — Cryptvora" },
      { name: "description", content: "Risk management engine and exposure scoring on Cryptvora." },
    ],
  }),
  component: Page,
});
