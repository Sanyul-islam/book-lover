# 📚 Book Lover

Book Lover is a modern online book delivery and library management platform that allows readers to discover books, request home delivery, make secure payments, and share reviews. Librarians can submit and manage books, while administrators oversee approvals, inventory, and user roles. The application is built with Next.js, Express.js, MongoDB, Better Auth with JWT, HeroUI, and Stripe.

## 🌐 Live Website

**Live URL:** https://book-lover-seven.vercel.app

---

# 🎯 Purpose

The purpose of **Book Lover** is to provide an intuitive and secure online library platform where users can easily explore books, request deliveries, and manage their reading activities while offering librarians and administrators powerful tools to manage the system efficiently.

---

# ✨ Key Features

- 🔐 Secure authentication using **Better Auth + JWT**
- 👤 Role-based authorization (Reader, Librarian, Admin)
- 📚 Browse all books with search, filter, and sorting
- 📖 Detailed book information page
- 🚚 Request book delivery
- 💳 Secure Stripe payment integration
- ⭐ Readers can rate and review books
- 📦 Track delivery request status
- 📝 Librarians can add, edit, and manage books
- ✅ Admin approval system for newly submitted books
- 👥 User management dashboard for admins
- 📊 Separate dashboards for Reader, Librarian, and Admin
- 🌙 Light & Dark mode
- 🖼️ Image upload using ImgBB
- 🔔 Beautiful toast notifications
- 📱 Fully responsive on mobile, tablet, and desktop
- ⚡ Fast server-side rendering using Next.js App Router

---

# 🛠️ Technologies Used

## Frontend

- Next.js 16
- React
- HeroUI v3
- Tailwind CSS
- Motion
- Lucide React
- Better Auth
- JWT Authentication
- React Toastify
- Next Themes
- Swiper

## Backend

- Node.js
- Express.js
- MongoDB
- JWT (jsonwebtoken)
- Better Auth
- Stripe
- CORS
- Dotenv

---

# 📦 NPM Packages

## Frontend

```bash
@heroui/react
@heroui/styles
better-auth
lucide-react
motion
next
next-themes
react
react-dom
react-toastify
swiper
tailwindcss
```

## Backend

```bash
better-auth
cors
dotenv
express
jsonwebtoken
mongodb
stripe
```

---

# 🚀 Installation

## Clone the Repository

```bash
git clone https://github.com/your-username/book-lover.git
```

## Install Dependencies

```bash
npm install
```

## Start Development Server

Frontend

```bash
npm run dev
```

Backend

```bash
npm start
```

---

# 🔑 Environment Variables

### Frontend (`.env.local`)

```env
NEXT_PUBLIC_SERVER_URL=
NEXT_PUBLIC_IMGBB_API_KEY=
```

### Backend (`.env`)

```env
PORT=
MONGODB_URI=

BETTER_AUTH_SECRET=
BETTER_AUTH_URL=

JWT_SECRET=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

---

# 👥 User Roles

### 📖 Reader

- Browse books
- Request deliveries
- Make payments
- Leave reviews
- Track delivery requests

### 📚 Librarian

- Add new books
- Edit book information
- Manage inventory
- View delivery requests

### 🛡️ Admin

- Approve or reject books
- Manage users and roles
- Monitor the entire platform

---

# 🔒 Security

- Better Auth Authentication
- JWT Protected API Routes
- Role-Based Authorization
- Environment Variables for Sensitive Data
- Secure Stripe Payment Processing

---

# 📄 License

This project was developed for educational and portfolio purposes.