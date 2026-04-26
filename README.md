# 🚀 AI Interview Preparation Platform (MERN + GenAI)

## 📌 Overview

This project is a full-stack AI-powered web application that helps users prepare for job interviews.
It analyzes a candidate’s **resume**, **self-description**, and a **job description** to generate a personalized interview strategy.

The platform provides:

- 🎯 Match score with the job role
- 💻 Technical interview questions with answers
- 🧠 Behavioral interview questions
- 📉 Skill gap analysis
- 🗺️ Day-wise preparation roadmap
- 📄 AI-generated resume (PDF)

---

## 🛠️ Tech Stack

### Frontend

- React.js
- Tailwind CSS / SCSS
- Axios
- React Router

### Backend

- Node.js
- Express.js
- MongoDB + Mongoose

### AI & Tools

- Google Gemini API (`@google/genai`)
- Zod (schema validation)
- Puppeteer (PDF generation)
- pdf-parse (resume parsing)

---

## ✨ Features

- 📄 Upload Resume (PDF/DOCX)
- 🧾 Enter Job Description
- 🧠 AI-based Analysis
- 📊 Match Score Calculation
- ❓ Technical & Behavioral Questions
- ⚠️ Skill Gap Identification
- 🗓️ Personalized Preparation Plan
- 📥 Download AI-generated Resume PDF
- 🧑‍💻 User Authentication (JWT-based)

---

## 📁 Project Structure

```
project-root/
│
├── client/               # React Frontend
│   ├── src/
│   └── ...
│
├── server/               # Node Backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── ...
│
├── README.md
└── .env
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```
git clone https://github.com/MDMUNTAZEEMSARADGI/GenAI-Project
cd GenAI-Project
```

---

### 2️⃣ Setup Backend

```
cd server
npm install
```

Create `.env` file:

```
PORT=3000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
GOOGLE_GENAI_API_KEY=your_api_key
```

Run server:

```
npm run dev
```

---

### 3️⃣ Setup Frontend

```
cd client
npm install
npm run dev
```

---

## 🔗 API Endpoints

### Generate Interview Report

```
POST /api/interview/
```

Form Data:

- jobDescription
- selfDescription
- resume (file)

---

### Get All Reports

```
GET /api/interview/
```

---

### Get Report By ID

```
GET /api/interview/report/:id
```

---

### Generate Resume PDF

```
POST /api/interview/resume/pdf/:id
```

---

## ⚠️ Error Handling

- Handles AI API failures (503 - high demand)
- Validates JSON response using Zod
- Prevents invalid data insertion into MongoDB
- Displays user-friendly error messages in UI

---

## 🧠 How AI Works

1. User submits:
   - Resume
   - Job Description
   - Self Description

2. Backend:
   - Extracts resume text using pdf-parse
   - Sends structured prompt to Gemini API
   - Validates response using Zod schema

3. Output:
   - Interview questions
   - Skill gaps
   - Preparation roadmap
   - Match score

---

## 📸 Screenshots (Optional)

yet to add
---

## 🚀 Future Improvements

- 🔔 Toast Notifications
- 📊 Analytics Dashboard
- 🧑‍🤝‍🧑 Multi-user collaboration
- 🌐 Deployment (AWS / Vercel / Render)
- 📱 Mobile responsiveness improvements

---

## 🤝 Contributing

Contributions are welcome!
Feel free to fork this repo and submit a pull request.

---

## 📜 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Md Muntazeem Saradgi**

- GitHub: https://github.com/MDMUNTAZEEMSARADGI
- LinkedIn: https://www.linkedin.com/in/md-muntazeem-saradgi-8a8305237

---
