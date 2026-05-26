-- Create squad_players table
CREATE TABLE IF NOT EXISTS public.squad_players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_name TEXT NOT NULL,
    player_name TEXT NOT NULL,
    position TEXT NOT NULL,
    rating INTEGER NOT NULL,
    goals INTEGER DEFAULT 0,
    assists INTEGER DEFAULT 0,
    xg DECIMAL(4,2) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create team_votes table for fan sentiment
CREATE TABLE IF NOT EXISTS public.team_votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_name TEXT NOT NULL,
    vote_type TEXT NOT NULL CHECK (vote_type IN ('BULL', 'BEAR')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert dummy data for Spain
INSERT INTO public.squad_players (team_name, player_name, position, rating, goals, assists, xg) VALUES
('Spain', 'Unai Simón', 'GK', 84, 0, 0, 0),
('Spain', 'Aymeric Laporte', 'CB', 85, 1, 0, 0.4),
('Spain', 'Robin Le Normand', 'CB', 83, 0, 0, 0.2),
('Spain', 'Dani Carvajal', 'RB', 84, 1, 1, 0.6),
('Spain', 'Marc Cucurella', 'LB', 82, 0, 2, 0.3),
('Spain', 'Rodri', 'CDM', 91, 2, 1, 1.8),
('Spain', 'Fabián Ruiz', 'CM', 84, 3, 2, 2.1),
('Spain', 'Pedri', 'CM', 86, 0, 1, 0.9),
('Spain', 'Lamine Yamal', 'RW', 84, 1, 4, 1.2),
('Spain', 'Nico Williams', 'LW', 85, 2, 1, 1.5),
('Spain', 'Álvaro Morata', 'ST', 83, 1, 1, 2.4);

-- Insert dummy data for England
INSERT INTO public.squad_players (team_name, player_name, position, rating, goals, assists, xg) VALUES
('England', 'Jordan Pickford', 'GK', 84, 0, 0, 0),
('England', 'John Stones', 'CB', 86, 0, 0, 0.1),
('England', 'Marc Guéhi', 'CB', 82, 0, 0, 0.2),
('England', 'Kyle Walker', 'RB', 85, 0, 0, 0.1),
('England', 'Luke Shaw', 'LB', 83, 0, 0, 0.1),
('England', 'Declan Rice', 'CDM', 87, 0, 1, 0.3),
('England', 'Jude Bellingham', 'CAM', 90, 2, 0, 1.8),
('England', 'Bukayo Saka', 'RW', 88, 1, 1, 1.5),
('England', 'Phil Foden', 'LW', 87, 0, 0, 0.6),
('England', 'Harry Kane', 'ST', 90, 3, 0, 2.7),
('England', 'Cole Palmer', 'CAM', 84, 1, 1, 0.9);

-- Insert some dummy votes
INSERT INTO public.team_votes (team_name, vote_type) VALUES
('Spain', 'BULL'), ('Spain', 'BULL'), ('Spain', 'BULL'), ('Spain', 'BEAR'),
('England', 'BULL'), ('England', 'BEAR'), ('England', 'BEAR'), ('England', 'BEAR');
