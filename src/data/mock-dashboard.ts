// src/data/mock-dashboard.ts

export type Workspace = {
    id: string;
    serial: number;
    name: string;
    lastAccessed: string;
    role: 'Owner' | 'Member';
};

export const MOCK_USER = {
    name: "Dario George",
    email: "dario@example.com",
    hqid: "HQ-98A4X2",
    theme: "bright",
    notifications: {
        push: true,
        email: false,
        inApp: true,
    },
    plan: {
        name: "Pro Plan",
        totalWorkspaces: 3,
        workspaceLimit: 10,
        joinedWorkspaces: 2,
        status: "Active",
        renewalDate: "2026-07-15"
    }
};

export const MOCK_WORKSPACES: Workspace[] = [
    { id: "1", serial: 1, name: "Alpha Project", lastAccessed: "2026-06-16T10:00:00Z", role: "Owner" },
    { id: "2", serial: 2, name: "Marketing Campaign", lastAccessed: "2026-06-15T14:30:00Z", role: "Member" },
    { id: "3", serial: 3, name: "Q3 Roadmap", lastAccessed: "2026-06-10T09:15:00Z", role: "Owner" },
].sort((a, b) => new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime()); // DESCENDING SORT