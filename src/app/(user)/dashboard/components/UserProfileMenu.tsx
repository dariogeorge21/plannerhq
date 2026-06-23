// features/dashboard/components/UserProfileMenu.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User, Settings, CreditCard, LogOut } from 'lucide-react';
import { signOut } from '@/app/api/auth';
import { deleteCookie } from '@/utils/session';
import { toast } from 'sonner';
import { LogoutConfirmationDialog } from './LogoutConfirmationDialog';

import { AuthUser } from '@/types/auth';

interface UserProfileMenuProps {
    user: AuthUser;
}

export function UserProfileMenu({ user }: UserProfileMenuProps) {
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const router = useRouter();

    const handleLogout = async () => {
        const res = await signOut();
        if (res.success) {
            deleteCookie('plannerhq_last_activity');
            toast.success('Logged out successfully');
            router.push('/signin');
        } else {
            toast.error(res.message || 'Logout failed');
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors p-1 pr-3">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatarUrl} />
                            <AvatarFallback className="bg-indigo-100 text-indigo-700 font-semibold text-sm">
                                {user.displayName?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="hidden sm:block text-left text-sm">
                            <p className="font-medium leading-none text-neutral-900 dark:text-white">{user.displayName}</p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">{user.email}</p>
                        </div>
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push('/profile')}>
                        <User className="mr-2 h-4 w-4" /> Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/settings')}>
                        <Settings className="mr-2 h-4 w-4" /> Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/billing')}>
                        <CreditCard className="mr-2 h-4 w-4" /> Billing
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600" onClick={() => setShowLogoutDialog(true)}>
                        <LogOut className="mr-2 h-4 w-4" /> Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <LogoutConfirmationDialog
                open={showLogoutDialog}
                onOpenChange={setShowLogoutDialog}
                onConfirm={handleLogout}
            />
        </>
    );
}