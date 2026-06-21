import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://cuncniidrdwdatedqovb.supabase.co";

const supabaseKey =
  "sb_publishable_0VOUd4Gx7yZU9zkL_wphAg_VcFWpSyF";

export const supabase = createClient(supabaseUrl, supabaseKey);