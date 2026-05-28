import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';
import config from '@config';

if (!config.supabaseUrl || !config.supabaseKey) {
  throw new Error('Supabase configuration is required');
}

const supabase = createClient(config.supabaseUrl, config.supabaseKey, {
  realtime: { transport: WebSocket as any }
});

export default supabase;
