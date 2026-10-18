# KrishiSeva – Agricultural Marketplace Platform

KrishiSeva is a modern, role-based platform designed for an agricultural marketplace that connects Buyers and Sellers on a single unified platform.
It provides secure user authentication, role-based access, live mandi prices, product discovery, shopping cart, and order tracking.

---

## 🛠️ Tech Stack

### Backend
- **Node.js & Express.js**: RESTful API server
- **Supabase (PostgreSQL)**: Cloud database with Row-Level Security
- **JWT (JSON Web Tokens)**: Stateless authentication
- **bcryptjs**: Secure password hashing
- **Data.gov.in API**: Real-time mandi crop prices

### Frontend
- **React 18 & Vite**: Fast and modern frontend architecture
- **React Router 6**: Client-side routing with protected routes
- **Axios**: HTTP client with auth interceptors
- **Lucide React**: Modern UI icons
- **Vanilla CSS**: Clean, responsive styling with glassmorphism design

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or newer recommended)
- npm or yarn
- A Supabase project account (free tier works great)

### 1. Clone the Repository
```bash
git clone https://github.com/drishtijha18/KrishiSeva.git
cd KrishiSeva
```

### 2. Configure Environment Variables

**Backend (`backend/.env`):**
```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_public_key
JWT_SECRET=your_jwt_secret_key_here
PORT=5001
FRONTEND_URL=http://localhost:5173
DATA_GOV_API_KEY=your_data_gov_in_api_key
```

**Frontend (`frontend/.env`):**
```env
VITE_API_URL=http://localhost:5001
```

### 3. Database Setup (Supabase)
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Open the **SQL Editor**.
3. Copy and run the script from `backend/supabase_schema.sql` to initialize the `users` and `orders` tables.

### 4. Install Dependencies & Run

From the root directory:
```bash
# Install backend and frontend dependencies
npm run install-backend
npm run install-frontend

# Run both servers concurrently
npm run dev
```

Or run them individually in separate terminals:

```bash
# Run Backend (Port 5001)
npm run server

# Run Frontend (Port 5173)
npm run client
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## ☁️ Deployment on Vercel

1. Push your code to GitHub.
2. In the [Vercel Dashboard](https://vercel.com/dashboard), import your `KrishiSeva` repository.
3. Configure the following **Environment Variables** in Vercel:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `JWT_SECRET`
   - `DATA_GOV_API_KEY`
4. Deploy! The monorepo `vercel.json` automatically builds the static frontend and configures backend serverless functions at `/api/*`.

---

## 👥 User Roles & Features

### Buyer
- Access buyer-specific dashboard
- Browse agricultural product listings
- View live mandi prices
- Manage cart, favorites, and place orders
- Track personal order history

### Seller
- Access seller-specific dashboard
- Add and manage product inventory
- View incoming orders and fulfill status updates
- Track sales statistics

---

## 📄 License
This project is open-source and intended for learning and educational purposes.
