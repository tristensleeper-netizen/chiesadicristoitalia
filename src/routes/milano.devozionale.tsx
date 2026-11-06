import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/milano/devozionale")({
  beforeLoad: () => {
    throw redirect({ to: "/devozionale/isaia", statusCode: 301 });
  },
});
