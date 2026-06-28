# 🚀 AI Resume Tracker

An AI-powered full-stack Resume Tracker that helps users upload resumes, analyze ATS compatibility using OpenAI, and manage job applications through a modern dashboard.

---


## Live link
https://frontend-beta-roan-13.vercel.app/login

## 📌 Overview

AI Resume Tracker is a SaaS-style web application that enables users to:

- Upload resumes (PDF/DOCX)
- Analyze resumes using OpenAI
- Get ATS score and improvement suggestions
- Track job applications
- Manage profile and dashboard statistics
- Secure authentication using JWT

---

## ✨ Features

### 🔐 Authentication
- User Registration
- User Login
- JWT Authentication
- Protected Routes

### 📄 Resume Management
- Upload PDF & DOCX resumes
- Secure storage
- Resume history

### 🤖 AI Resume Analyzer
- ATS Score
- Resume Strengths
- Weaknesses
- Missing Keywords
- Actionable Suggestions
- Role Suitability

### 💼 Job Tracker
- Add Jobs
- Edit Jobs
- Delete Jobs
- Search Jobs
- Filter by Status

Job Status:

- Applied
- Interview
- Rejected
- Offer

### 📊 Dashboard
- Total Applications
- Interviews
- Offers
- Rejections
- Average ATS Score

### 👤 Profile
- User Email
- Joined Date
- Resume Count
- Application Count
- Average ATS Score

---

# 🛠 Tech Stack

## Frontend

- React
- Vite
- JavaScript
- CSS

## Backend

- Node.js
- Express.js

## Database

- PostgreSQL
- Prisma ORM
- Neon Database

## Authentication

- JWT

## AI

- OpenAI API

## Deployment

- Frontend: Vercel
- Backend: Render
- Database: Neon

---

# 📁 Project Structure

```
ai-resume-tracker
│
├── frontend
│
└── backend
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/alokdevops43/ai-resume-tracker.git
```

```
cd ai-resume-tracker
```

---

## Backend

```
cd backend
npm install
```

Create a `.env` file:

```
DATABASE_URL=your_database_url
JWT_SECRET=your_secret
OPENAI_API_KEY=your_openai_key
PORT=5000
```

Run:

```
node server.js
```

---

## Frontend

```
cd frontend
npm install
npm run dev
```

---

# 🌐 Environment Variables

Backend requires:

```
DATABASE_URL
JWT_SECRET
OPENAI_API_KEY
PORT
```

---


# 📈 Future Improvements

- Resume Versioning
- Email Notifications
- Company Insights
- Interview Preparation
- Resume Templates
- Dark Mode
- Admin Dashboard

---

# 🤝 Contributing

Contributions are welcome.

Fork the repository and submit a Pull Request.

---

# 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**ALOK Choudhary**

GitHub:
https://github.com/alokdevops43
