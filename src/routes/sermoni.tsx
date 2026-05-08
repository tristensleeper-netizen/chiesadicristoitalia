import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/sermoni")({
  server: {
    handlers: {
      GET: async () =>
        new Response(null, {
          status: 301,
          headers: { Location: "/risorse" },
        }),
    },
  },
  beforeLoad: () => {
    throw redirect({ to: "/risorse" });
  },
});
