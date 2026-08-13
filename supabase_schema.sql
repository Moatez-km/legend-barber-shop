-- Supabase PostgreSQL Schema for Legend Barber Shop
-- This schema initializes tables, sets up constraints, and seeds initial data.

-- 1. Enable UUID Extension (standard in Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Drop existing tables if they exist (clean setup)
DROP TABLE IF EXISTS reservations CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS barber_schedules CASCADE;
DROP TABLE IF EXISTS shop_schedules CASCADE;
DROP TABLE IF EXISTS barbers CASCADE;

-- 3. Create Barbers Table
CREATE TABLE barbers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 4. Create Barber Schedules Table
CREATE TABLE barber_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    barber_id UUID REFERENCES barbers(id) ON DELETE CASCADE NOT NULL,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE NOT NULL,
    CONSTRAINT chk_times CHECK (start_time < end_time)
);

-- 5. Create Shop Schedules Table
CREATE TABLE shop_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    day_of_week INTEGER NOT NULL UNIQUE CHECK (day_of_week BETWEEN 0 AND 6),
    opening_time TIME NOT NULL,
    closing_time TIME NOT NULL,
    is_open BOOLEAN DEFAULT TRUE NOT NULL,
    CONSTRAINT chk_shop_times CHECK (opening_time < closing_time)
);

-- 6. Create Services Table
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    duration_minutes INTEGER DEFAULT 20 NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 7. Create Reservations Table
CREATE TABLE reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    barber_id UUID REFERENCES barbers(id) ON DELETE RESTRICT NOT NULL,
    service_id UUID REFERENCES services(id) ON DELETE RESTRICT NOT NULL,
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    status TEXT DEFAULT 'active' NOT NULL CHECK (status IN ('active', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 8. Unique index to prevent double bookings
-- A barber must NOT be able to have two active reservations with the same reservation_date and reservation_time.
CREATE UNIQUE INDEX unique_active_barber_reservation 
ON reservations (barber_id, reservation_date, reservation_time) 
WHERE (status = 'active');

-- 9. Enable Row Level Security (RLS) on all tables
ALTER TABLE barbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE barber_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- 10. Configure RLS Policies
-- Allow anyone to read barbers, schedules, and services
CREATE POLICY "Allow public read access on barbers" ON barbers FOR SELECT USING (active = TRUE);
CREATE POLICY "Allow public read access on barber_schedules" ON barber_schedules FOR SELECT USING (is_available = TRUE);
CREATE POLICY "Allow public read access on shop_schedules" ON shop_schedules FOR SELECT USING (true);
CREATE POLICY "Allow public read access on services" ON services FOR SELECT USING (active = TRUE);

-- Allow anyone to view reservations (needed to know which slots are booked)
CREATE POLICY "Allow public read access on reservations" ON reservations FOR SELECT USING (true);

-- Allow anyone to insert/book reservations
CREATE POLICY "Allow public insert access on reservations" ON reservations FOR INSERT WITH CHECK (true);


-- 11. Seed Initial Data
-- Insert Barbers with fixed UUIDs to make scheduling linkable
INSERT INTO barbers (id, name, active) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Stefan', TRUE),
('550e8400-e29b-41d4-a716-446655440002', 'Ahmed', TRUE),
('550e8400-e29b-41d4-a716-446655440003', 'Marco', TRUE);

-- Insert Services with fixed UUIDs
INSERT INTO services (id, name, duration_minutes, price, active) VALUES
('550e8400-e29b-41d4-a716-446655440011', 'Haarschnitt', 20, 30.00, TRUE),
('550e8400-e29b-41d4-a716-446655440012', 'Bartpflege', 20, 20.00, TRUE),
('550e8400-e29b-41d4-a716-446655440013', 'Klassische Nassrasur', 20, 30.00, TRUE),
('550e8400-e29b-41d4-a716-446655440014', 'Kinderhaarschnitt', 20, 25.00, TRUE),
('550e8400-e29b-41d4-a716-446655440015', 'Haar-Design', 20, 15.00, TRUE),
('550e8400-e29b-41d4-a716-446655440016', 'Haarwäsche', 20, 10.00, TRUE);

-- Insert Shop Schedules (Monday=1, Tuesday=2, ..., Saturday=6, Sunday=0)
-- Open Mon-Sat 09:00 to 20:00. Closed Sunday.
INSERT INTO shop_schedules (day_of_week, opening_time, closing_time, is_open) VALUES
(1, '09:00:00', '20:00:00', TRUE),
(2, '09:00:00', '20:00:00', TRUE),
(3, '09:00:00', '20:00:00', TRUE),
(4, '09:00:00', '20:00:00', TRUE),
(5, '09:00:00', '20:00:00', TRUE),
(6, '09:00:00', '20:00:00', TRUE),
(0, '00:00:00', '00:00:00', FALSE);

-- Insert Barber Schedules (Monday to Saturday, same time 09:00-20:00 for everyone, break 13:00-14:00)
-- Stefan
INSERT INTO barber_schedules (barber_id, day_of_week, start_time, end_time, is_available) VALUES
('550e8400-e29b-41d4-a716-446655440001', 1, '09:00:00', '13:00:00', TRUE),
('550e8400-e29b-41d4-a716-446655440001', 1, '14:00:00', '20:00:00', TRUE),
('550e8400-e29b-41d4-a716-446655440001', 2, '09:00:00', '13:00:00', TRUE),
('550e8400-e29b-41d4-a716-446655440001', 2, '14:00:00', '20:00:00', TRUE),
('550e8400-e29b-41d4-a716-446655440001', 3, '09:00:00', '13:00:00', TRUE),
('550e8400-e29b-41d4-a716-446655440001', 3, '14:00:00', '20:00:00', TRUE),
('550e8400-e29b-41d4-a716-446655440001', 4, '09:00:00', '13:00:00', TRUE),
('550e8400-e29b-41d4-a716-446655440001', 4, '14:00:00', '20:00:00', TRUE),
('550e8400-e29b-41d4-a716-446655440001', 5, '09:00:00', '13:00:00', TRUE),
('550e8400-e29b-41d4-a716-446655440001', 5, '14:00:00', '20:00:00', TRUE),
('550e8400-e29b-41d4-a716-446655440001', 6, '09:00:00', '13:00:00', TRUE),
('550e8400-e29b-41d4-a716-446655440001', 6, '14:00:00', '20:00:00', TRUE);

-- Ahmed
INSERT INTO barber_schedules (barber_id, day_of_week, start_time, end_time, is_available) VALUES
('550e8400-e29b-41d4-a716-446655440002', 1, '09:00:00', '13:00:00', TRUE),
('550e8400-e29b-41d4-a716-446655440002', 1, '14:00:00', '20:00:00', TRUE),
('550e8400-e29b-41d4-a716-446655440002', 2, '09:00:00', '13:00:00', TRUE),
('550e8400-e29b-41d4-a716-446655440002', 2, '14:00:00', '20:00:00', TRUE),
('550e8400-e29b-41d4-a716-446655440002', 3, '09:00:00', '13:00:00', TRUE),
('550e8400-e29b-41d4-a716-446655440002', 3, '14:00:00', '20:00:00', TRUE),
('550e8400-e29b-41d4-a716-446655440002', 4, '09:00:00', '13:00:00', TRUE),
('550e8400-e29b-41d4-a716-446655440002', 4, '14:00:00', '20:00:00', TRUE),
('550e8400-e29b-41d4-a716-446655440002', 5, '09:00:00', '13:00:00', TRUE),
('550e8400-e29b-41d4-a716-446655440002', 5, '14:00:00', '20:00:00', TRUE),
('550e8400-e29b-41d4-a716-446655440002', 6, '09:00:00', '13:00:00', TRUE),
('550e8400-e29b-41d4-a716-446655440002', 6, '14:00:00', '20:00:00', TRUE);

-- Marco
INSERT INTO barber_schedules (barber_id, day_of_week, start_time, end_time, is_available) VALUES
('550e8400-e29b-41d4-a716-446655440003', 1, '09:00:00', '13:00:00', TRUE),
('550e8400-e29b-41d4-a716-446655440003', 1, '14:00:00', '20:00:00', TRUE),
('550e8400-e29b-41d4-a716-446655440003', 2, '09:00:00', '13:00:00', TRUE),
('550e8400-e29b-41d4-a716-446655440003', 2, '14:00:00', '20:00:00', TRUE),
('550e8400-e29b-41d4-a716-446655440003', 3, '09:00:00', '13:00:00', TRUE),
('550e8400-e29b-41d4-a716-446655440003', 3, '14:00:00', '20:00:00', TRUE),
('550e8400-e29b-41d4-a716-446655440003', 4, '09:00:00', '13:00:00', TRUE),
('550e8400-e29b-41d4-a716-446655440003', 4, '14:00:00', '20:00:00', TRUE),
('550e8400-e29b-41d4-a716-446655440003', 5, '09:00:00', '13:00:00', TRUE),
('550e8400-e29b-41d4-a716-446655440003', 5, '14:00:00', '20:00:00', TRUE),
('550e8400-e29b-41d4-a716-446655440003', 6, '09:00:00', '13:00:00', TRUE),
('550e8400-e29b-41d4-a716-446655440003', 6, '14:00:00', '20:00:00', TRUE);
