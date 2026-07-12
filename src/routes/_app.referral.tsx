import { createFileRoute } from "@tanstack/react-router";
import Page from "@/components/pages/referral";

export const Route = createFileRoute("/_app/referral")({
  head: () => ({
    meta: [
      { title: "Referral — Cryptvora" },
      { name: "description", content: "Referral program and rewards on Cryptvora." },
    ],
  }),
  component: Page,
});
