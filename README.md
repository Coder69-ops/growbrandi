# 🚀 GrowBrandi

<div align="center">

![GrowBrandi Banner](https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop&ixlib=rb-4.0.3)

### The AI-Powered Digital Agency Operating System

[![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)
[![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase)](https://firebase.google.com/)

[Live Demo](https://growbrandi.vercel.app) · [Report Bug](https://github.com/Coder69-ops/growbrandi/issues) · [Request Feature](https://github.com/Coder69-ops/growbrandi/issues)

</div>

---

## ✨ Overview

**GrowBrandi** is not just a digital agency website—it's a complete **Agency Operating System**. It seamlessly blends high-end client-facing aesthetics with a powerful internal admin dashboard for team management, project tracking, and AI configuration. Built for speed, scalability, and automation.

## ⚡ Key Features

### 🎨 Client Experience
*   **Stunning UI/UX**: Glassmorphic design with premium animations.
*   **Interactive Components**: Dynamic service cards, portfolio showcase, and swiper testimonials.
*   **Smart Forms**: AI-assisted contact forms and lead generation.
*   **High Performance**: Vite-powered speed with lazy loading and optimized assets.

### 🛠️ Admin Command Center
*   **Dashboard**: Real-time overview of active users, projects, and system health.
*   **Team Collaboration**:
    *   **Built-in Chat**: Real-time team messaging with channels and direct messages (Slack-like).
    *   **Task Management**: Assign, track, and manage project tasks.
    *   **Time Tracking**: Integrated timesheets for employee productivity.
*   **Content Management (CMS)**:
    *   Full control over **Blogs**, **Services**, **Projects**, and **FAQs**.
    *   Manage **Testimonials** and **Site Content** directly from the UI.
*   **HR & Recruitment**: Job posting management and team role administration.

### 🤖 Advanced AI Integration
*   **Multi-Model Support**: Configurable integration with **Google Gemini** and **OpenAI**.
*   **BrandiBot**: Context-aware AI assistant for visitors.
*   **Creative Tools**: Slogan generators and marketing copy assistants.
*   **AI Configuration**: Fine-tune model parameters and API settings directly from the admin panel.

## 🛠️ Tech Stack

*   **Frontend**: React 18, TypeScript, Vite
*   **Styling**: Tailwind CSS, Framer Motion, Lucide React
*   **Backend / BaaS**: Firebase (Auth, Firestore, Storage, Realtime Database)
*   **AI**: Google Generative AI SDK, OpenAI SDK
*   **State & Logic**: Context API, React Router DOM
*   **Utilities**: date-fns, React Hook Form (implied), Recharts (charts)

## 🚀 Quick Start

### 1. Clone the Repo
```bash
git clone https://github.com/Coder69-ops/growbrandi.git
cd growbrandi
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
Create a `.env.local` file in the root directory and add your keys:
```env
# AI Configuration
VITE_GEMINI_API_KEY=your_gemini_key

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_DATABASE_URL=your_database_url
```

### 4. Run Development Server
```bash
npm run dev
```
Visit `http://localhost:5173` (Vite default) or the port shown in your terminal.

## 📦 Deployment

### Deploy to Vercel

The easiest way to deploy is with Vercel.

1.  Push your code to GitHub.
2.  Import the project into Vercel.
3.  Add all `VITE_` environment variables in the Vercel Project Settings.
4.  Deploy!

## 📂 Project Structure

```
src/
├── components/     # UI Components (Admin, Public, Shared)
├── pages/
│   ├── admin/      # Admin Dashboard (CMS, Chat, Settings)
│   └── ...         # Public pages (Home, Services, etc.)
├── lib/            # Firebase & Utility configurations
├── services/       # AI & Backend service layers
├── context/        # React Context (Auth, Theme, Toast)
├── types/          # TypeScript definitions
├── App.tsx         # Main Routing & Layout
└── main.tsx        # Entry point
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <p>Built with ❤️ by the GrowBrandi Team</p>
</div>
