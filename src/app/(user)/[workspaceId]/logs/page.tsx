import { GetWorkspaceActivityLogs, GetWorkspace } from "@/features/workspace/workspace";
import { redirect } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function WorkspaceLogsPage({
  params,
  searchParams,
}: {
  params: Promise<{ workspaceId: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { workspaceId } = await params;
  const searchParamsResolved = await searchParams;
  const page = searchParamsResolved.page ? parseInt(searchParamsResolved.page, 10) : 1;
  const limit = 20;

  // Check workspace and role
  const workspaceRes = await GetWorkspace(workspaceId);
  if (!workspaceRes.success || !workspaceRes.data) {
    redirect("/dashboard");
  }
  
  if (workspaceRes.data.role !== "owner") {
    redirect(`/${workspaceId}`);
  }

  // Fetch logs
  const logsRes = await GetWorkspaceActivityLogs(workspaceId, page, limit);
  const logs = logsRes.data || [];
  const total = logsRes.totalCount || 0;
  const totalPages = Math.ceil(total / limit);

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
              {logs.length === 0 ? (
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
                          <AvatarImage src={log.user?.avatar_url || ""} />
                          <AvatarFallback>
                            {log.user?.full_name?.charAt(0) || log.user?.email?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">
                          {log.user?.full_name || log.user?.email || "Unknown User"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap text-muted-foreground text-sm">
                      {format(new Date(log.created_at), "MMM d, yyyy h:mm a")}
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
                  href={page > 1 ? `/${workspaceId}/logs?page=${page - 1}` : "#"}
                  className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              <PaginationItem>
                <span className="text-sm text-muted-foreground mx-4">
                  Page {page} of {totalPages}
                </span>
              </PaginationItem>

              <PaginationItem>
                <PaginationNext
                  href={page < totalPages ? `/${workspaceId}/logs?page=${page + 1}` : "#"}
                  className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
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
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatEntity(entityType: string, metadata: any) {
  let title = metadata?.title || metadata?.name || metadata?.role || "";
  if (!title && metadata?.method) title = `via ${metadata.method}`;
  
  const entityName = entityType.charAt(0).toUpperCase() + entityType.slice(1);
  return title ? `${entityName}: ${title}` : entityName;
}
