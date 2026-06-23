// features/dashboard/components/NotificationCenter.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

// Mock notifications (replace with real data)
const mockNotifications = [
    { id: '1', type: 'mention', message: 'Alex mentioned you in a task.', read: false, timestamp: new Date(Date.now() - 1000 * 60 * 5) },
    { id: '2', type: 'assignment', message: 'You were assigned to "Design Review".', read: true, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) },
    { id: '3', type: 'invite', message: 'You have a pending invite to "Marketing Team".', read: false, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) },
    { id: '4', type: 'update', message: 'Task "Finalize budget" was completed.', read: false, timestamp: new Date(Date.now() - 1000 * 60 * 10) },
];

export function NotificationCenter() {
    const [notifications, setNotifications] = useState(mockNotifications);
    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative rounded-full">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[18px] h-[18px] text-[10px] bg-red-500 text-white border-2 border-white">
                            {unreadCount}
                        </Badge>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0" sideOffset={8}>
                <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-700">
                    <h4 className="font-semibold">Notifications</h4>
                    <Button variant="ghost" size="sm" className="text-xs text-indigo-600">Mark all read</Button>
                </div>
                <ScrollArea className="max-h-80">
                    {notifications.length === 0 ? (
                        <div className="p-6 text-center text-neutral-500">All caught up!</div>
                    ) : (
                        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                            {notifications.slice(0, 4).map((n) => (
                                <div key={n.id} className={`p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer ${!n.read ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''}`} onClick={() => markAsRead(n.id)}>
                                    <div className="flex items-start gap-3">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-neutral-900 dark:text-white">{n.message}</p>
                                            <p className="text-xs text-neutral-500 mt-0.5">{formatDistanceToNow(n.timestamp, { addSuffix: true })}</p>
                                        </div>
                                        {!n.read && <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-1.5" />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
                <div className="p-3 border-t border-neutral-200 dark:border-neutral-700">
                    <Button variant="outline" size="sm" className="w-full text-sm" asChild>
                        <Link href="/notifications">View all notifications</Link>
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}