// src/app/(user)/dashboard/_components/application-settings.tsx
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { MOCK_USER } from "@/data/mock-dashboard";
import { UserCircle, BellRing } from "lucide-react";

export function ApplicationSettings() {
    return (
        <div className="space-y-10">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-neutral-900">Application Settings</h2>
                <p className="text-sm text-neutral-500 mt-1">Manage your profile information and notification preferences.</p>
            </div>

            <div className="border border-neutral-200/60 bg-white rounded-2xl shadow-sm overflow-hidden">
                {/* Profile Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 border-b border-neutral-100">
                    <div className="md:col-span-1 space-y-2">
                        <div className="flex items-center gap-2 text-neutral-900 font-semibold">
                            <UserCircle className="w-5 h-5 text-indigo-500" />
                            <h3>Personal Information</h3>
                        </div>
                        <p className="text-sm text-neutral-500 leading-relaxed">
                            Update your personal details. Some fields are locked by your organization.
                        </p>
                    </div>
                    <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium text-neutral-700">Full Name</Label>
                            <Input
                                id="name"
                                defaultValue={MOCK_USER.name}
                                className="rounded-xl border-neutral-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-xs"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-neutral-700">Email Address</Label>
                            <Input
                                id="email"
                                defaultValue={MOCK_USER.email}
                                disabled
                                className="rounded-xl bg-neutral-50 border-neutral-200 text-neutral-500 shadow-xs cursor-not-allowed"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="hqid" className="text-sm font-medium text-neutral-700">HQID</Label>
                            <Input
                                id="hqid"
                                defaultValue={MOCK_USER.hqid}
                                disabled
                                className="font-mono text-sm rounded-xl bg-neutral-50 border-neutral-200 text-neutral-500 shadow-xs cursor-not-allowed"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="theme" className="text-sm font-medium text-neutral-700">Default Theme</Label>
                            <Input
                                id="theme"
                                defaultValue="Bright"
                                disabled
                                className="rounded-xl bg-neutral-50 border-neutral-200 text-neutral-500 shadow-xs cursor-not-allowed"
                            />
                        </div>
                    </div>
                </div>

                {/* Notifications Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
                    <div className="md:col-span-1 space-y-2">
                        <div className="flex items-center gap-2 text-neutral-900 font-semibold">
                            <BellRing className="w-5 h-5 text-indigo-500" />
                            <h3>Notifications</h3>
                        </div>
                        <p className="text-sm text-neutral-500 leading-relaxed">
                            Control how you want to be notified about workspace activities.
                        </p>
                    </div>
                    <div className="md:col-span-2 space-y-4">
                        {[
                            {
                                id: "push",
                                title: "Push Notifications",
                                desc: "Receive immediate notifications on your active device.",
                                defaultChecked: MOCK_USER.notifications.push
                            },
                            {
                                id: "email",
                                title: "Email Notifications",
                                desc: "Receive daily summaries and critical alerts via email.",
                                defaultChecked: MOCK_USER.notifications.email
                            },
                            {
                                id: "inApp",
                                title: "In-App Notifications",
                                desc: "Show badges and alert modules inside the dashboard.",
                                defaultChecked: MOCK_USER.notifications.inApp
                            }
                        ].map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-4 rounded-xl border border-neutral-200/60 hover:bg-neutral-50/50 transition-colors">
                                <div className="space-y-1 pr-4">
                                    <Label htmlFor={item.id} className="text-sm font-semibold text-neutral-900 cursor-pointer">{item.title}</Label>
                                    <p className="text-xs text-neutral-500">{item.desc}</p>
                                </div>
                                <Switch id={item.id} defaultChecked={item.defaultChecked} className="data-[state=checked]:bg-indigo-600" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}