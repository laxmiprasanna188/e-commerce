# 🛒 E-Commerce Web Application

A full-stack MERN E-Commerce application with authentication, product management, cart functionality, online payments, admin dashboard, and order management.

---

# 🚀 Features

## 👤 User Features

* User Registration & Login
* JWT Authentication
* Email Verification
* Browse Products
* Product Details Page
* Add to Cart
* Remove from Cart
* Checkout System
* Razorpay Payment Integration
* Order History
* Responsive UI

---

## 🛠️ Admin Features

* Admin Dashboard
* Add Products
* Update Products
* Delete Products
* Manage Orders
* Manage Users
* Sales Analytics

---

# 🧑‍💻 Tech Stack

## Frontend

* React.js
* Redux Toolkit
* Tailwind CSS
* Axios
* React Router DOM
* ShadCN UI

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Razorpay API

---

# 📂 Project Structure

```bash
e-commerce/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── services/
│   │   └── App.jsx
│   │
│   └── vite.config.js
│
└── README.md
```

---

# ⚙️ Installation

## 1️⃣ Clone Repository

```bash
git clone https://github.com/laxmiprasanna188/e-commerce.git
```

---

## 2️⃣ Install Backend Dependencies

```bash
cd backend
npm install
```

---

## 3️⃣ Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

# 🔑 Environment Variables

Create a `.env` file inside the `backend` folder.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

---

# ▶️ Run Application

## Backend

```bash
cd backend
npm run dev
```

## Frontend

```bash
cd frontend
npm run dev
```

---

# 💳 Payment Integration

This project uses Razorpay for secure online payments.

### Razorpay Features

* Test Mode Payments
* Order Verification
* Secure Transactions

---

# 🖼️ Uploading Product Images

You can upload images using:

* Cloudinary
* Multer
* Image URLs

### Recommended: Cloudinary

1. Create account on Cloudinary

2. Get:

   * Cloud Name
   * API Key
   * API Secret

3. Add to `.env`

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---



# 📦 API Endpoints

## User Routes

```bash
POST /api/users/register
POST /api/users/login
GET /api/users/profile
```

## Product Routes

```bash
GET /api/products
GET /api/products/:id
POST /api/products
PUT /api/products/:id
DELETE /api/products/:id
```

## Cart Routes

```bash
POST /api/cart/add
GET /api/cart
DELETE /api/cart/remove
```

## Order Routes

```bash
POST /api/orders/create
GET /api/orders/myorders
```

---

# 🔐 Authentication

* JWT Token Authentication
* Protected Routes
* Admin Authorization

---

# 🌟 Future Improvements

* Wishlist Feature
* Product Reviews
* Search & Filters
* Coupons & Discounts
* Stripe Integration
* Dark Mode

---

# 🤝 Contributing

Contributions are welcome.

1. Fork Repository
2. Create Branch
3. Commit Changes
4. Push Changes
5. Create Pull Request

---


# 👩‍💻 Author

### Laxmiprasanna

GitHub:
https://github.com/laxmiprasanna188

