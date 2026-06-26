export type BillingCycle = "monthly" | "yearly";
export type PlanKey = "free" | "pro" | "ultra" | "enterprise";

export type TextCell = {
    kind: "text";
    lines: string[];
    mutedLines?: number[];
};

export type CheckCell = {
    kind: "check";
};

export type BlankCell = {
    kind: "blank";
};

export type Cell = TextCell | CheckCell | BlankCell;

export type Group = {
    title: string;
    rows: {
        label: string;
        values: Record<PlanKey, Cell>;
    }[];
};

export type Plan = {
    key: PlanKey;
    name: string;
    monthlyPrice: string;
    yearlyPrice: string;
    monthlySuffix: string;
    yearlySuffix: string;
    description: string;
    ctaLabel: string;
    href: string;
    featured?: boolean;
    ribbon?: string;
};