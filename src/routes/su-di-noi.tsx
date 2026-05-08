import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/su-di-noi")({
  server: {
    handlers: {
      GET: async () =>
        new Response(null, {
          status: 301,
          headers: { Location: "/milano/chi-siamo" },
        }),
    },
  },
  beforeLoad: () => {
    throw redirect({ to: "/milano/chi-siamo" });
  },
});
