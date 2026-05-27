import { createClient } from '@supabase/supabase-js';
import config from '@config';

if (!config.supabaseUrl || !config.supabaseKey) {
  throw new Error('Supabase configuration is required');
}

const supabase = createClient(config.supabaseUrl, config.supabaseKey);

export default supabase;
