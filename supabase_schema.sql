-- Create the leads table
create table leads (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  expiry_date date,
  address text,
  client_email text,
  quoted_price decimal(10,2)
);

-- Create the confirmed_bookings table
create table confirmed_bookings (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  lead_id uuid references leads(id) on delete cascade,
  contact_name text,
  contact_phone text,
  contact_email text
);

-- Enable Row Level Security (RLS)
alter table leads enable row level security;
alter table confirmed_bookings enable row level security;

-- Policy: Allow anyone to insert leads (for the public booking form)
create policy "Enable insert for anon on leads" 
on leads 
for insert 
with check (true);

-- Policy: Allow anyone to read leads
create policy "Enable select for anon on leads" 
on leads 
for select 
using (true);

-- Policy: Allow anyone to update leads (for batch quote updates)
create policy "Enable update for anon on leads" 
on leads 
for update 
using (true);

-- Policy: Allow anyone to insert confirmed bookings
create policy "Enable insert for anon on confirmed_bookings" 
on confirmed_bookings 
for insert 
with check (true);

-- Policy: Allow anyone to read confirmed bookings
create policy "Enable select for anon on confirmed_bookings" 
on confirmed_bookings 
for select 
using (true);
