// Example data – adjust to match your project
export const BILLING_PLANS = [
    {
        key: 'pro',
        name: 'Pro',
        description: 'For growing teams and professionals',
        ribbon: 'Popular',
        monthlyDisplay: '₹399',
        yearlyDisplay: '₹299', // effective monthly, yearly total = 3588
        monthlyTotal: '₹399',
        yearlyTotal: '₹3,588',
        savingLabel: 'Save ₹1,200',
        features: [
            '10 workspaces',
            '2 GB storage',
            '500K AI tokens/day',
            '10 collaborators per workspace',
            'Priority email support'
        ]
    },
    {
        key: 'ultra',
        name: 'Ultra',
        description: 'For large organisations and power users',
        ribbon: 'Best value',
        monthlyDisplay: '₹699',
        yearlyDisplay: '₹799', // effective monthly, yearly total = 9588
        monthlyTotal: '₹699',
        yearlyTotal: '₹9,588',
        savingLabel: 'Save ₹1,200',
        features: [
            '100 workspaces',
            '10 GB storage',
            '20M AI tokens/day',
            'Unlimited collaborators',
            '24/7 priority support'
        ]
    }
];