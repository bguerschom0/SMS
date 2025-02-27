-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Users table (leveraging Supabase Auth)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create roles table
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  permissions JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_roles junction table
CREATE TABLE user_roles (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Students table
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  student_id TEXT NOT NULL UNIQUE,
  guardian_name TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  email TEXT,
  address TEXT,
  admission_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Classes table
CREATE TABLE classes (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  section TEXT,
  level TEXT NOT NULL,
  academic_year INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(name, section, academic_year)
);

-- Create Students_Classes junction table
CREATE TABLE students_classes (
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE,
  PRIMARY KEY (student_id, class_id)
);

-- Create Fee_Types table
CREATE TABLE fee_types (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
  frequency TEXT NOT NULL, -- 'once', 'monthly', 'quarterly', 'annually'
  is_mandatory BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Fees table
CREATE TABLE fees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  fee_type_id INTEGER NOT NULL REFERENCES fee_types(id) ON DELETE RESTRICT,
  due_date DATE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
  status TEXT NOT NULL DEFAULT 'unpaid', -- 'unpaid', 'partial', 'paid'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  fee_id UUID REFERENCES fees(id) ON DELETE SET NULL, -- Optional reference to a specific fee
  processed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  payment_date DATE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
  payment_method TEXT NOT NULL, -- 'cash', 'bank_transfer', 'mobile_money', 'check', 'card'
  receipt_number TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'completed', -- 'completed', 'pending', 'failed', 'cancelled'
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Expense_Types table
CREATE TABLE expense_types (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Expenses table
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  expense_type_id INTEGER NOT NULL REFERENCES expense_types(id) ON DELETE RESTRICT,
  processed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  expense_date DATE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
  description TEXT,
  receipt_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update updated_at field
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_roles_updated_at
BEFORE UPDATE ON roles
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_students_updated_at
BEFORE UPDATE ON students
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_classes_updated_at
BEFORE UPDATE ON classes
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_fee_types_updated_at
BEFORE UPDATE ON fee_types
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_fees_updated_at
BEFORE UPDATE ON fees
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_payments_updated_at
BEFORE UPDATE ON payments
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_expense_types_updated_at
BEFORE UPDATE ON expense_types
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_expenses_updated_at
BEFORE UPDATE ON expenses
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Sample data for initial setup (optional)
INSERT INTO roles (name, permissions) VALUES 
  ('admin', '{"students": {"create": true, "read": true, "update": true, "delete": true}, "payments": {"create": true, "read": true, "update": true, "delete": true}, "expenses": {"create": true, "read": true, "update": true, "delete": true}, "reports": {"read": true}, "settings": {"update": true}}'),
  ('accountant', '{"students": {"read": true}, "payments": {"create": true, "read": true, "update": true, "delete": false}, "expenses": {"create": true, "read": true, "update": true, "delete": false}, "reports": {"read": true}, "settings": {"update": false}}'),
  ('teacher', '{"students": {"read": true}, "payments": {"read": true}, "expenses": {"read": false}, "reports": {"read": false}, "settings": {"update": false}}');

INSERT INTO expense_types (name, description) VALUES
  ('Salaries', 'Staff and teacher salaries'),
  ('Utilities', 'Electricity, water, internet, etc.'),
  ('Supplies', 'School supplies and teaching materials'),
  ('Maintenance', 'Building and equipment maintenance'),
  ('Transport', 'Transport and travel expenses');

INSERT INTO fee_types (name, description, amount, frequency, is_mandatory) VALUES
  ('Tuition Fee', 'Basic school tuition fee', 500.00, 'quarterly', true),
  ('Registration Fee', 'One-time registration fee for new students', 100.00, 'once', true),
  ('Library Fee', 'Access to library resources', 50.00, 'annually', true),
  ('Computer Lab Fee', 'Access to computer lab resources', 75.00, 'annually', true),
  ('Sports Fee', 'Participation in sports activities', 60.00, 'annually', true),
  ('Art Supplies', 'Art class supplies', 40.00, 'quarterly', false),
  ('Field Trip', 'Educational field trips', 30.00, 'quarterly', false);

-- Setup Row Level Security (RLS)
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE students_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users table policies
CREATE POLICY "Users can read their own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all user profiles"
  ON users FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid()
    AND r.name = 'admin'
  ));

-- Define similar policies for other tables based on role permissions
-- This is just an example for the students table:
CREATE POLICY "Admins have full access to students"
  ON students
  USING (EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid()
    AND r.name = 'admin'
  ));

CREATE POLICY "Accountants and teachers can read students"
  ON students FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid()
    AND (r.name = 'accountant' OR r.name = 'teacher')
  ));

-- Similar policies should be created for all tables following the same pattern
-- Continue with policies for other tables based on the permissions defined in the roles
