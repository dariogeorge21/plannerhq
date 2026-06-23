import { PlanKey } from "@/types/types";

export const PLAN_CONFIG = {
    free: {
        id: "free",
        maxWorkspaces: 3,
        maxSections: 2,
        maxStorageBytes: 104857600, // 100MB
        maxAiTokens: 200000,
        maxCollaborators: 2,
        razorpayPlanIdMonthly: null,
        razorpayPlanIdYearly: null,
    },
    pro: {
        id: "pro",
        maxWorkspaces: 10,
        maxSections: 20,
        maxStorageBytes: 2147483648, // 2GB
        maxAiTokens: 500000, // per day
        maxCollaborators: 10,
        razorpayPlanIdMonthly: process.env.NEXT_PUBLIC_RAZORPAY_PRO_MONTHLY_PLAN_ID,
        razorpayPlanIdYearly: process.env.NEXT_PUBLIC_RAZORPAY_PRO_YEARLY_PLAN_ID,
    },
    plus: { // Keep plus until manually renamed
        id: "plus",
        maxWorkspaces: 100,
        maxSections: 300,
        maxStorageBytes: 10737418240, // 10GB
        maxAiTokens: 20000000, // per day
        maxCollaborators: 999999, // unlimited
        razorpayPlanIdMonthly: process.env.NEXT_PUBLIC_RAZORPAY_ULTRA_MONTHLY_PLAN_ID,
        razorpayPlanIdYearly: process.env.NEXT_PUBLIC_RAZORPAY_ULTRA_YEARLY_PLAN_ID,
    },
    enterprise: {
        id: "enterprise",
        maxWorkspaces: 999999,
        maxSections: 999999,
        maxStorageBytes: 999999999999,
        maxAiTokens: 999999999,
        maxCollaborators: 999999,
        razorpayPlanIdMonthly: null,
        razorpayPlanIdYearly: null,
    }
} as Record<PlanKey, any>;

export const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
export const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
export const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;
