// src/app/(user)/dashboard/_components/dashboard-breadcrumbs.tsx
import { 
    Breadcrumb, 
    BreadcrumbItem, 
    BreadcrumbLink, 
    BreadcrumbList, 
    BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { ChevronRight } from "lucide-react";

export function DashboardBreadcrumbs() {
    return (
        <div className="w-full bg-transparent px-6 py-4">
            <Breadcrumb>
                <BreadcrumbList className="flex items-center space-x-1 sm:space-x-2 text-sm text-neutral-500">
                    <BreadcrumbItem>
                        <BreadcrumbLink 
                            href="/dashboard" 
                            className="font-medium hover:text-neutral-900 transition-colors"
                        >
                            Dashboard
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    {/* Add more items here natively using Shadcn patterns as the app grows */}
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    );
}