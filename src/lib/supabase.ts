import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          role: 'owner' | 'manager' | 'barber' | 'receptionist';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          role?: 'owner' | 'manager' | 'barber' | 'receptionist';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          role?: 'owner' | 'manager' | 'barber' | 'receptionist';
          created_at?: string;
          updated_at?: string;
        };
      };
      customers: {
        Row: {
          id: string;
          name: string;
          phone: string;
          email: string | null;
          notes: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          phone: string;
          email?: string | null;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          phone?: string;
          email?: string | null;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      barbers: {
        Row: {
          id: string;
          profile_id: string | null;
          name: string;
          specialty: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id?: string | null;
          name: string;
          specialty?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string | null;
          name?: string;
          specialty?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      services: {
        Row: {
          id: string;
          name: string;
          description: string;
          duration_minutes: number;
          price: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string;
          duration_minutes: number;
          price: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          duration_minutes?: number;
          price?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      appointments: {
        Row: {
          id: string;
          customer_id: string;
          barber_id: string | null;
          service_id: string | null;
          appointment_date: string;
          appointment_time: string;
          status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
          notes: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          barber_id?: string | null;
          service_id?: string | null;
          appointment_date: string;
          appointment_time: string;
          status?: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          barber_id?: string | null;
          service_id?: string | null;
          appointment_date?: string;
          appointment_time?: string;
          status?: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
