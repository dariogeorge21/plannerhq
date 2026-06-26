// features/dashboard/components/UserProfileMenu.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Settings, CreditCard, LogOut } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { signOut } from '@/app/api/auth';
import { deleteCookie } from '@/utils/session';
import { toast } from 'sonner';
import { LogoutConfirmationDialog } from './LogoutConfirmationDialog';
import { AuthUser } from '@/types/auth';
import { HoverDropdown } from './HoverDropdown';

interface UserProfileMenuProps {
  user: AuthUser;
}

export function UserProfileMenu({ user }: UserProfileMenuProps) {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const res = await signOut();
    if (res.success) {
      deleteCookie('plannerhq_last_activity');
      toast.success('Logged out successfully');
      router.push('/signin');
    } else {
      toast.error(res.message || 'Logout failed');
    }
    setIsLoggingOut(false);
    setShowLogoutDialog(false);
  };

  const trigger = (
    <div className="flex items-center gap-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors p-1 pr-3 cursor-pointer">
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
    </div>
  );

  const dropdown = (
    <div className="w-56">
      <div className="flex items-center gap-3 px-2 py-3 border-b border-neutral-200/70 dark:border-neutral-700/70">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.avatarUrl} />
          <AvatarFallback className="bg-indigo-100 text-indigo-700 font-semibold">
            {user.displayName?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">{user.displayName}</p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{user.email}</p>
          <p className="text-xs text-neutral-400 dark:text-neutral-500">HQID: {user.hqid || 'N/A'}</p>
        </div>
      </div>
      <div className="py-1">
        <button
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800 transition-colors"
          onClick={() => router.push('/profile')}
        >
          <User className="w-4 h-4" /> My Account
        </button>
        <button
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800 transition-colors"
          onClick={() => router.push('/settings')}
        >
          <Settings className="w-4 h-4" /> Settings
        </button>
        <button
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800 transition-colors"
          onClick={() => router.push('/billing')}
        >
          <CreditCard className="w-4 h-4" /> Billing
        </button>
        <div className="my-1 border-t border-neutral-200/70 dark:border-neutral-700/70" />
        <button
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
          onClick={() => setShowLogoutDialog(true)}
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      <HoverDropdown trigger={trigger} dropdown={dropdown} align="end" />
      <LogoutConfirmationDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        onConfirm={handleLogout}
        isLoggingOut={isLoggingOut}
      />
    </>
  );
}