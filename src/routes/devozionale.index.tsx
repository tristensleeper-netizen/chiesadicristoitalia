import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/devozionale/")({
  beforeLoad: () => {
    throw redirect({ to: "/risorse" });
  },
});
