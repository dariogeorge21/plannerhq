# CLAUDE.md

## Project Overview

PlannerHQ is a modern collaborative workspace and project management platform inspired by Notion, ClickUp, and Coda.

The platform enables users to:

- Create and manage multiple workspaces
- Create pages/sheets inside workspaces
- Manage tasks and projects
- Collaborate with multiple team members
- Edit rich content using a block-based editor
- Receive real-time updates and notifications
- Upload and manage files
- Use AI-powered productivity features
- Switch between multiple workspace views (List, Board, Calendar, etc.)

---

# Technology Stack

## Frontend

- Next.js App Router
- React
- TypeScript
- TailwindCSS
- Shadcn UI
- TanStack Query

## Backend

- Supabase
  - PostgreSQL
  - Auth
  - Realtime
  - Storage
  - Edge Functions

## Authentication

- NextAuth.js
- Google OAuth
- Supabase Auth

## Deployment

- Vercel
- Supabase

---

# Development Principles

## Architecture Rules

Follow:

- Feature-based architecture
- Domain-driven structure
- Reusable components
- Server Components by default
- Client Components only when necessary

Avoid:

- Massive page files
- Business logic inside JSX
- Duplicated API calls
- Repeated validation logic

---

# Folder Structure

src/

├── app/

├── components/

│ ├── ui/

│ ├── shared/

│ ├── dashboard/

│ ├── workspace/

│ ├── task/

│ ├── calendar/

│ ├── editor/

│ └── ai/

│

├── features/

│ ├── auth/

│ ├── workspace/

│ ├── project/

│ ├── task/

│ ├── calendar/

│ ├── editor/

│ ├── notification/

│ └── ai/

│

├── hooks/

├── lib/

├── services/

├── server/

├── store/

├── types/

├── constants/

├── utils/

└── validations/

---

# Coding Standards

## TypeScript

Always:

- Use strict typing
- Use interfaces for DTOs
- Use type aliases for unions
- Avoid any
- Prefer inferred return types when obvious

Bad:

```ts
const data: any = response;
```

Good:

```ts
const data: WorkspaceResponse = response;
```

---

## React

Prefer:

- Functional components
- Composition
- Custom hooks

Avoid:

- Prop drilling
- Large component files

If component exceeds 250 lines:

- Split into smaller components

---

## Server Components

Use Server Components whenever possible.

Only use:

```tsx
"use client";
```

when:

- state is required
- browser APIs are required
- event handlers are required

---

# Data Fetching

Use:

- Server Actions
- TanStack Query
- Supabase Server Client

Never:

- Fetch directly inside deeply nested components
- Duplicate queries

---

# State Management

Use:

### Local State

```ts
useState
```

### Server State

```ts
TanStack Query
```

### Global State

Only if necessary:

```ts
Zustand
```

---

# Database Rules

Use Supabase PostgreSQL.

Requirements:

- UUID primary keys
- Foreign keys
- Cascading rules
- Indexes
- Row Level Security

Example:

```sql
workspace_id UUID PRIMARY KEY
```

---

# Security Requirements

Must implement:

- Row Level Security
- Permission checks
- Role-based access control
- Secure file uploads
- Input validation
- Rate limiting

Never trust client-side permissions.

---

# Realtime Features

Use Supabase Realtime for:

- Task updates
- Workspace activity
- Notifications
- Presence indicators
- Collaborative editing events

---

# AI Features

AI should assist users with:

- Task creation
- Project planning
- Content generation
- Meeting summaries
- Workspace insights

AI responses must:

- Be contextual
- Be explainable
- Never modify data without confirmation

---

# UI/UX Guidelines

Follow:

- Clean workspace-focused design
- Responsive layouts
- Accessible components
- Keyboard navigation
- Consistent spacing

Use Shadcn UI first before creating custom components.

---

# Testing

Generate:

- Unit tests
- Integration tests
- API tests

Use:

- Vitest
- React Testing Library

Critical flows:

- Authentication
- Workspace permissions
- Task management
- File uploads
- AI actions

---

# Performance Targets

- First Load < 2s
- Lighthouse > 90
- Minimal bundle size
- Optimistic UI updates

---

# Pull Request Requirements

Every PR should:

- Compile successfully
- Pass linting
- Pass tests
- Follow folder conventions
- Include proper typing

Never merge broken builds.

---

# Definition of Done

Feature is complete only when:

- UI implemented
- API implemented
- Validation implemented
- Permission checks implemented
- Loading states implemented
- Error states implemented
- Mobile responsive
- Tested