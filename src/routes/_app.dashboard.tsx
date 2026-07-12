import { createFileRoute } from "@tanstack/react-router";
import DashboardPage from "@/components/pages/dashboard";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Cryptvora" },
      { name: "description", content: "Full trading dashboard: portfolio, PnL, allocations and risk." },
    ],
  }),
  component: DashboardPage,
});