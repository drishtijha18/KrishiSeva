KrishiSeva – Agricultural Marketplace Authentication System

KrishiSeva is a modern, role-based authentication system designed for an agricultural marketplace that connects Buyers and Sellers on a single platform.
It provides secure user authentication, authorization, and role-based access using a clean and scalable full-stack architecture.

Project Overview

KrishiSeva focuses on building a production-ready authentication foundation for an agri-tech marketplace.
The system ensures secure login, protected routes, and personalized dashboards for different user roles.

This project is designed with clarity, scalability, and beginner-friendly code structure in mind.

Key Features
Authentication & Security

JWT-based authentication

Secure password hashing using bcrypt

Token expiration handling

Protected backend routes with middleware

Role-Based Access Control

Two roles: Buyer and Seller

Separate dashboards for each role

Role-based routing and authorization

User Interface

Clean agricultural theme with green & earth tones

Glassmorphism-inspired UI

Fully responsive layout

Smooth transitions and animations

Plain CSS (no UI frameworks)

Architecture

Clear separation of frontend and backend

Modular and scalable folder structure

Well-commented, readable code

RESTful API design

🛠️ Tech Stack
Backend

Node.js

Express.js

MongoDB

Mongoose

JWT (JSON Web Tokens)

bcrypt

Frontend

React

Vite

React Router

Axios

Plain CSS

Project Structure
KrishiSeva/
├── backend/
│   ├── config/
│   ├── models/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Auth/
    │   │   └── Dashboard/
    │   ├── styles/
    │   ├── utils/
    │   ├── App.jsx
    │   └── main.jsx

User Roles
Buyer

Access buyer-specific dashboard

Browse product listings (UI-ready)

View seller information

Prepare for cart and order features

Seller

Access seller-specific dashboard

Manage products (UI-ready)

View sales statistics (placeholder)

Prepare for order management

API Overview
Authentication Endpoints

POST /api/auth/signup – Register new users

POST /api/auth/login – Authenticate users

GET /api/auth/dashboard – Protected user data route

All protected routes require a valid JWT token.

Design System

Color Palette

Primary Green – #2d5016

Secondary Green – #4a7c2c

Accent Green – #6b9b47

Earth Brown – #8b6f47

Cream Background – #faf8f3

Typography

Font: Poppins

Clean, readable, modern appearance

Purpose & Use Case

This project serves as:

A starter authentication system for agri-marketplace platforms

A learning project for full-stack authentication

A scalable base for adding products, orders, payments, and admin features

Future Enhancements

Email verification

Forgot/reset password

Product CRUD operations

Cart & order management

Payment gateway integration

Reviews & ratings

Real-time buyer–seller chat

Admin dashboard

License

This project is open-source and intended for learning and educational purposes.
