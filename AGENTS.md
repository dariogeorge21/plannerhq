# AGENTS.md

# PlannerHQ AI Agent Instructions

This document defines how AI coding agents should operate when contributing to PlannerHQ.

---

# Project Mission

Build a production-grade collaborative workspace platform combining:

- Notion-style pages
- ClickUp-style project management
- Calendar planning
- Real-time collaboration
- AI productivity tools

The application should be scalable, maintainable, secure, and developer-friendly.

---

# Agent Objectives

When implementing features:

1. Prioritize maintainability
2. Prioritize scalability
3. Prioritize security
4. Prioritize performance
5. Prioritize developer experience

Never optimize for speed of coding at the expense of architecture.

---

# Core Rules

## Rule 1

Never place business logic inside UI components.

Move logic into:

- hooks
- services
- feature functions

---

## Rule 2

Never use any.

Always create types.

Bad:

```ts
const user: any
```

Good:

```ts
const user: User
```

---

## Rule 3

Never duplicate code.

Extract reusable:

- hooks
- services
- components
- utilities

---

## Rule 4

Keep files focused.

Recommended limits:

- Components < 250 lines
- Hooks < 200 lines
- Services < 300 lines

Refactor when exceeded.

---

# Architecture Responsibilities

---

## Auth Agent

Responsible for:

- Login
- Signup
- Session management
- OAuth
- Permissions

Directories:

```txt
features/auth
```

Must enforce:

- RBAC
- Workspace permissions
- Protected routes

---

## Workspace Agent

Responsible for:

- Workspace CRUD
- Members
- Invitations
- Roles
- Settings

Directories:

```txt
features/workspace
```

---

## Project Agent

Responsible for:

- Projects
- Status tracking
- Progress reporting

Directories:

```txt
features/project
```

---

## Task Agent

Responsible for:

- Tasks
- Subtasks
- Assignments
- Priorities
- Deadlines

Directories:

```txt
features/task
```

---

## Calendar Agent

Responsible for:

- Calendar views
- Scheduling
- Timeline rendering
- Date management

Directories:

```txt
features/calendar
```

---

## Editor Agent

Responsible for:

- Rich text editor
- Block system
- Collaborative editing
- Autosave

Directories:

```txt
features/editor
```

Preferred technologies:

- Tiptap
- Yjs
- Supabase Realtime

---

## Notification Agent

Responsible for:

- Realtime alerts
- Inbox
- Mentions
- Activity feed

Directories:

```txt
features/notification
```

---

## AI Agent

Responsible for:

- OpenAI integration
- Prompt management
- AI actions
- Workspace insights

Directories:

```txt
features/ai
```

Rules:

- Never expose API keys
- Validate all AI outputs
- Require confirmation before mutations

---

# Database Standards

All tables must include:

```sql
id UUID PRIMARY KEY
created_at TIMESTAMP
updated_at TIMESTAMP
```

Use:

- Foreign keys
- Constraints
- Indexes

Enable:

```sql
RLS
```

for every table.

---

# API Standards

Use:

```txt
app/api
```

or

```txt
Supabase Edge Functions
```

Response format:

```json
{
  "success": true,
  "data": {},
  "message": "Success"
}
```

Error format:

```json
{
  "success": false,
  "message": "Error description"
}
```

---

# Security Checklist

Every feature must verify:

- Authentication
- Authorization
- Ownership
- Input validation
- File validation

Never trust:

- client roles
- client IDs
- client permissions

Always verify on server.

---

# Realtime Standards

Use realtime only when necessary.

Suitable:

- Notifications
- Presence
- Task updates
- Collaborative editing

Avoid realtime for:

- Static data
- Rare updates

---

# Performance Guidelines

Always:

- Use pagination
- Use lazy loading
- Use optimistic updates
- Use caching

Avoid:

- N+1 queries
- Overfetching
- Large client bundles

---

# Testing Requirements

Generate tests for:

## Unit

- Hooks
- Utilities
- Services

## Integration

- API routes
- Database operations

## E2E

Critical flows:

- Authentication
- Workspace creation
- Task management
- Collaboration

---

# Accessibility Requirements

Must support:

- Keyboard navigation
- Screen readers
- Focus management
- Proper labels

Target:

WCAG AA

---

# Mobile Requirements

All features must work on:

- Desktop
- Tablet
- Mobile

Mobile-first responsive design preferred.

---

# AI Code Generation Rules

Before generating code:

1. Check existing patterns
2. Reuse existing utilities
3. Reuse existing components
4. Reuse existing hooks

Do not introduce a new pattern if one already exists.

---

# Feature Development Workflow

1. Create types
2. Create validation
3. Create service layer
4. Create API layer
5. Create hooks
6. Create UI
7. Add tests
8. Add loading states
9. Add error states
10. Verify permissions

Only then mark complete.

---

# Definition of Done

A task is complete only when:

- Architecture respected
- Types added
- Validation added
- Tests added
- Security verified
- Mobile responsive
- Accessibility verified
- No lint errors
- No TypeScript errors
- Production ready