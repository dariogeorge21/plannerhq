# PlannerHQ

PlannerHQ is a production-grade collaborative workspace platform designed to unify your team's workflow. It combines Notion-style rich text documents, ClickUp-style project and task management, integrated calendar planning, real-time collaboration, and AI-powered productivity tools into a single, cohesive application.

## 🌟 Core Features

### 🏢 Workspace Management
- **Centralized Workspaces:** Create and manage distinct workspaces for different teams or organizations.
- **Role-Based Access Control (RBAC):** Granular permission settings with distinct roles (Admin, Member, Guest).
- **Member Management:** Seamless invitation system and workspace settings configuration.

### 📊 Project & Task Tracking
- **Project Organization:** Group tasks into projects with custom statuses and progress tracking.
- **Advanced Task Management:** Create tasks, subtasks, set priorities, and assign them to team members.
- **Deadline Tracking:** Robust deadline management system to ensure timely project delivery.

### 📝 Collaborative Documents (Editor)
- **Rich Text Editing:** Powerful block-based editor powered by Tiptap.
- **Real-Time Collaboration:** Work together simultaneously with live cursors and updates using Yjs and Supabase Realtime.
- **Autosave & History:** Never lose your work with robust state management.

### 📅 Calendar & Scheduling
- **Unified Views:** Visualize tasks, project deadlines, and events across various calendar views.
- **Timeline Rendering:** Interactive timelines for long-term project planning and scheduling.

### 💬 Communication & Notifications
- **Real-Time Alerts:** In-app notification center for mentions, assignments, and updates.
- **Activity Feeds:** Keep track of changes and progress across your workspace.
- **Integrated Chat:** Contextual communication right where the work happens.

### 📁 File Management
- **Secure Storage:** Upload, organize, and attach files to tasks and documents.
- **Asset Management:** Centralized repository for project-related media and resources.

### 💳 Billing & Subscriptions
- **Usage Tracking:** Granular tracking of user and workspace resource consumption.
- **Subscription Management:** Tiered plans and billing integration for premium features.

## 🛠️ Technology Stack

PlannerHQ is built with a modern, scalable, and highly performant tech stack:

- **Framework:** [Next.js](https://nextjs.org/) (App Router, React 19)
- **Backend & Database:** [Supabase](https://supabase.com/) (PostgreSQL, Auth, Storage, Edge Functions, Realtime)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & Radix UI
- **State Management & Data Fetching:** React Query (`@tanstack/react-query`)
- **Rich Text Editor:** Tiptap & Yjs for real-time sync
- **Authentication:** Supabase Auth (SSR configured)
- **Icons:** Lucide React & Hugeicons

## 🚀 Getting Started

### Prerequisites
- Node.js (v20+ recommended)
- npm, yarn, pnpm, or bun
- A Supabase project (for database, auth, and storage)

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
   Create a `.env.local` file in the root directory and add your Supabase credentials and other required variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   # Add other required environment variables...
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Architecture & Development Standards

PlannerHQ follows strict architectural guidelines to ensure scalability and maintainability:

- **Feature-Based Architecture:** Code is organized by feature domains in the `src/features` directory (e.g., `auth`, `workspace`, `task`, `calendar`, `editor`).
- **Separation of Concerns:** Business logic is strictly separated from UI components, residing in custom hooks and service layers.
- **Type Safety:** TypeScript is heavily enforced; the use of `any` is strictly prohibited.
- **Security First:** All database interactions are protected via Supabase Row Level Security (RLS). Authorization and validation are always verified on the server.
- **Performance Optimized:** Utilization of pagination, optimistic updates, and caching mechanisms to ensure a snappy user experience.

---
*Developed with a focus on maintainability, scalability, security, and exceptional user experience.*
