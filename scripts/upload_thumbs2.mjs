import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync } from "node:fs";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const files = readdirSync("/tmp/thumbs2").filter((f) => f.endsWith(".png"));
const results = [];
for (const f of files) {
  const slug = f.replace(/\.png$/, "");
  const path = `sermon-thumbs/${slug}.png`;
  const buf = readFileSync(`/tmp/thumbs2/${f}`);
  const { error } = await supabase.storage.from("site-media").upload(path, buf, {
    contentType: "image/png",
    upsert: true,
  });
  if (error) { console.error("FAIL", slug, error.message); continue; }
  const { data } = supabase.storage.from("site-media").getPublicUrl(path);
  results.push({ slug, url: data.publicUrl });
}
console.log(JSON.stringify(results));
