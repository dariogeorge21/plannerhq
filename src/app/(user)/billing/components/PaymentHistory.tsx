"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PaymentRecord } from "@/types/billing";
import { formatDateTime, formatPaiseToRupees } from "./utils";
import {
  Receipt,
  Download,
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
} from "lucide-react";
import { motion } from "framer-motion";

interface PaymentHistoryProps {
  payments: PaymentRecord[];
}

function getStatusBadge(status: string) {
  let variant: "default" | "secondary" | "destructive" | "outline" = "outline";
  let icon: React.ReactNode = null;
  let label = status;

  switch (status) {
    case "captured":
    case "paid":
      variant = "default";
      icon = <CheckCircle2 className="h-3 w-3" />;
      label = "Paid";
      break;
    case "failed":
      variant = "destructive";
      icon = <XCircle className="h-3 w-3" />;
      label = "Failed";
      break;
    case "pending":
      variant = "outline";
      icon = <Clock className="h-3 w-3" />;
      label = "Pending";
      break;
  }

  return (
    <Badge variant={variant} className="gap-1.5 px-2.5 py-1">
      {icon}
      <span className="capitalize">{label}</span>
    </Badge>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <CreditCard className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">No payments yet</h3>
      <p className="text-muted-foreground mt-1 max-w-sm">
        Your payment history will appear here once you make your first payment.
      </p>
    </div>
  );
}

export function PaymentHistory({ payments }: PaymentHistoryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center">
              <Receipt className="h-4.5 w-4.5 text-muted-foreground" />
            </div>
            <div>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>View and download your invoices</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {payments.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Date</TableHead>
                    <TableHead>Payment ID</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Invoice</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment, index) => (
                    <TableRow
                      key={payment.id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-foreground">
                            {formatDateTime(payment.created_at)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-mono text-muted-foreground">
                          {payment.razorpay_payment_id.substring(0, 8)}...
                        </span>
                      </TableCell>
                      <TableCell>
                        {payment.payment_method ? (
                          <span className="text-sm text-muted-foreground capitalize">
                            {payment.payment_method}
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-sm font-bold text-foreground">
                          {formatPaiseToRupees(payment.amount_paise)}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(payment.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        {payment.invoice_url ? (
                          <Button
                            variant="outline"
                            size="xs"
                            onClick={() => window.open(payment.invoice_url as string, "_blank")}
                            className="gap-1.5"
                          >
                            <Download className="h-3.5 w-3.5" />
                            Download
                          </Button>
                        ) : (
                          <Button variant="outline" size="xs" disabled>
                            <ExternalLink className="h-3.5 w-3.5" />
                            N/A
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
