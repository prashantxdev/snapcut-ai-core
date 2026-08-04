<p align="center">
  <img src="docs/logo.png" width="140" alt="SnapCut AI Logo">
</p>

<h1 align="center">✂️ SnapCut AI</h1>

<p align="center">
  <b>Remove image backgrounds in one click</b> with subpixel accuracy powered by state-of-the-art neural networks.
</p>

<p align="center">
  <a href="https://snapcut-ai-core.vercel.app">
    <img src="https://img.shields.io/badge/🚀_Live_Demo-Visit_Website-6C63FF?style=for-the-badge" alt="Live Demo">
  </a>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#license">License</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19">
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/TanStack_Router-FF4154?style=for-the-badge&logo=tanstack&logoColor=white" alt="TanStack Router">
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4">
  <img src="https://img.shields.io/badge/Supabase-Database_%26_Auth-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase">
  <img src="https://img.shields.io/badge/Vite-Fast_Build-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
</p>

---

## 📸 Application Previews

Explore the modern interface of SnapCut AI, including the landing page, user dashboard, and AI-powered background removal workspace.

<div align="center">

### 🌟 Landing Page
<a href="docs/screenshots/hero-preview.png">
  <img src="docs/screenshots/hero-preview.png" alt="Landing Page">
</a>

<br/>

| 📊 User Dashboard | ✂️ Background Removal Studio |
| :---: | :---: |
| <a href="docs/screenshots/dashboard-preview.jpg"><img src="docs/screenshots/dashboard-preview.jpg" alt="User Dashboard"></a> | <a href="docs/screenshots/removal-preview.jpg"><img src="docs/screenshots/removal-preview.jpg" alt="Background Removal Studio"></a> |

</div>

---

<a id="features"></a>
## ✨ Features

- 🎯 **One-Click Background Removal**: Subpixel-accurate cutouts delivering transparent PNGs in seconds.
- ⚡ **High Performance Studio**: Drag & drop workflow with real-time before/after comparison view.
- 📊 **Usage Telemetry & Quota**: Built-in daily free image quotas (5/day) and paid credit token tracking.
- 🛡️ **Secure Authentication & RLS**: Enterprise-grade access control backed by Supabase Auth & SQL Row Level Security.
- 🎨 **Modern Dark Aesthetic**: Sleek glassmorphism UI built with Tailwind CSS v4 and Framer Motion micro-animations.

---

<a id="tech-stack"></a>
## 🛠️ Tech Stack

- **Frontend Core**: React 19, TypeScript 5.8
- **Routing & State**: TanStack Router, TanStack Query
- **Styling & UI**: Tailwind CSS v4, Radix UI Primitives, Lucide Icons, Framer Motion
- **Backend & Auth**: Supabase (PostgreSQL, Storage, Auth, Edge Functions & RLS Policies)
- **Build Tool**: Vite 8

---

<a id="quick-start"></a>
## 🚀 Quick Start

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/prashantxdev/snapcut-ai-core.git
cd snapcut-ai-core
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Set Up Environment Variables
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4️⃣ Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

<a id="license"></a>
## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
