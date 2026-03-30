GARFIELD COIN - Game Website
=============================

A viral meme coin website with an endless runner game, Solana wallet integration, 
daily leaderboards, and merch rewards for top 50 players.

TECH STACK
----------
- Frontend: Next.js 16 + TypeScript + Tailwind CSS
- Game: Phaser 3
- Wallet: Solana (Phantom)
- Database: MongoDB
- Hosting: Vercel (frontend) + Railway/Render (if needed)

FEATURES
--------
✓ Landing page with countdown, stats, and social links
✓ Endless runner game (Garfield collects dollars, avoids obstacles)
✓ Solana Phantom wallet integration
✓ Real-time leaderboard (daily reset)
✓ Top 50 reward claim system
✓ Anti-cheat validation (score limits, rate limiting, server validation)

SETUP INSTRUCTIONS
------------------

1. Install Dependencies:
   npm install

2. Set Up MongoDB:
   Option A - Local MongoDB:
   - Install MongoDB locally
   - Create .env.local file:
     MONGODB_URI=mongodb://localhost:27017/garfield_game

   Option B - MongoDB Atlas (Recommended):
   - Create free account at mongodb.com/cloud/atlas
   - Create cluster and database
   - Get connection string
   - Create .env.local file:
     MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/garfield_game

3. Run Development Server:
   npm run dev

4. Open Browser:
   http://localhost:3000

GAME MECHANICS
--------------
- Garfield runs automatically (endless runner)
- Press SPACE or TAP to jump
- Collect green circles (💵 dollars) = +1 point
- Avoid red obstacles
- Game speed increases every 10 points
- Collision = game over

ANTI-CHEAT SYSTEM
-----------------
✓ Max 3 points per second
✓ Minimum 5 seconds game duration
✓ Max 10,000 points absolute limit
✓ Duplicate submission detection (5 second window)
✓ Timestamp validation (60 second window)
✓ Server-side score validation

LEADERBOARD
-----------
- Resets daily at midnight
- Shows top 100 players
- Highlights top 50 (eligible for merch)
- Shows user's current rank
- Updates every 15 seconds

REWARD SYSTEM
-------------
- Top 50 players daily can claim merch
- Claim button appears after game over if in top 50
- Form collects: name, shipping address, phone
- One claim per wallet per day
- Data stored in MongoDB for fulfillment

API ENDPOINTS
-------------
POST /api/submit-score
  Body: { wallet_address, score, duration, timestamp }
  Returns: { success, score, rank, isTopFifty }

GET /api/leaderboard
  Returns: { leaderboard: [{ wallet_address, score, date, rank }] }

GET /api/stats
  Returns: { playersToday, topScore }

POST /api/claim-reward
  Body: { wallet_address, name, address, phone, rank }
  Returns: { success }

DEPLOYMENT
----------
Frontend (Vercel):
1. Push to GitHub
2. Import to Vercel
3. Add MONGODB_URI environment variable
4. Deploy

Database Collections:
- scores: { wallet_address, score, duration, timestamp, date, created_at }
- rewards: { wallet_address, name, address, phone, rank, date, claimed_at }

CUSTOMIZATION
-------------
- Update countdown target date in components/Countdown.tsx
- Modify game difficulty in game/GarfieldGame.ts
- Adjust anti-cheat limits in lib/antiCheat.ts
- Change colors in tailwind.config.ts

NOTES
-----
- Wallet connection required to play game
- Game runs entirely in browser (client-side)
- Score submission happens after game over
- Leaderboard updates in real-time
- Daily reset at midnight UTC
