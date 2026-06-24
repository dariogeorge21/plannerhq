import { useState, useEffect } from "react";
import { SubscriptionRecord, UsageRecord, BillingPlan, DbPlanRecord } from "@/types/billing";

export function useSubscription() {
    const [data, setData] = useState<{
        subscription: SubscriptionRecord | null;
        plan: BillingPlan | null;
        dbPlan: DbPlanRecord | null;
        usage: UsageRecord | null;
        lastPaymentDate: string | null;
        lastPaymentAmount: number | null;
    } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSub() {
            try {
                const res = await fetch("/api/billing/subscription");
                if (res.ok) {
                    const json = await res.json();
                    if (json.success) {
                        setData(json.data);
                    }
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        fetchSub();
    }, []);

    return { data, loading };
}
