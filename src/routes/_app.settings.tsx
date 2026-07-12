import { createFileRoute } from "@tanstack/react-router";
import Page from "@/components/pages/settings";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Cryptvora" },
      { name: "description", content: "Account and platform settings on Cryptvora." },
    ],
  }),
  component: Page,
});
