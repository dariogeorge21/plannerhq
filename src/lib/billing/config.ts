// config.ts
import { PlanKey } from "@/types/types";
import { BillingPlan } from "@/types/billing";

export const PLAN_CONFIG: Record<PlanKey, BillingPlan> = {
    free: {
        id: 'free',
        maxWorkspaces: 3,
        maxSections: 2,
        maxStorageBytes: 104857600,
        maxAiTokens: 200000,
        maxCollaborators: 2,
        razorpayPlanIdMonthly: null,
        razorpayPlanIdYearly: null,
    },
    pro: {
        id: 'pro',
        maxWorkspaces: 10,
        maxSections: 20,
        maxStorageBytes: 2147483648,
        maxAiTokens: 500000,
        maxCollaborators: 10,
        razorpayPlanIdMonthly: process.env.RAZORPAY_PRO_MONTHLY_PLAN_ID!,
        razorpayPlanIdYearly: process.env.RAZORPAY_PRO_YEARLY_PLAN_ID!,
    },
    ultra: {
        id: 'ultra',
        maxWorkspaces: 100,
        maxSections: 300,
        maxStorageBytes: 10737418240,
        maxAiTokens: 20000000,
        maxCollaborators: 999999,
        razorpayPlanIdMonthly: process.env.RAZORPAY_ULTRA_MONTHLY_PLAN_ID!,
        razorpayPlanIdYearly: process.env.RAZORPAY_ULTRA_YEARLY_PLAN_ID!,
    },
    enterprise: {
        id: 'enterprise',
        maxWorkspaces: 999999,
        maxSections: 999999,
        maxStorageBytes: 999999999999,
        maxAiTokens: 999999999,
        maxCollaborators: 999999,
        razorpayPlanIdMonthly: null,
        razorpayPlanIdYearly: null,
    }
};