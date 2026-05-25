-- 3. Create Live Updates Table for Match Ticker
create table if not exists live_updates (
  id uuid default gen_random_uuid() primary key,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on Realtime for the live_updates table
alter publication supabase_realtime add table live_updates;

-- Allow public access (Demo Only)
alter table live_updates enable row level security;
create policy "Allow public select on live_updates" on live_updates for select using (true);
create policy "Allow public insert on live_updates" on live_updates for insert with check (true);

-- Insert a default placeholder message
insert into live_updates (message) values ('⚽ 2026 WORLD CUP PREDICTIONS LIVE • AWAITING ADMIN UPDATES...');

-- 4. Create User Predictions Sandbox Table
create table if not exists user_predictions (
  id uuid default gen_random_uuid() primary key,
  custom_winner text not null,
  weights jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Allow public access (Demo Only)
alter table user_predictions enable row level security;
create policy "Allow public select on user_predictions" on user_predictions for select using (true);
create policy "Allow public insert on user_predictions" on user_predictions for insert with check (true);

