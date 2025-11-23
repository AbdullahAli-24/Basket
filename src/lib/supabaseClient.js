import { createClient } from '@supabase/supabase-js'


const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
	console.error("Supabase environment variables are missing!");
	console.error("VITE_SUPABASE_URL:", supabaseUrl ? "Set" : "Missing");
	console.error("VITE_SUPABASE_ANON_KEY:", supabaseKey ? "Set" : "Missing");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
