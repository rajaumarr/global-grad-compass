import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create admin client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action } = await req.json();
    console.log(`Processing ${action} for user management`);

    switch (action) {
      case 'get_users':
        return await getUsers(supabaseAdmin);
      case 'delete_user':
        const { userId } = await req.json();
        return await deleteUser(supabaseAdmin, userId);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error('Error in user-management:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function getUsers(supabaseAdmin: any) {
  try {
    // Get users from auth.users using admin client
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (authError) throw authError;

    // Get user profiles
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select('*');

    if (profilesError) throw profilesError;

    // Combine auth users with their profiles
    const users = authUsers.users.map((authUser: any) => {
      const profile = profiles?.find((p: any) => p.user_id === authUser.id);
      
      return {
        id: authUser.id,
        email: authUser.email,
        created_at: authUser.created_at,
        email_confirmed_at: authUser.email_confirmed_at,
        last_sign_in_at: authUser.last_sign_in_at,
        profile: profile ? {
          display_name: profile.display_name,
          academic_background: profile.academic_background,
          gpa: profile.gpa,
          created_at: profile.created_at
        } : null
      };
    });

    return new Response(
      JSON.stringify({
        success: true,
        users: users
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

async function deleteUser(supabaseAdmin: any, userId: string) {
  try {
    // Delete user from auth (this will cascade delete profile due to foreign key)
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    
    if (deleteError) throw deleteError;

    return new Response(
      JSON.stringify({
        success: true,
        message: 'User deleted successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}