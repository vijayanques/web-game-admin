-- Sample Game Data for Dynamic Game Detail Page
-- Run this after creating your games and categories tables

-- Insert sample categories
INSERT INTO categories (name, slug, description) VALUES
('FPS', 'fps', 'First Person Shooter games'),
('Action', 'action', 'Action-packed games'),
('Strategy', 'strategy', 'Strategic gameplay'),
('RPG', 'rpg', 'Role Playing Games'),
('Sports', 'sports', 'Sports and racing games'),
('Puzzle', 'puzzle', 'Brain-teasing puzzle games'),
('Adventure', 'adventure', 'Adventure and exploration games'),
('Sandbox', 'sandbox', 'Open-world sandbox games');

-- Insert sample games
INSERT INTO games (title, slug, description, thumbnail, game_url, iframe_url, rating, category_id, is_active) VALUES
(
  'Valorant Champions',
  'valorant-champions',
  'Valorant is a tactical 5v5 character-based shooter where precise gunplay meets unique agent abilities. Choose from a diverse cast of agents, each with their own set of abilities, and compete in intense matches that require strategy, teamwork, and skill.',
  '/Images/valorant.jpg',
  'https://playvalorant.com',
  NULL,
  4.8,
  1,
  1
),
(
  'CS2',
  'cs2',
  'Counter-Strike 2 is the legendary tactical FPS that has defined competitive gaming for decades. Experience intense 5v5 matches with precise gunplay, strategic gameplay, and a thriving esports scene.',
  '/Images/cs2.jpg',
  'https://counter-strike.net',
  NULL,
  4.7,
  1,
  1
),
(
  'Apex Legends',
  'apex-legends',
  'Apex Legends is a free-to-play battle royale game where legendary competitors battle for glory, fame, and fortune. Choose from a roster of unique Legends, each with their own abilities, and fight to be the last squad standing.',
  '/Images/apex.jpg',
  'https://ea.com/apex',
  NULL,
  4.6,
  1,
  1
),
(
  'Minecraft',
  'minecraft',
  'Minecraft is a sandbox game that allows players to build, explore, and survive in a blocky, procedurally-generated 3D world. With endless possibilities for creativity and adventure, Minecraft has become one of the most popular games of all time.',
  '/Images/minecraft.jpg',
  'https://minecraft.net',
  NULL,
  4.9,
  8,
  1
),
(
  'Fortnite',
  'fortnite',
  'Fortnite is a free-to-play battle royale game where 100 players fight to be the last one standing. Build structures, find weapons, and outlast your opponents in this fast-paced, action-packed game.',
  '/Images/fortnite.jpg',
  'https://fortnite.com',
  NULL,
  4.5,
  2,
  1
),
(
  'League of Legends',
  'league-of-legends',
  'League of Legends is a team-based strategy game where two teams of five powerful champions face off to destroy the other\'s base. Choose from over 150 champions to make epic plays, secure kills, and take down towers.',
  '/Images/lol.jpg',
  'https://leagueoflegends.com',
  NULL,
  4.7,
  3,
  1
),
(
  'Rocket League',
  'rocket-league',
  'Rocket League is a high-powered hybrid of arcade-style soccer and vehicular mayhem. Customize your car, hit the field, and compete in one of the most critically acclaimed sports games of all time.',
  '/Images/rocket-league.jpg',
  'https://rocketleague.com',
  NULL,
  4.6,
  5,
  1
),
(
  'Among Us',
  'among-us',
  'Among Us is a multiplayer game of teamwork and betrayal. Play with 4-15 players online as you attempt to hold your spaceship together and return back to civilization. But beware...one or more random players are Impostors bent on killing everyone!',
  '/Images/among-us.jpg',
  'https://innersloth.com/games/among-us',
  NULL,
  4.4,
  2,
  1
),
(
  'Bloxd.io',
  'bloxd-io',
  'Bloxd.io is an IO adventure game with Minecraft-style visuals where you can navigate obstacle courses, gather resources, craft tools, battle other players, and much more. With game modes ranging from parkour challenges and creative sandbox building to combat-based gameplay, there\'s something for every playstyle.',
  '/Images/bloxd.jpg',
  'https://bloxd.io',
  'https://bloxd.io/play',
  4.3,
  8,
  1
),
(
  'Subway Surfers',
  'subway-surfers',
  'Subway Surfers is an endless runner mobile game. Players take the role of young graffiti artists who, upon being caught in the act of tagging a metro railway site, run through the railroad tracks to escape from the inspector and his dog.',
  '/Images/subway-surfers.jpg',
  'https://subwaysurfers.com',
  NULL,
  4.5,
  2,
  1
);

-- Insert sample user activity (for testing recommendations)
INSERT INTO user_activity (user_id, game_id, category_id) VALUES
(1, 1, 1),  -- User 1 played Valorant (FPS)
(1, 2, 1),  -- User 1 played CS2 (FPS)
(1, 3, 1),  -- User 1 played Apex (FPS)
(1, 1, 1),  -- User 1 played Valorant again
(2, 4, 8),  -- User 2 played Minecraft (Sandbox)
(2, 9, 8),  -- User 2 played Bloxd.io (Sandbox)
(2, 4, 8),  -- User 2 played Minecraft again
(3, 5, 2),  -- User 3 played Fortnite (Action)
(3, 8, 2),  -- User 3 played Among Us (Action)
(3, 10, 2); -- User 3 played Subway Surfers (Action)

-- Verify data
SELECT 'Categories:' as Info;
SELECT * FROM categories;

SELECT 'Games:' as Info;
SELECT g.id, g.title, g.slug, c.name as category, g.rating 
FROM games g 
LEFT JOIN categories c ON g.category_id = c.id;

SELECT 'User Activity:' as Info;
SELECT ua.user_id, g.title as game, c.name as category, ua.played_at
FROM user_activity ua
INNER JOIN games g ON ua.game_id = g.id
INNER JOIN categories c ON ua.category_id = c.id
ORDER BY ua.user_id, ua.played_at DESC;
