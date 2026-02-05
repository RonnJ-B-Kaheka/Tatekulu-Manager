/*
  # Barbershop Management System - Initial Schema

  ## Overview
  This migration creates the core database structure for Tatekulu Manager, a barbershop management application.
  
  ## Tables Created
  
  ### 1. profiles
  Extends auth.users with additional profile information
  - `id` (uuid, primary key, references auth.users)
  - `email` (text)
  - `full_name` (text)
  - `role` (text) - 'owner', 'manager', 'barber', 'receptionist'
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 2. customers
  Stores customer information
  - `id` (uuid, primary key)
  - `name` (text, required)
  - `phone` (text, unique, required)
  - `email` (text)
  - `notes` (text) - Special preferences or notes
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 3. barbers
  Information about staff members who provide services
  - `id` (uuid, primary key)
  - `profile_id` (uuid, references profiles) - Links to user account if they have one
  - `name` (text, required)
  - `specialty` (text) - Their area of expertise
  - `is_active` (boolean) - Whether currently working
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 4. services
  Available barbershop services
  - `id` (uuid, primary key)
  - `name` (text, required)
  - `description` (text)
  - `duration_minutes` (integer, required)
  - `price` (numeric, required)
  - `is_active` (boolean)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 5. appointments
  Booking and scheduling information
  - `id` (uuid, primary key)
  - `customer_id` (uuid, references customers)
  - `barber_id` (uuid, references barbers)
  - `service_id` (uuid, references services)
  - `appointment_date` (date, required)
  - `appointment_time` (time, required)
  - `status` (text) - 'scheduled', 'completed', 'cancelled', 'no_show'
  - `notes` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ## Security
  
  All tables have Row Level Security (RLS) enabled with the following policies:
  
  ### profiles
  - Authenticated users can read all profiles
  - Users can update their own profile
  
  ### customers
  - Authenticated users can read all customers
  - Authenticated users can create customers
  - Authenticated users can update customers
  - Only owners and managers can delete customers
  
  ### barbers
  - Authenticated users can read active barbers
  - Only owners and managers can create/update/delete barbers
  
  ### services
  - Everyone can read active services (for public booking)
  - Only authenticated users with manager/owner role can modify services
  
  ### appointments
  - Authenticated users can read all appointments
  - Authenticated users can create appointments
  - Authenticated users can update appointments
  - Only owners and managers can delete appointments
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  role text DEFAULT 'barber' CHECK (role IN ('owner', 'manager', 'barber', 'receptionist')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text UNIQUE NOT NULL,
  email text,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read customers"
  ON customers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create customers"
  ON customers FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update customers"
  ON customers FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Owners and managers can delete customers"
  ON customers FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('owner', 'manager')
    )
  );

-- Create barbers table
CREATE TABLE IF NOT EXISTS barbers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  name text NOT NULL,
  specialty text DEFAULT '',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE barbers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read active barbers"
  ON barbers FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Owners and managers can create barbers"
  ON barbers FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('owner', 'manager')
    )
  );

CREATE POLICY "Owners and managers can update barbers"
  ON barbers FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('owner', 'manager')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('owner', 'manager')
    )
  );

CREATE POLICY "Owners and managers can delete barbers"
  ON barbers FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('owner', 'manager')
    )
  );

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  duration_minutes integer NOT NULL,
  price numeric(10, 2) NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can read active services"
  ON services FOR SELECT
  USING (is_active = true);

CREATE POLICY "Owners and managers can create services"
  ON services FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('owner', 'manager')
    )
  );

CREATE POLICY "Owners and managers can update services"
  ON services FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('owner', 'manager')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('owner', 'manager')
    )
  );

CREATE POLICY "Owners and managers can delete services"
  ON services FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('owner', 'manager')
    )
  );

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  barber_id uuid REFERENCES barbers(id) ON DELETE SET NULL,
  service_id uuid REFERENCES services(id) ON DELETE SET NULL,
  appointment_date date NOT NULL,
  appointment_time time NOT NULL,
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create appointments"
  ON appointments FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update appointments"
  ON appointments FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Owners and managers can delete appointments"
  ON appointments FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('owner', 'manager')
    )
  );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_barber ON appointments(barber_id);
CREATE INDEX IF NOT EXISTS idx_appointments_customer ON appointments(customer_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_barbers_updated_at BEFORE UPDATE ON barbers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
