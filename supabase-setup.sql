-- ===== Run this in Supabase SQL Editor (supabase.com → your project → SQL Editor) =====

-- 1. Applications table (empanelment submissions)
CREATE TABLE home_loan_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    app_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    aadhaar TEXT NOT NULL,
    pan TEXT,
    address TEXT NOT NULL,
    company TEXT,
    ref_code TEXT,
    bank_details TEXT,
    udyam TEXT,
    gst TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'sent_back')),
    send_back_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Ops Managers table (login credentials)
CREATE TABLE home_loan_ops_managers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    staff_id TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Enable Row Level Security
ALTER TABLE home_loan_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_loan_ops_managers ENABLE ROW LEVEL SECURITY;

-- 4. Policies: allow read/insert from frontend (anon key)
CREATE POLICY "Anyone can insert applications" ON home_loan_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read applications" ON home_loan_applications FOR SELECT USING (true);
CREATE POLICY "Anyone can update applications" ON home_loan_applications FOR UPDATE USING (true);
CREATE POLICY "Anyone can read ops_managers" ON home_loan_ops_managers FOR SELECT USING (true);

-- 5. Seed data: sample ops manager
INSERT INTO home_loan_ops_managers (staff_id, password, name) VALUES
    ('NV-OPS-001', 'admin123', 'Naveen Sharma');

-- 6. Seed data: sample applications
INSERT INTO home_loan_applications (app_id, name, phone, email, aadhaar, pan, address, company, ref_code, bank_details, udyam, gst, status, created_at) VALUES
    ('NC-CON-2026-48231', 'Rajesh Kumar', '+91 98765 43210', NULL, 'XXXX XXXX 5678', 'ABCDE1234F', '123, 4th Cross, JP Nagar, Bengaluru 560078', 'Sri Lakshmi Enterprises', 'REF-0042', 'SBI - XXXXXXX1234', 'UDYAM-KA-01-0012345', '—', 'pending', '2026-02-28'),
    ('NC-CON-2026-39102', 'Priya Sharma', '+91 87654 32109', NULL, 'XXXX XXXX 9012', 'FGHIJ5678K', '45, MG Road, Mysuru 570001', 'Bharati Textiles', 'REF-0039', 'HDFC - XXXXXXX5678', '—', '29ABCDE1234F1Z5', 'pending', '2026-03-01'),
    ('NC-CON-2026-51784', 'Arun Gowda', '+91 76543 21098', NULL, 'XXXX XXXX 3456', 'KLMNO9012P', '78, Bull Temple Rd, Basavanagudi, Bengaluru 560019', 'Gowda Farm Products', 'REF-0051', 'Canara - XXXXXXX9012', 'UDYAM-KA-02-0098765', '29KLMNO9012P1Z8', 'pending', '2026-03-03');

-- 7. Function to generate app IDs
CREATE OR REPLACE FUNCTION generate_app_id()
RETURNS TEXT AS $$
BEGIN
    RETURN 'NC-CON-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(FLOOR(RANDOM() * 99999)::TEXT, 5, '0');
END;
$$ LANGUAGE plpgsql;

-- 8. Empanel Agents table (approved agents who can login)
CREATE TABLE empanel_agents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    app_id TEXT UNIQUE NOT NULL REFERENCES home_loan_applications(app_id),
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. Customers table (entered by empaneled agents)
CREATE TABLE agent_customers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id TEXT UNIQUE NOT NULL,
    agent_app_id TEXT NOT NULL REFERENCES empanel_agents(app_id),
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    aadhaar TEXT,
    pan TEXT,
    address TEXT,
    loan_amount NUMERIC,
    loan_purpose TEXT,
    employment_type TEXT,
    monthly_income NUMERIC,
    status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'processing', 'approved', 'rejected')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 10. Enable RLS on new tables
ALTER TABLE empanel_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_customers ENABLE ROW LEVEL SECURITY;

-- 11. Policies for empanel_agents
CREATE POLICY "Anyone can read empanel_agents" ON empanel_agents FOR SELECT USING (true);
CREATE POLICY "Anyone can insert empanel_agents" ON empanel_agents FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update empanel_agents" ON empanel_agents FOR UPDATE USING (true);

-- 12. Policies for agent_customers
CREATE POLICY "Anyone can read agent_customers" ON agent_customers FOR SELECT USING (true);
CREATE POLICY "Anyone can insert agent_customers" ON agent_customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update agent_customers" ON agent_customers FOR UPDATE USING (true);
