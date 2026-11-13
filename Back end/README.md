# 🍱 Food Waste Management System — Backend API

This is the Node.js / Express / MongoDB REST API backend for the Food Waste Management System.

## Architecture & Features

- **Runtime**: Node.js
- **Framework**: Express.js 4.22
- **Database**: MongoDB via Mongoose 8
- **Authentication**: JWT (`jsonwebtoken`) + `bcryptjs` password hashing (salt rounds = 12)
- **Role-Based Access Control (RBAC)**: `admin`, `donor`, `ngo`, `volunteer`
- **File Uploads**: `multer` with disk storage in `uploads/`
- **Error Handling**: Centralized error middleware handling validation, duplicate keys, and cast errors

## Directory Structure

```
Back end/
├── controllers/
│   ├── analyticsController.js     # System metrics and aggregations
│   ├── authController.js          # Register, login, forgot password, current user
│   ├── collectionController.js    # Volunteer assignment and pickup/delivery
│   ├── donationController.js      # Food donation CRUD and image uploads
│   ├── notificationController.js  # In-app notifications
│   ├── requestController.js       # Food request lifecycle management
│   └── userController.js          # User profiles, admin moderation, verification
├── middleware/
│   ├── auth.js                    # JWT verification and role authorization
│   └── errorHandler.js            # Centralized API error handling
├── models/
│   ├── Collection.js              # Volunteer transport tracking
│   ├── FoodDonation.js            # Food donation schema
│   ├── FoodRequest.js             # Food request lifecycle schema
│   ├── Notification.js            # System notifications
│   └── User.js                    # User account schema with password hashing
├── routes/
│   ├── analyticsRoutes.js
│   ├── authRoutes.js
│   ├── collectionRoutes.js
│   ├── donationRoutes.js
│   ├── notificationRoutes.js
│   ├── requestRoutes.js
│   └── userRoutes.js
├── scripts/
│   └── seed.js                    # Database seeder with pre-configured accounts
├── uploads/                       # Destination for uploaded food images
├── .env                           # Environment configuration
├── package.json
└── server.js                      # Express application entrypoint
```

## Setup & Running

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create or verify `.env`:
```env
MONGO_URI=mongodb://127.0.0.1:27017/food_waste_management
JWT_SECRET=fwms_super_secret_jwt_key_2026_india
PORT=5000
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

### 3. Seed Database
```bash
npm run seed
```

### 4. Start Server
```bash
# Production
npm start

# Development (with nodemon)
npm run dev
```

Server will be running on `http://localhost:5001`. Health check endpoint: `GET /api/health`.

