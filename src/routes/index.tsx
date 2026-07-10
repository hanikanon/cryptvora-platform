import { createFileRoute } from "@tanstack/react-router";
import { Landing } from "@/components/landing/Landing";

export const Route = createFileRoute("/")({
  head: () => ({
    links: [
      {
        rel: "preload",
        as: "image",
        href: "https://images.unsplash.com/photo-1642790551116-18e150f248e3?auto=format&fit=crop&w=2000&q=80",
        fetchpriority: "high",
      },
      { rel: "preconnect", href: "https://images.unsplash.com", crossOrigin: "anonymous" },
    ],
  }),
  component: Index,
});

function Index() {
  return <Landing />;
}
