import { createFileRoute } from "@tanstack/react-router";
import Page from "@/components/pages/calendar";

export const Route = createFileRoute("/_app/calendar")({
  head: () => ({
    meta: [
      { title: "Calendar — Cryptvora" },
      { name: "description", content: "Economic calendar and monthly PnL on Cryptvora." },
    ],
  }),
  component: Page,
});
