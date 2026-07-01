import { createClient } from "@/lib/supabase/server";
import { DbPlanRecord } from "@/types/billing";
import { PlanKey } from "@/types/types";

export class PlansRepository {
  private static instance: PlansRepository;

  private constructor() {}

  public static getInstance(): PlansRepository {
    if (!PlansRepository.instance) {
      PlansRepository.instance = new PlansRepository();
    }
    return PlansRepository.instance;
  }

  public async getAllActive(): Promise<DbPlanRecord[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("plans")
      .select("*")
      .eq("is_active", true)
      .order("monthly_price_paise", { ascending: true });

    if (error) {
      console.error("[BILLING ERROR] PlansRepository.getAllActive failed:", error);
      throw new Error("Failed to fetch plans");
    }

    return (data || []) as DbPlanRecord[];
  }

  public async getByKey(key: PlanKey): Promise<DbPlanRecord | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("plans")
      .select("*")
      .eq("key", key)
      .eq("is_active", true)
      .maybeSingle();

    if (error) {
      console.error("[BILLING ERROR] PlansRepository.getByKey failed:", { key, error });
      throw new Error(`Failed to fetch plan: ${key}`);
    }

    return data as DbPlanRecord | null;
  }

  public async getById(id: string): Promise<DbPlanRecord | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("plans")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("[BILLING ERROR] PlansRepository.getById failed:", { id, error });
      throw new Error("Failed to fetch plan");
    }

    return data as DbPlanRecord | null;
  }

  public async getFreePlan(): Promise<DbPlanRecord> {
    const plan = await this.getByKey("free");
    if (!plan) {
      throw new Error("Free plan not found");
    }
    return plan;
  }
}
