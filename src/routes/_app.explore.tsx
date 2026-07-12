import { createFileRoute } from "@tanstack/react-router";
import ExplorePage from "@/components/pages/explore";

export const Route = createFileRoute("/_app/explore")({
  head: () => ({
    meta: [
      { title: "Explore — Cryptvora" },
      { name: "description", content: "Discover trending assets, markets and top traders." },
    ],
  }),
  component: ExplorePage,
});