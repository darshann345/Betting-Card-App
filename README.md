# Betting Card App (MERN Stack)

## Project Overview
The **Betting Card App** is a full-stack web application built using the MERN stack (**MongoDB, Express, React, Node.js**).

It is a card-matching betting game where users can deposit money, place bets, and win rewards based on their performance.

---

## Live Links
- Frontend (Vercel): https://betting-card-app.vercel.app/admin  
- GitHub Repository: https://github.com/darshann345/Betting-Card-App  

---

## Features

### User Features
- User Registration & Login  
- User Dashboard displaying:
  - Username  
  - Wallet Balance  
  - Lifetime Deposits  
  - Total Winnings  
  - Win Percentage (%)  
  - Net Profit  
- Deposit Money Options:
  - ₹100, ₹500, ₹1000, ₹2000  
- Start game by placing a betting amount  

---

### Game Logic
- Player matches **R1 Cards with R2 Cards**
- If cards match → they stay open  
- If not → they flip back  

#### Rules:
- Player gets **5 chances**
- Rewards:
  - Match 5 cards → **5× betting amount**
  - Match 3–4 cards → **3× betting amount**
  - Match 2 cards → **1.5× betting amount**
  - No matches → **Bet amount deducted**

- Lost amount is transferred to **Admin Wallet**

---

### Admin Features

#### Default Admin Credentials
```
Username: admin
Password: admin123
```

#### Admin Dashboard
- Admin Name  
- Admin Wallet Balance  
- Total Profit  
- Track total player balances  
- Total number of users  

#### Manage Players
- View all users  
- Edit player wallet balance  

---

## Tech Stack

### Frontend:
- React.js  
- CSS / Bootstrap  

### Backend:
- Node.js  
- Express.js  

### Database:
- MongoDB (MongoDB Atlas)

---

## Installation & Setup

### Clone Repository
```bash
git clone https://github.com/darshann345/Betting-Card-App.git
cd Betting-Card-App
```

---

### Install Dependencies

#### Backend Setup
```bash
cd backend
npm install
npm install cors
```

####  Frontend Setup
```bash
cd frontend
npm install
```

---

###  Environment Variables

####  Frontend (.env)
```env
VITE_API_URL=https://betting-card-app.onrender.com/api
```

####  Backend (.env)
```env
PORT=5000
MONGO_URI=mongodb+srv://darshan_core_db:Racer123@cluster0.ek1j1vi.mongodb.net/bettingCardGame?retryWrites=true&w=majority
JWT_SECRET=9fK2@Lx7!QpW4#zT8^mN6$RrY3&vP1*Hs5!bD9@Xc2Lm8
```

Use **MongoDB Atlas** for database connection.

---

### Run Application

#### Start Backend
```bash
npm start
```

#### Start Frontend
```bash
npm run dev
```

---

## Game Flow
1. User registers or logs in  
2. Deposits money into wallet  
3. Places a betting amount  
4. Plays card matching game  
5. Wins or loses based on matches  
6. Wallet updates automatically  

---

##  Screenshots
_Add screenshots here (optional)_  

---

##  Disclaimer
This project is for **educational purposes only**. It does not promote or support real-money gambling.

---

##  Contributing
Contributions are welcome! Feel free to fork this repo and submit a pull request.

---

##  Contact
For queries or support, contact via GitHub.

---
