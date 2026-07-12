import { createFileRoute } from "@tanstack/react-router";
import CreatePostPage from "@/components/pages/create";

export const Route = createFileRoute("/_app/create")({
  head: () => ({
    meta: [
      { title: "New Post — Cryptvora" },
      { name: "description", content: "Share a chart, analysis or PnL screenshot with the Cryptvora community." },
    ],
  }),
  component: CreatePostPage,
});