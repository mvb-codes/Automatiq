import { createFileRoute, redirect } from "@tanstack/react-router";

function RouteComponent() {
  return <div>Hello "/tickets"!</div>;
}

export const Route = createFileRoute("/tickets")({
  beforeLoad: ({ context }) => {
    if (!context.auth.isLoggedIn) {
      throw redirect({ to: "/login" });
    }
  },
  component: RouteComponent,
});
