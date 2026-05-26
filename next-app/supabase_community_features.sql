-- Create table for Live Reactions
create table if not exists live_reactions (
  id uuid default gen_random_uuid() primary key,
  emoji text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Realtime
alter publication supabase_realtime add table live_reactions;

-- Allow public access
alter table live_reactions enable row level security;
create policy "Allow public select on live_reactions" on live_reactions for select using (true);
create policy "Allow public insert on live_reactions" on live_reactions for insert with check (true);
