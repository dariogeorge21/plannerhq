<div align="center">
  <img src="public/logo.png" alt="PlannerHQ Logo" width="80" height="80" />
  <h1 align="center">PlannerHQ</h1>
  <p align="center">
    <strong>A production-grade collaborative workspace platform designed to unify your team's workflow.</strong>
  </p>
  <p align="center">
    <a href="#-core-features">Features</a> •
    <a href="#%EF%B8%8F-technology-stack">Tech Stack</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-architecture--development-standards">Architecture</a>
  </p>
</div>

---

PlannerHQ combines Notion-style rich text documents, ClickUp-style project and task management, integrated calendar planning, real-time collaboration, and AI-powered productivity tools into a single, cohesive application.

## ✨ Why PlannerHQ?

- **All-in-One Workspace**: Stop context switching. Keep your tasks, docs, and calendars in one place.
- **Real-Time Collaboration**: See exactly what your team is typing or updating in real-time.
- **AI-Powered**: Smart insights and content generation to speed up your workflow.
- **Enterprise-Ready**: Role-based access control, secure storage, and detailed activity logs.

## 🌟 Core Features

### 🏢 Workspace Management
- **Centralized Workspaces:** Create and manage distinct workspaces for different teams or organizations.
- **Role-Based Access Control (RBAC):** Granular permission settings with distinct roles (Owner, Admin, Member, Guest).
- **Member Management:** Seamless invitation system and robust workspace settings configuration.

### 📊 Project & Task Tracking
- **Project Organization:** Group tasks into projects with custom statuses and progress tracking.
- **Advanced Task Management:** Create tasks, subtasks, set priorities, and assign them to team members.
- **Deadline Tracking:** Robust deadline management system to ensure timely project delivery.

### 📝 Collaborative Documents
- **Rich Text Editing:** Powerful block-based editor powered by Tiptap.
- **Real-Time Collaboration:** Work together simultaneously with live cursors and updates using Yjs and Supabase Realtime.
- **Autosave & History:** Never lose your work with robust state management and document versioning.

### 📅 Calendar & Scheduling
- **Unified Views:** Visualize tasks, project deadlines, and events across various calendar views.
- **Timeline Rendering:** Interactive timelines for long-term project planning and scheduling.

### 💬 Communication & Notifications
- **Real-Time Alerts:** In-app notification center for mentions, assignments, and updates.
- **Activity Feeds:** Keep track of changes and progress across your workspace.
- **Integrated Chat:** Contextual communication right where the work happens.

### 📁 File & Asset Management
- **Secure Storage:** Upload, organize, and attach files securely to tasks and documents.
- **Asset Repository:** Centralized repository for project-related media and resources.

## 🛠️ Technology Stack

PlannerHQ is built with a modern, scalable, and highly performant tech stack to deliver a premium user experience.

| Category | Technologies |
| :--- | :--- |
| **Framework** | Next.js (App Router, React 19) |
| **Backend & Database** | Supabase (PostgreSQL, Auth, Storage, Edge Functions, Realtime) |
| **Styling & UI** | Tailwind CSS, Radix UI, Framer Motion |
| **State Management** | React Query (`@tanstack/react-query`), Zustand |
| **Rich Text Editor** | Tiptap, Yjs (for real-time sync) |
| **Icons** | Lucide React, Hugeicons |

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v20+ recommended)
- `npm`, `yarn`, `pnpm`, or `bun`
- A [Supabase](https://supabase.com/) project (for database, auth, and storage)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd plannerhq
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env.local` file in the root directory and add your Supabase credentials.
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   GROQ_API_KEY=your_groq_api_key
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 🏗️ Architecture & Development Standards

PlannerHQ follows strict architectural guidelines to ensure scalability and maintainability:

- **Feature-Based Architecture:** Code is meticulously organized by feature domains in the `src/features` directory (e.g., `auth`, `workspace`, `task`, `calendar`, `editor`).
- **Separation of Concerns:** Business logic is strictly separated from UI components, residing in custom hooks and service layers.
- **Type Safety First:** TypeScript is heavily enforced; the use of `any` is strictly prohibited.
- **Security & Permissions:** All database interactions are protected via Supabase Row Level Security (RLS). Authorization and validation are always verified on the server.
- **Performance Optimized:** Utilization of pagination, optimistic updates, and caching mechanisms to ensure a snappy user experience.
- **Design Excellence:** Focuses on dynamic animations, responsive design, and glassmorphism elements to provide a premium SaaS feel.

---
*Developed with a focus on maintainability, scalability, security, and an exceptional user experience.*
