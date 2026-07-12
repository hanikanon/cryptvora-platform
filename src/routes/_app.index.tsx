import { createFileRoute } from "@tanstack/react-router";
import FeedPage from "@/components/pages/feed";

export const Route = createFileRoute("/_app/")({
  head: () => ({
    meta: [
      { title: "Cryptvora — Home" },
      { name: "description", content: "The crypto trading social feed: charts, PnL, live signals from top traders." },
    ],
  }),
  component: FeedPage,
});
