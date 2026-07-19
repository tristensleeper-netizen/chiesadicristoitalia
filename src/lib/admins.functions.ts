import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

async function assertCallerIsAdmin(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin role required");
}

export const listAdmins = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertCallerIsAdmin(context.userId);
    const { data: roles, error } = await supabaseAdmin
      .from("user_roles")
      .select("id, user_id, role, created_at")
      .eq("role", "admin")
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);

    const results: Array<{ id: string; user_id: string; email: string | null; created_at: string }> = [];
    for (const r of roles ?? []) {
      const { data: u } = await supabaseAdmin.auth.admin.getUserById(r.user_id);
      results.push({
        id: r.id,
        user_id: r.user_id,
        email: u?.user?.email ?? null,
        created_at: r.created_at,
      });
    }
    return results;
  });

export const addAdminByEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => {
    const d = data as { email?: string };
    const email = (d?.email ?? "").trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Email non valida");
    }
    return { email };
  })
  .handler(async ({ context, data }) => {
    await assertCallerIsAdmin(context.userId);

    // Find user by email by paginating listUsers
    let foundId: string | null = null;
    let page = 1;
    const perPage = 200;
    while (!foundId) {
      const { data: list, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage });
      if (error) throw new Error(error.message);
      const u = list.users.find((x) => x.email?.toLowerCase() === data.email);
      if (u) { foundId = u.id; break; }
      if (list.users.length < perPage) break;
      page += 1;
      if (page > 50) break;
    }
    if (!foundId) throw new Error("Nessun utente trovato con questa email. Chiedi alla persona di registrarsi prima.");

    const { error } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: foundId, role: "admin" });
    if (error && !error.message.includes("duplicate")) throw new Error(error.message);
    return { ok: true, user_id: foundId };
  });

export const removeAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => {
    const d = data as { user_id?: string };
    if (!d?.user_id) throw new Error("user_id richiesto");
    return { user_id: d.user_id };
  })
  .handler(async ({ context, data }) => {
    await assertCallerIsAdmin(context.userId);
    if (data.user_id === context.userId) {
      throw new Error("Non puoi rimuovere te stesso.");
    }
    const { error } = await supabaseAdmin
      .from("user_roles")
      .delete()
      .eq("user_id", data.user_id)
      .eq("role", "admin");
    if (error) throw new Error(error.message);
    return { ok: true };
  });
