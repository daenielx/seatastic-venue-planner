// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://rifflfcmalylbyyldtfo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpZmZsZmNtYWx5bGJ5eWxkdGZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3MTE5OTgsImV4cCI6MjA1NzI4Nzk5OH0.UfxYjdjZmEBRaDQTZzHFEmzmR1YggmINqHypJejr8ew";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);