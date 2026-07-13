import { createFileRoute } from "@tanstack/react-router";
import DashboardPage from "@/components/pages/dashboard";

export const Route = createFileRoute("/_app/")({
  head: () => ({
    meta: [
      { title: "Cryptvora — Dashboard" },
      { name: "description", content: "Your trading cockpit — performance, tiers and risk at a glance." },
    ],
  }),
  component: DashboardPage,
});
