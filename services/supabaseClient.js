const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Cria o cliente Supabase com as variáveis do .env
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

module.exports = supabase;
