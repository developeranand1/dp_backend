# Daposh Fashion - Backend API (Node.js + Express + MongoDB + Cloudinary + Razorpay)

Full-stack backend architecture for **Daposh Fashion** e-commerce maison.

---

## ⚡ Tech Stack
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose (with in-memory fallback)
- **Media CDN**: Cloudinary v2 (Product Image Uploads via Multer)
- **Payments**: Razorpay Node SDK (Order creation & HMAC SHA256 Signature Verification)
- **Security**: CORS, Environment protection, HMAC verification

---

## 📁 Directory Structure
```
backend/
├── src/
│   ├── config/
│   │   ├── db.js             # MongoDB connection handler
│   │   ├── cloudinary.js     # Cloudinary SDK & Multer storage
│   │   └── razorpay.js       # Razorpay client & signature verifier
│   ├── models/
│   │   ├── Product.js        # Product schema (category, mood, images, stock)
│   │   ├── Order.js          # Order schema (customer, Razorpay, tracking timeline)
│   │   └── Category.js       # Category schema
│   ├── controllers/
│   │   ├── productController.js # Product CRUD & filtering
│   │   ├── orderController.js   # Razorpay, COD, & Order tracking
│   │   └── uploadController.js  # Cloudinary single/multiple uploads
│   ├── routes/
│   │   ├── productRoutes.js  # /api/products
│   │   ├── orderRoutes.js    # /api/orders
│   │   └── uploadRoutes.js   # /api/upload
│   ├── scripts/
│   │   └── seed.js           # Database seeder
│   └── server.js             # Main server entrypoint (Port 5000)
├── .env                      # Active environment configuration
├── .env.example              # Template environment configuration
└── package.json
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment (`.env`)
Copy `.env.example` to `.env` and fill in your credentials:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/daposh_fashion

# Cloudinary (Get free from https://cloudinary.com/console)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay (Get free test keys from https://dashboard.razorpay.com/app/keys)
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
```

### 3. Seed Database (Optional)
```bash
npm run seed
```

### 4. Start Server
```bash
npm run dev   # Development with nodemon
# or
npm start     # Production
```

---

## 📡 API Endpoints

### 🛍️ Products
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products` | Get products (filters: `category`, `mood`, `search`, `sort`) |
| `GET` | `/api/products/:id` | Get single product |
| `POST` | `/api/products` | Create product (with Cloudinary image & category) |
| `PUT` | `/api/products/:id` | Update product details |
| `DELETE` | `/api/products/:id` | Delete product from store |
| `GET` | `/api/products/categories` | Get category list |

### 💳 Orders & Razorpay Checkout
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/orders/create-razorpay-order` | Generate Razorpay order ID |
| `POST` | `/api/orders/verify-payment` | Verify HMAC signature & save confirmed order |
| `POST` | `/api/orders/create-cod-order` | Book Cash on Delivery order |
| `GET` | `/api/orders/track/:query` | Track order by Order ID (e.g. `DPS-2026-XXXXXX`) or Phone |
| `GET` | `/api/orders` | Admin: Get all orders |
| `PUT` | `/api/orders/:id/status` | Admin: Update status (`Placed`, `Shipped`, `Delivered`) & add AWB |

### ☁️ Cloudinary Uploads
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/upload/file` | Multipart form file upload (`image` field) to Cloudinary |
| `POST` | `/api/upload/url` | Base64 or external URL upload to Cloudinary |
