// src/app/(user)/dashboard/_components/application-settings.tsx
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MOCK_USER } from "@/data/mock-dashboard";

export function ApplicationSettings() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Application Settings</CardTitle>
                <CardDescription>Manage your profile and preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">

                {/* Profile Settings */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Profile</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" defaultValue={MOCK_USER.name} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" defaultValue={MOCK_USER.email} disabled className="bg-muted" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="hqid">HQID</Label>
                            <Input id="hqid" defaultValue={MOCK_USER.hqid} disabled className="font-mono bg-muted" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="theme">Default Theme</Label>
                            <Input id="theme" defaultValue="Bright" disabled className="bg-muted" />
                        </div>
                    </div>
                </div>

                {/* Notification Preferences */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Notification Preferences</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="space-y-0.5">
                                <Label className="text-base">Push Notifications</Label>
                                <p className="text-sm text-muted-foreground">Receive notifications on your device.</p>
                            </div>
                            <Switch defaultChecked={MOCK_USER.notifications.push} />
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="space-y-0.5">
                                <Label className="text-base">Email Notifications</Label>
                                <p className="text-sm text-muted-foreground">Receive daily summaries via email.</p>
                            </div>
                            <Switch defaultChecked={MOCK_USER.notifications.email} />
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="space-y-0.5">
                                <Label className="text-base">In-App Notifications</Label>
                                <p className="text-sm text-muted-foreground">Show badges and alerts inside the app.</p>
                            </div>
                            <Switch defaultChecked={MOCK_USER.notifications.inApp} />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}