// src/app/(user)/dashboard/_components/kpi-metrics.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_USER } from "@/data/mock-dashboard";
import { Layout, Users, Zap } from "lucide-react";
import { motion, Variants } from "framer-motion";

const container: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const item: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export function KpiMetrics() {
    const { plan } = MOCK_USER;

    const metrics = [
        {
            title: "Total Workspaces",
            value: `${plan.totalWorkspaces} / ${plan.workspaceLimit}`,
            subtitle: "Created under your current plan",
            icon: Layout,
            trend: "Active"
        },
        {
            title: "Joined Workspaces",
            value: plan.joinedWorkspaces.toString(),
            subtitle: "Workspaces you collaborate in",
            icon: Users,
            trend: "Collaborating"
        },
        {
            title: "Current Plan",
            value: plan.name,
            subtitle: `Status: ${plan.status}`,
            icon: Zap,
            trend: plan.status
        }
    ];

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-4 md:grid-cols-3"
        >
            {metrics.map((metric, i) => (
                <motion.div key={i} variants={item}>
                    <Card className="relative overflow-hidden border border-neutral-200/60 bg-white/50 backdrop-blur-xl shadow-sm hover:shadow-md transition-all duration-200 group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                            <metric.icon className="w-16 h-16 text-indigo-600" />
                        </div>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-semibold text-neutral-600">
                                {metric.title}
                            </CardTitle>
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                <metric.icon className="w-4 h-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold tracking-tight text-neutral-900 mt-1">
                                {metric.value}
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${metric.trend.toLowerCase() === 'active' ? 'bg-emerald-50 text-emerald-700' :
                                    'bg-indigo-50 text-indigo-700'
                                    }`}>
                                    {metric.trend}
                                </span>
                                <p className="text-xs font-medium text-neutral-500">
                                    {metric.subtitle}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </motion.div>
    );
}