import { createFileRoute } from "@tanstack/react-router";
import Page from "@/components/pages/portfolio";

export const Route = createFileRoute("/_app/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — Cryptvora" },
      { name: "description", content: "Portfolio analytics, holdings, allocation and performance on Cryptvora." },
    ],
  }),
  component: Page,
});
