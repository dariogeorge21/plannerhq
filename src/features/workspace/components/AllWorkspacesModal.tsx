'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { WorkspaceAvatar } from '@/components/ui/workspace-avatar';
import { WorkspaceListItem } from '@/features/workspace/workspace';
import { useRouter } from 'next/navigation';
import { formatRelativeTime } from '@/utils/date';

import {
    Search,
    Plus,
    ExternalLink,
    Users,
    Clock,
    X,
    Layers,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AllWorkspacesModalProps {
    isOpen: boolean;
    onClose: () => void;
    workspaces: WorkspaceListItem[];
    onCreateWorkspace: () => void;
}

export function AllWorkspacesModal({
    isOpen,
    onClose,
    workspaces,
    onCreateWorkspace,
}: AllWorkspacesModalProps) {
    const router = useRouter();
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Lock body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
            setSearchQuery('');
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    // Close on Escape
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [isOpen, onClose]);

    const filteredWorkspaces = useMemo(() => {
        if (!searchQuery.trim()) return workspaces;
        return workspaces.filter((ws) =>
            ws.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [workspaces, searchQuery]);

    const handleOpen = async (id: string) => {
        setLoadingId(id);
        await new Promise((resolve) => setTimeout(resolve, 300));
        router.push(`/${id}`);
    };




    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
                        onClick={onClose}
                        aria-hidden="true"
                    />

                    {/* Modal panel */}
                    <motion.div
                        key="panel"
                        role="dialog"
                        aria-modal="true"
                        aria-label="All Workspaces"
                        initial={{ opacity: 0, scale: 0.97, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.97, y: 16 }}
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60 shadow-[0_24px_72px_rgba(0,0,0,0.18)] rounded-3xl overflow-hidden pointer-events-auto">

                            {/* Navigation progress bar */}
                            <AnimatePresence>
                                {loadingId && (
                                    <motion.div
                                        initial={{ width: 0, opacity: 1 }}
                                        animate={{ width: '100%', opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 1.5, ease: 'easeInOut' }}
                                        className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 z-50"
                                    />
                                )}
                            </AnimatePresence>

                            {/* Header */}
                            <div className="flex items-center justify-between px-7 pt-6 pb-5 border-b border-neutral-100 dark:border-neutral-800 shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-2xl bg-indigo-50 dark:bg-indigo-900/40 flex items-center justify-center">
                                        <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                                            All Workspaces
                                        </h2>
                                        <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-none mt-0.5">
                                            {workspaces.length} workspace{workspaces.length !== 1 ? 's' : ''} total
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button
                                        onClick={onCreateWorkspace}
                                        className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm h-9 px-4 text-sm font-semibold"
                                    >
                                        <Plus className="w-4 h-4 mr-1.5" />
                                        New Workspace
                                    </Button>
                                    <button
                                        onClick={onClose}
                                        aria-label="Close"
                                        className="w-9 h-9 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:hover:text-neutral-200 transition-colors"
                                    >
                                        <X className="w-4.5 h-4.5" />
                                    </button>
                                </div>
                            </div>

                            {/* Search */}
                            <div className="px-7 py-4 border-b border-neutral-100 dark:border-neutral-800 shrink-0">
                                <div className="relative max-w-sm">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                    <Input
                                        id="workspace-search"
                                        placeholder="Search workspaces..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 rounded-xl border-neutral-200 dark:border-neutral-700 bg-neutral-50/80 dark:bg-neutral-800/50 h-9 text-sm focus-visible:ring-indigo-500"
                                    />
                                </div>
                            </div>

                            {/* List */}
                            <div className="flex-1 overflow-y-auto px-7 py-4">
                                {filteredWorkspaces.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-16 text-center">
                                        <div className="w-14 h-14 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
                                            <Layers className="w-7 h-7 text-neutral-400" />
                                        </div>
                                        <p className="text-neutral-500 dark:text-neutral-400 text-sm font-medium">
                                            {searchQuery ? 'No workspaces match your search.' : 'You have no workspaces yet.'}
                                        </p>
                                        {!searchQuery && (
                                            <Button
                                                onClick={onCreateWorkspace}
                                                variant="outline"
                                                className="mt-5 rounded-full h-9 px-5 text-sm"
                                            >
                                                <Plus className="w-4 h-4 mr-2" />
                                                Create your first workspace
                                            </Button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <div className="min-w-[640px]">
                                            {/* Column headers */}
                                            <div className="grid grid-cols-12 gap-4 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 border-b border-neutral-100 dark:border-neutral-800">
                                                <div className="col-span-1">#</div>
                                                <div className="col-span-4">Workspace</div>
                                                <div className="col-span-2">Role</div>
                                                <div className="col-span-2">Members</div>
                                                <div className="col-span-2">Last Active</div>
                                                <div className="col-span-1 text-right">Actions</div>
                                            </div>

                                            {/* Rows */}
                                            {filteredWorkspaces.map((ws, index) => (
                                                <motion.div
                                                    key={ws.id}
                                                    initial={{ opacity: 0, y: 4 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.03 }}
                                                    className={`grid grid-cols-12 gap-4 px-4 py-3 items-center border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors group rounded-xl cursor-pointer ${ws.is_archived ? 'opacity-60' : ''}`}
                                                    onClick={() => handleOpen(ws.id)}
                                                >
                                                    {/* # */}
                                                    <div className="col-span-1 text-sm text-neutral-400 tabular-nums">
                                                        {index + 1}
                                                    </div>

                                                    {/* Workspace */}
                                                    <div className="col-span-4 flex items-center gap-3 min-w-0">
                                                        <WorkspaceAvatar
                                                            workspace={{ name: ws.name, avatar_url: ws.avatar_url }}
                                                            className="w-9 h-9 rounded-xl flex-shrink-0 shadow-sm"
                                                        />
                                                        <div className="truncate">
                                                            <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
                                                                {ws.name}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Role */}
                                                    <div className="col-span-2" onClick={(e) => e.stopPropagation()}>
                                                        {ws.is_archived ? (
                                                            <Badge
                                                                variant="destructive"
                                                                className="text-[10px] uppercase tracking-wider rounded-md px-2 py-0.5 bg-red-100/50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border-none font-bold shadow-none"
                                                            >
                                                                Archived
                                                            </Badge>
                                                        ) : (
                                                            <Badge
                                                                variant="outline"
                                                                className="capitalize text-xs rounded-full px-2.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 font-medium"
                                                            >
                                                                {ws.role}
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    {/* Members */}
                                                    <div className="col-span-2 flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400">
                                                        <Users className="w-3.5 h-3.5" />
                                                        <span>{ws.memberCount}</span>
                                                    </div>

                                                    {/* Last Active */}
                                                    <div className="col-span-2 flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        <span>{formatRelativeTime(ws.lastActive)}</span>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="col-span-1 flex justify-end" onClick={(e) => e.stopPropagation()}>
                                                        {/* Only button for opening the workspace */}
                                                        <Button 
                                                            variant={ws.is_archived ? "secondary" : "default"}
                                                            onClick={() => handleOpen(ws.id)} 
                                                            disabled={loadingId === ws.id} 
                                                            className="gap-2 cursor-pointer h-8 px-3"
                                                        >
                                                            {ws.is_archived ? (
                                                                <span className="text-xs">View</span>
                                                            ) : (
                                                                <><ExternalLink className="w-3.5 h-3.5" /> <span className="text-xs">Open</span></>
                                                            )}
                                                        </Button>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="px-7 py-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between shrink-0 bg-neutral-50/60 dark:bg-neutral-900/60">
                                <p className="text-xs text-neutral-400">
                                    {filteredWorkspaces.length} of {workspaces.length} workspace{workspaces.length !== 1 ? 's' : ''}
                                </p>
                                <Button
                                    variant="ghost"
                                    onClick={onClose}
                                    className="h-8 px-4 rounded-xl text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                                >
                                    Close
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}