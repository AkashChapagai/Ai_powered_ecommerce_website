# AI-Enhanced Full-Stack E-Commerce Web Platform

A full-stack MERN e-commerce web application with AI-style chatbot assistance, product management, order management, shopping cart functionality, authentication, role-based admin access, and inventory analytics.

This project was developed as a final-year Computer Science project to demonstrate full-stack development, database design, authentication, e-commerce workflows, admin functionality, and AI-enhanced user support.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Aim of the Project](#aim-of-the-project)
- [Key Features](#key-features)
- [AI Chatbot Feature](#ai-chatbot-feature)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation and Setup](#installation-and-setup)
- [Environment Variables](#environment-variables)
- [API Routes](#api-routes)
- [Database Models](#database-models)
- [Main User Workflows](#main-user-workflows)
- [Testing Strategy](#testing-strategy)
- [Security Considerations](#security-considerations)
- [Current Limitations](#current-limitations)
- [Future Improvements](#future-improvements)
- [Academic Context](#academic-context)
- [Author](#author)

---

## Project Overview

The **AI-Enhanced Full-Stack E-Commerce Web Platform** is a MERN-based online shopping system designed to provide a smooth and intelligent shopping experience for customers while also giving administrators the tools required to manage products, orders, stock levels, and basic business analytics.

The system includes a customer-facing interface where users can browse products, view product details, add items to a cart, place orders, and interact with an AI-style chatbot for product assistance. It also includes an admin interface where authorised users can create, update, and delete products, monitor orders, and view important platform statistics.

The project focuses on combining traditional e-commerce functionality with intelligent product assistance to improve user experience and demonstrate the use of AI-inspired logic in a practical full-stack application.

---

## Aim of the Project

The main aim of this project is to design and develop a full-stack e-commerce web platform that supports online shopping functionality and enhances the user experience through chatbot-based product assistance.

The project aims to demonstrate:

- Full-stack web development using the MERN stack
- Secure user authentication and role-based authorisation
- Product and inventory management
- Shopping cart and checkout functionality
- Order management for users and administrators
- AI-inspired chatbot support for product discovery
- Clean frontend design and responsive user experience
- Scalable project structure using modular backend and frontend architecture

---

## Key Features

### Customer Features

- User registration and login
- JWT-based authentication
- Product catalogue browsing
- Product details page
- Add-to-cart functionality
- Cart quantity management
- Stock validation before checkout
- Checkout process
- Order creation
- User order history
- Responsive user interface
- AI-style chatbot for product support

---

### Admin Features

- Admin-protected dashboard
- Role-based access control
- Add new products
- Edit existing products
- Delete products
- View all customer orders
- Update order delivery status
- View total products
- View total users
- View total orders
- View total revenue
- Monitor low-stock products
- Monitor out-of-stock products
- Calculate inventory value
- View recent orders

---

### Product Features

- Product name, brand, category, price, image, and description
- Product stock management
- Product rating support
- Product review data structure
- Product tags for improved searching and recommendations
- Product details page for individual product viewing

---

### Cart and Checkout Features

- Add products to cart
- Remove products from cart
- Increase or decrease item quantity
- Prevent quantity from exceeding available stock
- Store cart data locally for better user experience
- Checkout page for order placement
- Order summary before final submission

---

## AI Chatbot Feature

The project includes an AI-style chatbot designed to help users find products and receive shopping assistance.

The chatbot does not rely on a paid external large language model API. Instead, it uses a lightweight AI-inspired approach based on product data, keyword matching, intent detection, synonym handling, and recommendation logic.

### Chatbot Capabilities

- Understands product-related user queries
- Searches products based on keywords
- Matches categories and brands
- Uses synonym-based matching
- Supports product recommendation logic
- Responds to user shopping-related questions
- Helps users discover relevant products
- Can support personalised suggestions using available user activity data

### Example Chatbot Use Cases

A user may ask:

```txt
Show me laptops