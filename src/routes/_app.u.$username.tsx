import { createFileRoute } from "@tanstack/react-router";
import UserProfilePage from "@/components/pages/user-profile";

export const Route = createFileRoute("/_app/u/$username")({
  head: ({ params }) => ({
    meta: [
      { title: `@${params.username} — Cryptvora` },
      { name: "description", content: `${params.username}'s trading profile on Cryptvora.` },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { username } = Route.useParams();
  return <UserProfilePage username={username} />;
}
