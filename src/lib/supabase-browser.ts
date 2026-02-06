import { createClient } from "@supabase/supabase-js"

console.log(
  "SUPABASE ENV URL:",
  process.env.NEXT_PUBLIC_SUPABASE_URL
)

console.log(
  "SUPABASE ENV ANON:",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(0, 20)
)

export const supabaseBrowser = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
