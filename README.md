# AI-Enhanced Full-Stack E-Commerce Web Platform

A full-stack MERN e-commerce web application with AI-style chatbot assistance, product management, order management, shopping cart functionality, JWT authentication, role-based admin access, inventory analytics, and Stripe test-mode payment integration.

This project was developed as a final-year Computer Science project to demonstrate full-stack development, database design, secure authentication, e-commerce workflows, admin functionality, AI-enhanced product support, and third-party payment integration.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Aim of the Project](#aim-of-the-project)
- [Key Features](#key-features)
- [Stripe Test Payment Integration](#stripe-test-payment-integration)
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
- [Deployment Plan](#deployment-plan)
- [Current Limitations](#current-limitations)
- [Future Improvements](#future-improvements)
- [Academic Context](#academic-context)
- [Author](#author)

---

## Project Overview

The **AI-Enhanced Full-Stack E-Commerce Web Platform** is a MERN-based online shopping system designed to provide a smooth, modern, and intelligent shopping experience for customers while also giving administrators the tools required to manage products, orders, stock levels, payments, and basic business analytics.

The system includes a customer-facing interface where users can browse products, view product details, add items to a cart, complete checkout using Stripe test payment, view order history, and interact with an AI-style chatbot for product assistance.

The platform also includes an admin interface where authorised admin users can create, update, and delete products, manage customer orders, update delivery status, monitor low-stock products, and view business-related analytics such as total revenue, total orders, total users, and inventory value.

The project combines traditional e-commerce functionality with AI-inspired chatbot support and secure payment workflow design to create a more complete and realistic full-stack web application.

---

## Aim of the Project

The main aim of this project is to design and develop a full-stack e-commerce web platform that supports online shopping functionality and enhances the user experience through chatbot-based product assistance and secure test-mode payment processing.

The project aims to demonstrate:

- Full-stack web development using the MERN stack
- Secure user authentication using JSON Web Tokens
- Role-based authorisation for admin functionality
- Product and inventory management
- Shopping cart and checkout functionality
- Stripe Checkout integration in test mode
- Order management for users and administrators
- AI-inspired chatbot support for product discovery
- Responsive frontend design and improved user experience
- Cloud-ready project structure for deployment
- Maintainable backend and frontend architecture

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
- Secure checkout process
- Stripe test-mode payment integration
- Payment success confirmation page
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
- Product availability tracking

---

### Cart and Checkout Features

- Add products to cart
- Remove products from cart
- Increase or decrease item quantity
- Prevent quantity from exceeding available stock
- Store cart data locally for improved user experience
- Checkout page for order placement
- Order summary before final submission
- Tax and shipping price calculation
- Stripe test payment redirection
- Cart clearing after successful payment

---

## Stripe Test Payment Integration

The project includes **Stripe Checkout integration in test mode only**. This allows the application to simulate a realistic e-commerce payment workflow without taking real money from users.

Stripe Checkout is used because it provides a secure hosted payment page, reducing the need to manually handle sensitive card information inside the application.

### Payment Workflow

```txt
User adds products to cart
        ↓
User proceeds to checkout
        ↓
Order is created in MongoDB as unpaid
        ↓
Backend creates a Stripe Checkout Session
        ↓
User is redirected to Stripe hosted checkout page
        ↓
User completes test payment
        ↓
Stripe redirects user to payment success page
        ↓
Stripe webhook confirms payment
        ↓
Order payment status is updated in MongoDB
```

### Stripe Features Implemented

- Stripe Checkout Session creation
- Stripe test-mode payment support
- Secure backend-based payment session creation
- Stripe payment success redirect
- Payment success UI page
- Order reference display after payment
- Stripe webhook endpoint for payment confirmation
- Order payment status update using `isPaid` and `paidAt`
- Stripe payment result storage inside the order record

### Test Payment Information

This project uses Stripe test mode only. No real money is taken when using Stripe test cards.

Example Stripe test card:

```txt
Card Number: 4242 4242 4242 4242
Expiry Date: Any future date
CVC: Any 3 digits
Postcode: Any valid postcode
```

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
```

```txt
Do you have headphones?
```

```txt
Recommend something for gaming
```

```txt
Find me cheap shoes
```

```txt
What products are available in electronics?
```

The chatbot improves the shopping experience by helping users find products more quickly without manually searching through the whole catalogue.

---

## Technology Stack

### Frontend

| Technology | Purpose |
|---|---|
| React | Frontend user interface |
| Vite | Fast React development environment |
| React Router | Client-side routing |
| Axios | API communication |
| CSS | Styling and responsive design |
| Context API | Authentication and cart state management |

---

### Backend

| Technology | Purpose |
|---|---|
| Node.js | Backend runtime environment |
| Express.js | Backend server framework |
| MongoDB | NoSQL database |
| Mongoose | MongoDB object modelling |
| JSON Web Token | Authentication |
| bcryptjs | Password hashing |
| Stripe | Test-mode payment processing |
| CORS | Cross-origin API communication |
| dotenv | Environment variable management |

---

### Development Tools

| Tool | Purpose |
|---|---|
| Git | Version control |
| GitHub | Source code hosting |
| VS Code | Development environment |
| npm | Package management |
| Nodemon | Backend development server |
| MongoDB Atlas | Cloud database |
| Stripe Dashboard | Payment testing and webhook configuration |

---

## Project Structure

```txt
Ai_powered_ecommerce_website/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── data/
│   │   ├── pages/
│   │   │   ├── Checkout.jsx
│   │   │   ├── OrderSuccess.jsx
│   │   │   ├── MyOrders.jsx
│   │   │   └── AdminOrders.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── styles/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   ├── adminController.js
│   │   ├── chatbotController.js
│   │   └── paymentController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── adminMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   └── ChatLog.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── chatbotRoutes.js
│   │   └── paymentRoutes.js
│   ├── utils/
│   ├── index.js
│   └── package.json
│
├── README.md
└── .gitignore
```

---

## Installation and Setup

Follow the steps below to run the project locally.

---

### 1. Clone the Repository

```bash
git clone https://github.com/AkashChapagai/Ai_powered_ecommerce_website.git
```

```bash
cd Ai_powered_ecommerce_website
```

---

## Backend Setup

Go to the server folder:

```bash
cd server
```

Install backend dependencies:

```bash
npm install
```

Create a `.env` file inside the `server` folder:

```env
PORT=5001
CLIENT_URL=http://localhost:5173
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=your_stripe_test_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

Start the backend development server:

```bash
npm run dev
```

The backend should run on:

```txt
http://localhost:5001
```

---

## Frontend Setup

Open a new terminal and go to the client folder:

```bash
cd client
```

Install frontend dependencies:

```bash
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The frontend should run on:

```txt
http://localhost:5173
```

---

## Environment Variables

The backend requires the following environment variables:

| Variable | Description |
|---|---|
| `PORT` | Defines the backend server port |
| `CLIENT_URL` | Defines the frontend URL allowed by CORS |
| `MONGO_URI` | MongoDB Atlas database connection string |
| `JWT_SECRET` | Secret key used to sign and verify JWT tokens |
| `STRIPE_SECRET_KEY` | Stripe test secret key used to create Checkout Sessions |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret used to verify webhook events |

Example backend `.env`:

```env
PORT=5001
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your_secure_secret_key
STRIPE_SECRET_KEY=sk_test_your_test_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

Important: The `.env` file should not be pushed to GitHub because it contains private configuration values.

---

## API Routes

### Authentication Routes

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login an existing user |

---

### Product Routes

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get a single product by ID |
| POST | `/api/products` | Create a new product |
| PUT | `/api/products/:id` | Update a product |
| DELETE | `/api/products/:id` | Delete a product |

---

### Order Routes

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/orders` | Create a new order |
| GET | `/api/orders/myorders` | Get logged-in user's orders |
| GET | `/api/orders` | Get all orders for admin |
| PUT | `/api/orders/:id/deliver` | Mark an order as delivered |

---

### Payment Routes

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/payments/create-checkout-session` | Create a Stripe Checkout Session |
| POST | `/api/payments/webhook` | Receive Stripe webhook events |

---

### Admin Routes

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/analytics` | Get admin dashboard analytics |

---

### Chatbot Routes

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/chatbot` | Send a message to the chatbot |

---

## Database Models

The project uses MongoDB with Mongoose models.

---

### User Model

The user model stores account and authentication-related data.

Main fields include:

- Name
- Email
- Password
- Role
- Viewed products
- Search history

The password is hashed before being stored in the database.

---

### Product Model

The product model stores product catalogue information.

Main fields include:

- Product name
- Price
- Category
- Brand
- Image
- Description
- Rating
- Number of reviews
- Stock count
- Tags
- Review data

---

### Order Model

The order model stores customer order and payment information.

Main fields include:

- User reference
- Ordered items
- Shipping address
- Payment method
- Item price
- Shipping price
- Tax price
- Total price
- Payment status
- Payment date
- Stripe Checkout Session ID
- Payment result
- Delivery status

---

### Chatbot Log Model

The chatbot log model can be used to store chatbot interactions for future analysis and improvement.

Main fields may include:

- User message
- Chatbot response
- Predicted intent
- Recommended products
- User reference
- Timestamp

---

## Main User Workflows

### Customer Workflow

```txt
Register/Login
      ↓
Browse Products
      ↓
View Product Details
      ↓
Add Product to Cart
      ↓
Update Cart Quantity
      ↓
Checkout
      ↓
Stripe Test Payment
      ↓
Payment Success Page
      ↓
View My Orders
```

---

### Admin Workflow

```txt
Admin Login
      ↓
Access Admin Dashboard
      ↓
Add/Edit/Delete Products
      ↓
View Customer Orders
      ↓
Update Delivery Status
      ↓
Monitor Analytics and Stock
```

---

### Stripe Payment Workflow

```txt
Checkout Form Submitted
      ↓
Order Created in Database
      ↓
Stripe Checkout Session Created
      ↓
User Redirected to Stripe
      ↓
Test Payment Completed
      ↓
Webhook Confirms Payment
      ↓
Order Marked as Paid
```

---

### Chatbot Workflow

```txt
User Sends Message
      ↓
Chatbot Analyses Query
      ↓
Intent and Keywords Are Detected
      ↓
Matching Products Are Found
      ↓
Relevant Response Is Generated
      ↓
User Receives Product Assistance
```

---

## Testing Strategy

Testing is an important part of the project to ensure that the system works correctly and handles errors properly.

---

### Manual Testing

Manual testing can be performed on:

- User registration
- User login
- Product browsing
- Product details page
- Add to cart
- Cart quantity update
- Checkout form
- Stripe test payment
- Payment success page
- My orders page
- Admin product management
- Admin order management
- Chatbot responses
- Responsive design

---

### Stripe Payment Testing

Stripe test payment should be tested using Stripe test cards only.

Important payment tests include:

- Checkout session creation
- Successful test card payment
- Redirect to payment success page
- Order reference displayed after payment
- Cart clears after successful payment
- Stripe webhook updates order payment status
- MongoDB order changes from unpaid to paid
- Cancelled checkout returns user to checkout page

---

### API Testing

API routes can be tested using tools such as Postman or Thunder Client.

Important API tests include:

- Register user with valid data
- Reject registration with missing fields
- Login with correct credentials
- Reject login with wrong password
- Get all products
- Get product by valid ID
- Reject invalid product ID
- Create product as admin
- Prevent normal user from accessing admin routes
- Create order as logged-in user
- Create Stripe Checkout Session
- Get user order history
- Mark order as delivered as admin

---

### Authentication Testing

Authentication testing should confirm that:

- Users cannot access protected routes without logging in
- Users cannot access admin routes without admin role
- Invalid tokens are rejected
- Admin-only functions are protected
- Login stores user state correctly on the frontend
- Logout clears user state correctly on the frontend

---

### Responsive Testing

The frontend should be tested on:

- Mobile screen sizes
- Tablet screen sizes
- Laptop screen sizes
- Desktop screen sizes

Responsive testing helps ensure that the system is usable across different devices.

---

### User Acceptance Testing

User acceptance testing can be carried out by asking users to complete common tasks such as:

- Register an account
- Find a product
- Add a product to cart
- Complete Stripe test checkout
- Ask the chatbot for product help
- View previous orders
- Use the admin dashboard

Feedback from users can be used to improve usability and identify issues.

---

## Security Considerations

The project includes several security-related features:

- Password hashing using bcrypt
- JWT-based authentication
- Role-based admin authorisation
- Protected backend routes
- CORS configuration
- Environment variables for sensitive data
- Stripe secret key stored on backend only
- Stripe Checkout used to avoid handling raw card details directly
- Stripe webhook signature verification
- Separation of frontend and backend configuration

For a production system, additional security improvements would be recommended, such as:

- HTTP-only cookies for token storage
- CSRF protection
- Rate limiting
- Input sanitisation
- Stronger validation middleware
- Production-level error handling
- Secure live payment configuration
- Advanced logging and monitoring

---

## Deployment Plan

The project is designed to be deployed using a separated full-stack architecture:

| Part | Suggested Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| Database | MongoDB Atlas |
| Payment Testing | Stripe Test Mode |

### Deployment Workflow

```txt
React Frontend on Vercel
        ↓
Express Backend on Render
        ↓
MongoDB Atlas Database
        ↓
Stripe Test Webhook to Backend
```

For deployment, the frontend API base URL should point to the deployed backend URL, and the backend `CLIENT_URL` should point to the deployed frontend URL.

---

## Current Limitations

This project is an academic prototype and has some limitations:

- Stripe is currently integrated in test mode only
- No real payment transactions are processed
- No real payment refund system has been implemented
- The chatbot uses rule-based and NLP-inspired logic rather than a paid LLM API
- More automated testing should be added
- Email notifications are not currently included
- Product image upload could be improved with cloud storage
- Advanced search, filtering, and pagination can be expanded further
- Production-level security features can be improved
- Stock is currently reduced when the order is created; a future production version should improve stock reservation logic for cancelled or unpaid payments

---

## Future Improvements

Future improvements could include:

- Stripe live payment mode after full production verification
- Stripe refund support
- Email confirmation after order placement
- Password reset functionality
- Advanced product filtering
- Product pagination
- Wishlist functionality
- Product recommendation engine
- “Because you viewed” recommendation section
- Chatbot conversation history
- Admin sales charts
- Admin customer analytics
- Product image upload using cloud storage
- Automated unit and integration testing
- Improved chatbot accuracy using machine learning or LLM integration
- Deployment to production hosting platforms
- Improved security using HTTP-only cookies and stronger validation middleware

---

## Academic Context

This project was developed as part of a final-year Computer Science project. The system demonstrates practical knowledge of full-stack web development, database design, user authentication, role-based access control, e-commerce functionality, admin management, AI-enhanced user support, and third-party payment integration.

The project also provides opportunities for critical evaluation in areas such as usability, security, scalability, testing, maintainability, payment workflow design, and future system improvement.

---

## Author

**Akash Chapagai**  
BSc Computer Science  
De Montfort University

---

## Repository

```txt
https://github.com/AkashChapagai/Ai_powered_ecommerce_website
```