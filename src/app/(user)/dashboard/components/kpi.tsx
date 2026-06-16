// src/app/(user)/dashboard/_components/kpi-metrics.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_USER } from "@/data/mock-dashboard";

export function KpiMetrics() {
    const { plan } = MOCK_USER;

    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Workspaces</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{plan.totalWorkspaces} / {plan.workspaceLimit}</div>
                    <p className="text-xs text-muted-foreground">Created under your current plan</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Joined Workspaces</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{plan.joinedWorkspaces}</div>
                    <p className="text-xs text-muted-foreground">Workspaces you collaborate in</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{plan.name}</div>
                    <p className="text-xs text-muted-foreground">Status: {plan.status}</p>
                </CardContent>
            </Card>
        </div>
    );
}