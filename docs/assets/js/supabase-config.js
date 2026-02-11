// Supabase Configuration
// Replace these with your actual Supabase project credentials
// Get these from: https://app.supabase.com/project/_/settings/api

const SUPABASE_URL = 'https://ulnhgthskqtrbmsjbmmy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsbmhndGhza3F0cmJtc2pibW15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NzQwMjQsImV4cCI6MjA4NjI1MDAyNH0.bTsQo6I9WIIu9Y3DwK8Est8eVCtz1Q7HgE7-laKbi_I';

// Initialize Supabase client (using var to make it globally accessible)
var supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Check if user is logged in
async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

// Listen for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT') {
        window.location.href = '/index.html';
    }
});
