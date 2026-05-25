-- 1. Create Messages Table for Live Chat
create table if not exists messages (
  id uuid default gen_random_uuid() primary key,
  content text not null,
  author text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on Realtime for the messages table
alter publication supabase_realtime add table messages;

-- Allow public access (Demo Only)
alter table messages enable row level security;
create policy "Allow public select on messages" on messages for select using (true);
create policy "Allow public insert on messages" on messages for insert with check (true);

-- 2. Create Votes Table for Community Voting
create table if not exists votes (
  id uuid default gen_random_uuid() primary key,
  team_name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on Realtime for the votes table
alter publication supabase_realtime add table votes;

-- Allow public access (Demo Only)
alter table votes enable row level security;
create policy "Allow public select on votes" on votes for select using (true);
create policy "Allow public insert on votes" on votes for insert with check (true);
