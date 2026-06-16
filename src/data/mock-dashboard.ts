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
