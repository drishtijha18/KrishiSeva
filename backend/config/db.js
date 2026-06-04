// Supabase Database Connection Configuration
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Validate that Supabase credentials are configured
if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing SUPABASE_URL or SUPABASE_ANON_KEY in environment variables');
    process.exit(1);
}

// Create and export the Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Health check function to verify connection
const checkConnection = async () => {
    try {
        const { data, error } = await supabase.from('users').select('id').limit(1);
        if (error) throw error;
        console.log(' ✅ Supabase Connected Successfully');
        console.log(` 🔗 Project: ${supabaseUrl}`);
    } catch (error) {
        console.error(` ❌ Supabase Connection Error: ${error.message}`);
        console.error(' Make sure you have run the SQL setup script in the Supabase dashboard');
    }
};

module.exports = { supabase, checkConnection };
