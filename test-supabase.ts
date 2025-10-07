
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zsithfxmjtyeummbchpy.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzaXRoZnhtanR5ZXVtbWJjaHB5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTg1NTA5MSwiZXhwIjoyMDc1NDMxMDkxfQ.AmYPTMNFzWbRqg2CpT1F84vwYdASvG3boqk7P1_r0q0';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testConnection() {
  console.log('🔍 Testing Supabase connection...\n');

  try {
    // Test 1: Check if we can connect
    console.log('✅ Supabase client created successfully');
    console.log('📍 URL:', supabaseUrl);

    // Test 2: Try to query the usage_logs table
    const { data, error } = await supabase
      .from('usage_logs')
      .select('*')
      .limit(5);

    if (error) {
      console.error('❌ Error querying usage_logs:', error.message);
      console.log('\n⚠️ Make sure the "usage_logs" table exists in your Supabase database!');
      console.log('\nCreate it with this SQL:');
      console.log(`
CREATE TABLE IF NOT EXISTS usage_logs (
  id SERIAL PRIMARY KEY,
  ip VARCHAR(255) NOT NULL,
  uid VARCHAR(50) NOT NULL,
  region VARCHAR(10) NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
      `);
    } else {
      console.log('✅ Successfully connected to usage_logs table');
      console.log(`📊 Found ${data?.length || 0} records`);
      if (data && data.length > 0) {
        console.log('\n📝 Sample data:', JSON.stringify(data[0], null, 2));
      }
    }

    // Test 3: Try to insert a test record
    const testIP = 'test-' + Date.now();
    const { error: insertError } = await supabase
      .from('usage_logs')
      .insert([{ 
        ip: testIP, 
        uid: '123456789', 
        region: 'ind',
        used_at: new Date().toISOString() 
      }]);

    if (insertError) {
      console.error('\n❌ Error inserting test record:', insertError.message);
    } else {
      console.log('\n✅ Successfully inserted test record');
      
      // Clean up test record
      await supabase.from('usage_logs').delete().eq('ip', testIP);
      console.log('🧹 Cleaned up test record');
    }

    console.log('\n🎉 Database is working properly!');
  } catch (err: any) {
    console.error('\n❌ Connection test failed:', err.message);
  }
}

testConnection();
