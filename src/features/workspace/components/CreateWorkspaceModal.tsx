'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreateWorkspace } from '@/features/workspace/workspace';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface CreateWorkspaceModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateWorkspaceModal({ isOpen, onClose }: CreateWorkspaceModalProps) {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = name.trim();
        if (!trimmed) return;

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('workspaceName', trimmed);
            const res = await CreateWorkspace(formData);

            if (res.success && res.data) {
                toast.success(res.message);
                router.push(`/${res.data.id}`);
                onClose();
            } else {
                toast.error(res.message || 'Failed to create workspace');
                setLoading(false);
            }
        } catch (error) {
            toast.error('An error occurred');
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[480px] overflow-hidden bg-white/90 dark:bg-neutral-900/90 backdrop-blur-2xl border-neutral-200/60 dark:border-neutral-800/60 shadow-[0_20px_60px_rgba(0,0,0,0.15)] rounded-3xl p-0">
                <AnimatePresence>
                    {loading && (
                        <motion.div
                            initial={{ width: 0, opacity: 1 }}
                            animate={{ width: '100%', opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.5, ease: 'easeInOut' }}
                            className="absolute top-0 left-0 h-1 bg-gradient-to-r from-emerald-400 to-indigo-500 z-50"
                        />
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="p-6">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold tracking-tight">Create Workspace</DialogTitle>
                        <DialogDescription>
                            Give your new workspace a name to start collaborating.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-6 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium">
                                Workspace Name
                            </Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Marketing Q3, Engineering, Design"
                                className="rounded-xl border-neutral-200 dark:border-neutral-700 bg-white/50 dark:bg-black/50 focus:ring-indigo-500 text-base h-12"
                                required
                                autoFocus
                            />
                            <p className="text-xs text-neutral-400">
                                Choose a name that reflects your team or project.
                            </p>
                        </div>
                    </div>

                    <DialogFooter className="mt-8 flex flex-col sm:flex-row gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={loading}
                            className="rounded-full w-full sm:w-auto"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading || !name.trim()}
                            className="rounded-full w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white transition-transform active:scale-95"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating…
                                </>
                            ) : (
                                'Create & Enter'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}