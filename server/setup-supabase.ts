import { supabase } from './supabase-client';
import { readFileSync } from 'fs';
import { join } from 'path';

async function setupSupabaseTables() {
  console.log('🚀 Setting up Supabase tables...\n');

  const sqlContent = readFileSync(join(process.cwd(), 'supabase-schema.sql'), 'utf-8');
  
  const { data, error } = await supabase.rpc('exec_sql', { sql_query: sqlContent });

  if (error) {
    console.error('❌ Error creating tables:', error.message);
    console.log('\n📋 Please run this SQL manually in your Supabase SQL editor:');
    console.log('\n' + sqlContent);
    return false;
  }

  console.log('✅ Successfully created all tables in Supabase!');
  console.log('\nTables created:');
  console.log('  📊 analytics_sessions');
  console.log('  📄 page_views');
  console.log('  🖱️  user_events');
  console.log('  👤 user_profiles');
  console.log('  💬 chat_sessions');
  console.log('  📝 chat_messages');
  
  return true;
}

setupSupabaseTables();
