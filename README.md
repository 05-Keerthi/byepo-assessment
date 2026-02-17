# 🚀 Feature Flag Management System (Multi-Tenant RBAC)

A multi-tenant Feature Flag Management System built using **Node.js, Express, MongoDB**, implementing **Role-Based Access Control (RBAC)**, JWT authentication (Access & Refresh Tokens), secure organization scoping, and email-based onboarding.

---

## 📌 Overview

This system allows:

- 👑 SUPER_ADMIN to create and manage organizations
- 🏢 ORG_ADMIN to manage users and feature flags within their organization
- 👤 END_USER to check whether a feature is enabled for their organization

The architecture ensures:

- Multi-tenant isolation
- Secure authentication
- Role-based authorization
- Email-based onboarding
- Swagger API documentation

---

## 🏗 System Architecture

### 👥 Roles & Permissions

| Role        | Permissions |
|------------|------------|
| SUPER_ADMIN | Create / View / Update / Delete Organizations |
| ORG_ADMIN   | Manage Users & Feature Flags (within their organization only) |
| END_USER    | Check feature status |

---

## 🔐 Authentication & Security

- JWT-based authentication
- Access Token + Refresh Token
- Refresh token stored in database
- Logout invalidates refresh token
- Password hashing using bcrypt
- Secret code validation for ORG_ADMIN signup
- Organization-scoped queries for multi-tenant security

---

## 🏢 Organization Flow

1. SUPER_ADMIN creates an organization.
2. A secret code is generated automatically.
3. Secret code is emailed to the organization admin.
4. ORG_ADMIN signs up using:
   - Organization ID
   - Secret Code
5. Secret code is validated during signup.

---

## 👤 User Management (ORG_ADMIN)

- Create End User (auto-generate password if not provided)
- Email credentials to End User
- Get all users (organization scoped)
- Get user by ID
- Update user
- Delete user

All operations are restricted to the admin’s organization.

---

## 🎛 Feature Flag Flow

ORG_ADMIN can:

- Create feature flags
- Get feature by ID
- Update feature
- Delete feature

END_USER can:

- Check feature status using `featureKey`

Feature lookup is automatically scoped to the user's organization.

---

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (Access & Refresh Tokens)
- bcrypt
- Nodemailer
- Swagger (OpenAPI 3.0)

---

## 📂 Project Structure

```
backend/
│
├── controllers/
│   ├── authController.js
│   ├── organizationController.js
│   ├── userController.js
│   └── featureController.js
│
├── models/
│   ├── User.js
│   ├── Organization.js
│   └── FeatureFlag.js
│
├── routes/
│   ├── authRoutes.js
│   ├── organizationRoutes.js
│   ├── userRoutes.js
│   └── featureRoutes.js
│
├── middleware/
│   ├── authMiddleware.js
│   └── roleMiddleware.js
│
├── utils/
│   ├── generateToken.js
│   └── sendEmail.js
│
├── config/
│   ├── db.js
│   └── swagger.js
│
├── app.js
├── server.js
└── .env
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
FRONTEND_URL=http://localhost:3000

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

---

## ▶️ Installation & Setup

### 1️⃣ Install dependencies

```bash
npm install
```

### 2️⃣ Start development server

```bash
npm start
```

Server runs at:

```
http://localhost:5000
```

---

## 📘 API Documentation

Swagger documentation is available at:

```
http://localhost:5000/api-docs
```

Use the **Authorize** button in Swagger to test secured APIs using JWT.

---

## 📌 API Endpoints

### 🔑 Auth
- POST `/api/auth/signup`
- POST `/api/auth/login`
- POST `/api/auth/logout`

### 🏢 Organizations (SUPER_ADMIN)
- POST `/api/orgs`
- GET `/api/orgs`
- GET `/api/orgs/:id`
- PUT `/api/orgs/:id`
- DELETE `/api/orgs/:id`

### 👤 Users (ORG_ADMIN)
- POST `/api/users/create-end-user`
- GET `/api/users`
- GET `/api/users/:id`
- PUT `/api/users/:id`
- DELETE `/api/users/:id`

### 🎛 Features
- POST `/api/features`
- GET `/api/features/:id`
- PUT `/api/features/:id`
- DELETE `/api/features/:id`
- GET `/api/features/check?featureKey=xyz`

---

## 🔐 Multi-Tenant Security

All organization-based queries are scoped using:

```js
organization: req.user.organization
```

This ensures:

- No cross-organization data access
- Proper tenant isolation
- Secure RBAC enforcement

---

## 🧪 Testing

You can test APIs using:

- Swagger UI
- Postman
- Frontend integration

---

## 🎯 Design Highlights

- Multi-tenant architecture
- Role-based middleware
- Secret code validation for Org Admin registration
- Auto-generated passwords for End Users
- Email-based onboarding
- Single controller handling both getAll and getById logic
- Secure refresh token invalidation on logout

---

## 🚀 Future Improvements

- Pagination for list endpoints
- Refresh token rotation
- Password reset flow
- Audit logs
- Feature targeting per specific users
- Deployment with Docker

---

## 👩‍💻 Author

Keerthana S
