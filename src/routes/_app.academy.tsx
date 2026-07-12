import { createFileRoute } from "@tanstack/react-router";
import Page from "@/components/pages/academy";

export const Route = createFileRoute("/_app/academy")({
  head: () => ({
    meta: [
      { title: "Academy — Cryptvora" },
      { name: "description", content: "Trading academy and education on Cryptvora." },
    ],
  }),
  component: Page,
});
