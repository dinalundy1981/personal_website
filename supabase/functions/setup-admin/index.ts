import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Create admin user
  const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email: "dinalundy1981@gmail.com",
    password: "Admin@@@@1234",
    email_confirm: true,
    user_metadata: { full_name: "Dr. Dina Lundy" },
  });

  if (createError && !createError.message.includes("already been registered")) {
    return new Response(JSON.stringify({ error: createError.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Get user id
  let userId = userData?.user?.id;
  if (!userId) {
    const { data: users } = await supabaseAdmin.auth.admin.listUsers();
    const adminUser = users?.users?.find((u: any) => u.email === "dinalundy1981@gmail.com");
    userId = adminUser?.id;
  }

  if (!userId) {
    return new Response(JSON.stringify({ error: "Could not find user" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Assign admin role
  const { error: roleError } = await supabaseAdmin.from("user_roles").upsert(
    { user_id: userId, role: "admin" },
    { onConflict: "user_id,role" }
  );

  return new Response(
    JSON.stringify({ success: true, userId, roleError: roleError?.message }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});
