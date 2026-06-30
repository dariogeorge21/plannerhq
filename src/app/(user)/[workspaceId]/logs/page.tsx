'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

type LogItem = {
  id: string;
  workspace_id: string;
  user_id: string;
  action_type: string;
  entity_type: string;
  entity_id: string | null;
  metadata: any;
  created_at: string;
  profiles?: {
    display_name: string | null;
    avatar_url: string | null;
    email: string;
  };
};

async function fetchLogs(
  workspaceId: string,
  page: number,
  limit: number
): Promise<{ data: LogItem[]; totalCount: number; success: boolean; message: string }> {
  const res = await fetch(`/api/workspaces/${workspaceId}/logs?page=${page}&limit=${limit}`);
  return res.json();
}

export default function WorkspaceLogsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const workspaceId = params.workspaceId as string;

  const currentPage = searchParams.get('page') ? parseInt(searchParams.get('page')!, 10) : 1;
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const limit = 20;
  const totalPages = Math.ceil(totalCount / limit);
  
  const prevPageHref = currentPage > 1 ? `/${workspaceId}/logs?page=${currentPage - 1}` : '#';
  const nextPageHref = currentPage < totalPages ? `/${workspaceId}/logs?page=${currentPage + 1}` : '#';

  useEffect(() => {
    const loadLogs = async () => {
      setIsLoading(true);
      const res = await fetchLogs(workspaceId, currentPage, limit);
      if (res.success && res.data) {
        setLogs(res.data);
        setTotalCount(res.totalCount);
      }
      setIsLoading(false);
    };
    loadLogs();
  }, [workspaceId, currentPage]);

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-10 bg-background h-full">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Workspace Logs</h1>
          <p className="text-muted-foreground mt-2">
            Audit trail of events happening within the workspace.
          </p>
        </div>

        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Performed By</TableHead>
                <TableHead className="text-right">Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-6 rounded-full" />
                        <Skeleton className="h-5 w-20" />
                      </div>
                    </TableCell>
                    <TableCell className="text-right"><Skeleton className="h-5 w-32 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No logs found.
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">
                      {formatActionType(log.action_type)}
                    </TableCell>
                    <TableCell>
                      {formatEntity(log.entity_type, log.metadata)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={log.profiles?.avatar_url || ''} />
                          <AvatarFallback>
                            {log.profiles?.display_name?.charAt(0) || log.profiles?.email?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">
                          {log.profiles?.display_name || log.profiles?.email || 'Unknown User'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap text-muted-foreground text-sm">
                      {format(new Date(log.created_at), 'MMM d, yyyy h:mm a')}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={prevPageHref}
                  className={currentPage <= 1 || isLoading ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>

              <PaginationItem>
                <span className="text-sm text-muted-foreground mx-4">
                  {isLoading ? 'Loading...' : `Page ${currentPage} of ${totalPages}`}
                </span>
              </PaginationItem>

              <PaginationItem>
                <PaginationNext
                  href={nextPageHref}
                  className={currentPage >= totalPages || isLoading ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}

function formatActionType(action: string) {
  return action
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatEntity(entityType: string, metadata: any) {
  let title = metadata?.title || metadata?.name || metadata?.role || '';
  if (!title && metadata?.method) title = `via ${metadata.method}`;

  const entityName = entityType.charAt(0).toUpperCase() + entityType.slice(1);
  return title ? `${entityName}: ${title}` : entityName;
}
