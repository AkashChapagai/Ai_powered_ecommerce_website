# AI-Enhanced Full-Stack E-Commerce Web Platform

A full-stack MERN e-commerce web application developed as a final-year university project. The system provides a customer-facing shopping experience, admin product/order management, inventory monitoring, and an AI-style chatbot designed to help users search for products and receive shopping assistance.

---

## Project Overview

This project is an AI-enhanced e-commerce platform built using React, Node.js, Express, and MongoDB. The main aim of the system is to create a modern online shopping platform where users can browse products, view product details, manage a cart, place orders, and receive chatbot-based product assistance.

The application also includes an admin dashboard where authorised admin users can manage products, view orders, monitor stock levels, and access basic business analytics.

---

## Key Features

### Customer Features

- User registration and login
- JWT-based authentication
- Product browsing
- Product details page
- Shopping cart functionality
- Quantity and stock validation
- Checkout process
- User order history
- Responsive frontend interface
- AI-style chatbot for product assistance

### Admin Features

- Admin-protected dashboard
- Add new products
- Edit existing products
- Delete products
- Manage customer orders
- Update delivery status
- View total products, users, orders, and revenue
- Monitor low-stock and out-of-stock products
- Inventory value calculation

### AI / Chatbot Features

- Product search assistance
- Intent-based response handling
- Keyword and synonym matching
- Product recommendation support
- Category and brand-aware responses
- Personalised support based on user activity where available

---

## Technologies Used

### Frontend

- React
- Vite
- React Router
- Axios
- CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token
- bcryptjs
- CORS
- dotenv

### Development Tools

- Git
- GitHub
- VS Code
- npm
- Nodemon

---

## Project Structure

```txt
Ai_powered_ecommerce_website/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   └── App.jsx
│   │
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── index.js
│   └── package.json
│
└── README.md
