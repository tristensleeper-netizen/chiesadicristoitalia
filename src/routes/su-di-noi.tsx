import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/su-di-noi")({
  server: {
    handlers: {
      GET: async () =>
        new Response(null, {
          status: 301,
          headers: { Location: "/chi-siamo" },
        }),
    },
  },
  beforeLoad: () => {
    throw redirect({ to: "/chi-siamo" });
  },
});
