import { createFileRoute } from "@tanstack/react-router";
import LoginPage from "@/components/pages/login";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Cryptvora" },
      { name: "description", content: "Sign in to the Cryptvora institutional crypto trading terminal." },
    ],
  }),
  component: LoginPage,
});
