'use client';

import { useState, useMemo } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { WorkspaceAvatar } from '@/components/ui/workspace-avatar';
import { WorkspaceListItem } from '@/features/workspace/workspace';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
    Loader2,
    Search,
    Plus,
    MoreVertical,
    ExternalLink,
    Archive,
    Users,
    Clock,
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

    const filteredWorkspaces = useMemo(() => {
        if (!searchQuery.trim()) return workspaces;
        return workspaces.filter((ws) =>
            ws.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [workspaces, searchQuery]);

    const handleOpen = async (id: string) => {
        setLoadingId(id);
        // Simulate navigation delay (optional)
        await new Promise((resolve) => setTimeout(resolve, 300));
        router.push(`/${id}`);
    };

    const handleArchive = (id: string, name: string) => {
        // In a real app, call an API to archive
        toast.info(`Archiving "${name}"...`, {
            description: 'This workspace will be moved to archive.',
            action: {
                label: 'Undo',
                onClick: () => toast.success('Archive cancelled.'),
            },
        });
        // Simulate archive (remove from list? We'll just show a toast for now)
        // In a real implementation, you'd call a mutation and refresh the list.
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-7xl p-0 overflow-hidden bg-white/90 dark:bg-neutral-900/90 backdrop-blur-2xl border-neutral-200/60 dark:border-neutral-800/60 shadow-[0_20px_60px_rgba(0,0,0,0.15)] rounded-3xl max-h-[90vh] flex flex-col">
                {/* Loading progress bar */}
                <AnimatePresence>
                    {loadingId && (
                        <motion.div
                            initial={{ width: 0, opacity: 1 }}
                            animate={{ width: '100%', opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.5, ease: 'easeInOut' }}
                            className="absolute top-0 left-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 z-50"
                        />
                    )}
                </AnimatePresence>

                {/* Header */}
                <DialogHeader className="p-6 pb-0 border-b border-neutral-100 dark:border-neutral-800 flex flex-row items-center justify-between space-y-0">
                    <div>
                        <DialogTitle className="text-2xl font-bold tracking-tight">
                            All Workspaces
                        </DialogTitle>
                        <DialogDescription>
                            Manage and switch between your workspaces.
                        </DialogDescription>
                    </div>
                    <Button
                        onClick={onCreateWorkspace}
                        variant="default"
                        className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                    >
                        <Plus className="w-4 h-4 mr-2" /> New Workspace
                    </Button>
                </DialogHeader>

                {/* Search & Toolbar */}
                <div className="p-6 border-b border-neutral-100 dark:border-neutral-800">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        <Input
                            placeholder="Search workspaces..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 rounded-xl border-neutral-200 dark:border-neutral-700 bg-white/50 dark:bg-neutral-800/50 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                {/* List Area */}
                <div className="flex-1 overflow-auto p-6 pt-4">
                    {filteredWorkspaces.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-neutral-400 dark:text-neutral-500">
                                {searchQuery ? 'No workspaces match your search.' : 'You have no workspaces yet.'}
                            </div>
                            {!searchQuery && (
                                <Button
                                    onClick={onCreateWorkspace}
                                    variant="outline"
                                    className="mt-4 rounded-full"
                                >
                                    <Plus className="w-4 h-4 mr-2" /> Create your first workspace
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <div className="min-w-[700px]">
                                {/* Column Headers */}
                                <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 border-b border-neutral-200 dark:border-neutral-700">
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
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.03 }}
                                        className="grid grid-cols-12 gap-4 px-4 py-3 items-center border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors group"
                                    >
                                        {/* # */}
                                        <div className="col-span-1 text-sm text-neutral-400">
                                            {index + 1}
                                        </div>

                                        {/* Workspace */}
                                        <div className="col-span-4 flex items-center gap-3 min-w-0">
                                            <WorkspaceAvatar
                                                workspace={{ name: ws.name, avatar_url: ws.avatar_url }}
                                                className="w-10 h-10 rounded-xl flex-shrink-0"
                                            />
                                            <div className="truncate">
                                                <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                                                    {ws.name}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Role */}
                                        <div className="col-span-2">
                                            <Badge
                                                variant="outline"
                                                className="capitalize text-xs rounded-full px-3 py-1 bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700"
                                            >
                                                {ws.role}
                                            </Badge>
                                        </div>

                                        {/* Members */}
                                        <div className="col-span-2 flex items-center gap-1 text-sm text-neutral-600 dark:text-neutral-400">
                                            <Users className="w-3.5 h-3.5" />
                                            <span>{ws.memberCount || 0}</span>
                                        </div>

                                        {/* Last Active */}
                                        <div className="col-span-2 flex items-center gap-1 text-sm text-neutral-500 dark:text-neutral-400">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span>{ws.lastActive || '—'}</span>
                                        </div>

                                        {/* Actions */}
                                        <div className="col-span-1 flex justify-end">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="rounded-xl">
                                                    <DropdownMenuItem
                                                        onClick={() => handleOpen(ws.id)}
                                                        disabled={loadingId === ws.id}
                                                        className="gap-2 cursor-pointer"
                                                    >
                                                        {loadingId === ws.id ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <ExternalLink className="w-4 h-4" />
                                                        )}
                                                        Open Workspace
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleArchive(ws.id, ws.name)}
                                                        className="gap-2 cursor-pointer text-red-600 dark:text-red-400"
                                                    >
                                                        <Archive className="w-4 h-4" />
                                                        Archive Workspace
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}