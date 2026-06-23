import { useState, useEffect } from "react";
import { SubscriptionRecord, UsageRecord } from "@/types/billing";
import { Plan } from "@/types/types";

export function useSubscription() {
    const [data, setData] = useState<{
        subscription: SubscriptionRecord | null;
        plan: any;
        dbPlan: any;
        usage: UsageRecord | null;
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
