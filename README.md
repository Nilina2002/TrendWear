# TrendWear - E-commerce Web Application

A full-stack MERN (MongoDB, Express, React, Node.js) e-commerce web application for clothing and fashion items. This application allows users to browse products, add items to cart, and place orders with a complete shopping experience.

## 🚀 Features

- **User Authentication**: Sign up, login, and logout functionality
- **Product Catalog**: Browse products with filtering by category, size, and price range
- **Product Search**: Search products by name or description
- **Product Details**: View detailed product information with size selection
- **Shopping Cart**:
  - Add items with selected sizes
  - Update quantities and remove items
  - Cart persists for both logged-in users and guests
  - Cart automatically merges when guest users log in
- **Checkout & Orders**:
  - Mock checkout process (no real payments)
  - Order history with detailed information
  - Order tracking with status updates
- **Responsive Design**: Modern UI built with Tailwind CSS

## 🛠️ Tech Stack

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend

- **React** - UI library
- **React Router** - Routing
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Axios** - HTTP client

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (cloud database)
- **npm** or **yarn** (comes with Node.js)
- **Git** - [Download](https://git-scm.com/)

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Nilina2002/TrendWear.git
cd TrendWear-ecommerce-webapp-mern
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the `backend` directory:

```bash
touch .env
```

Add the following environment variables to `.env`:

```env
# MongoDB Connection String
# For local MongoDB:
MONGODB_URL=mongodb://localhost:27017/trendwear
# For MongoDB Atlas (cloud):
# MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/trendwear?retryWrites=true&w=majority

# Server Port
PORT=3000

# JWT Secret (generate a random string for production)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

**Important**: Replace `your_super_secret_jwt_key_change_this_in_production` with a strong, random string in production.

### 3. Frontend Setup

Navigate to the frontend directory:

```bash
cd ../frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the `frontend` directory (optional, as it has defaults):

```bash
touch .env
```

Add the following environment variable to `.env`:

```env
# Backend API URL
VITE_API_BASE_URL=http://localhost:3000/api
```

## 🗄️ Database Setup

### Option 1: Local MongoDB

1. Install MongoDB locally from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Start MongoDB service:
   - **Windows**: MongoDB should start automatically as a service
   - **macOS**: `brew services start mongodb-community`
   - **Linux**: `sudo systemctl start mongod`
3. Update `MONGODB_URL` in backend `.env` to: `mongodb://localhost:27017/trendwear`

### Option 2: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user
4. Whitelist your IP address (or use `0.0.0.0/0` for development)
5. Get your connection string and update `MONGODB_URL` in backend `.env`

## 🌱 Seed Database (Optional)

To populate the database with sample products, run:

```bash
cd backend
npm run seed:products
```

This will add demo clothing products to your database.

## 🚀 Running the Application

### Start Backend Server

From the `backend` directory:

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The backend server will run on `http://localhost:3000`

### Start Frontend Development Server

From the `frontend` directory (in a new terminal):

```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

### Access the Application

Open your browser and navigate to:

```
http://localhost:5173
```

## 📁 Project Structure

```
TrendWear-ecommerce-webapp-mern/
├── backend/
│   ├── controllers/       # Request handlers
│   │   ├── authController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   └── productController.js
│   ├── data/              # Demo data
│   │   └── demoProducts.js
│   ├── db/                # Database connection
│   │   └── db.js
│   ├── middleware/        # Custom middleware
│   │   ├── authMiddleware.js
│   │   └── optionalAuth.js
│   ├── models/            # Mongoose models
│   │   ├── Cart.js
│   │   ├── Order.js
│   │   ├── Product.js
│   │   └── User.js
│   ├── routes/            # API routes
│   │   ├── authRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   └── productRoutes.js
│   ├── scripts/           # Utility scripts
│   │   └── seedProducts.js
│   ├── index.js           # Entry point
│   └── package.json
│
├── frontend/
│   ├── public/            # Static files
│   ├── src/
│   │   ├── config/        # Configuration
│   │   │   └── api.js
│   │   ├── contexts/      # React contexts
│   │   │   └── CartContext.jsx
│   │   ├── pages/         # Page components
│   │   │   ├── Cart/
│   │   │   ├── Home/
│   │   │   ├── Login/
│   │   │   ├── Orders/
│   │   │   ├── ProductDetail/
│   │   │   └── Signup/
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   └── package.json
│
└── README.md
```

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Products

- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get product by ID

### Cart

- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/item/:itemId` - Update cart item quantity
- `DELETE /api/cart/item/:itemId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear entire cart
- `POST /api/cart/merge` - Merge guest cart with user cart (requires auth)

### Orders

- `POST /api/orders/checkout` - Create order (requires auth)
- `GET /api/orders` - Get user's orders (requires auth)
- `GET /api/orders/:id` - Get order by ID (requires auth)

## 🧪 Testing the Application

1. **Create an Account**: Navigate to Sign Up and create a new account
2. **Browse Products**: Use the home page to browse and filter products
3. **View Product Details**: Click on any product to see details
4. **Add to Cart**: Select a size and add items to cart (works even without login)
5. **View Cart**: Click the cart icon to view and manage cart items
6. **Checkout**: Login and proceed to checkout to place an order
7. **View Orders**: Access "My Orders" from the user menu to see order history

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Error**

- Ensure MongoDB is running (local) or connection string is correct (Atlas)
- Check if `MONGODB_URL` in `.env` is correct
- Verify network connectivity for MongoDB Atlas

**Port Already in Use**

- Change `PORT` in backend `.env` to a different port
- Update `VITE_API_BASE_URL` in frontend `.env` accordingly

### Frontend Issues

**API Connection Error**

- Ensure backend server is running
- Check `VITE_API_BASE_URL` in frontend `.env`
- Verify CORS settings in backend (should allow frontend origin)

**Build Errors**

- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

## 📝 Environment Variables Summary

### Backend (.env)

```env
MONGODB_URL=mongodb://localhost:27017/trendwear
PORT=3000
JWT_SECRET=your_secret_key
```

### Frontend (.env)

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## 🚢 Production Deployment

### Backend

1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET`
3. Use MongoDB Atlas or a managed MongoDB service
4. Deploy to platforms like Heroku, Railway, or AWS

### Frontend

1. Build the frontend: `npm run build`
2. Deploy the `dist` folder to platforms like Vercel, Netlify, or AWS S3
3. Update `VITE_API_BASE_URL` to your production backend URL

## 📄 License

ISC

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on the [GitHub repository](https://github.com/Nilina2002/TrendWear/issues).
