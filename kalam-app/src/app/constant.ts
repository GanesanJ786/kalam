/**
 * Copyright (c) 2024-2026 Kalam. All Rights Reserved.
 * Unauthorized copying or distribution is strictly prohibited.
 */
/**
 * Copyright (c) 2024-2026 Kalam. All Rights Reserved.
 * Unauthorized copying or distribution is strictly prohibited.
 */
/**
 * Copyright (c) 2024-2026 Kalam. All Rights Reserved.
 * Unauthorized copying or distribution is strictly prohibited.
 */
export interface SelectItem {
    value: string;
    label: string;
}

export interface SelectItemNum {
    value: number;
    label: number;
}

export const SportsList: SelectItem[] = [
    {value:'goalkeeper', label: 'Goal Keeper'},
    {value:'defenders', label: 'Defenders'},
    {value:'outsideFullback', label: 'Outside Fullback'},
    {value:'centralDefenders', label: 'Central Defenders'},
    {value:'midfielders', label: 'Mid Fielders'},
    {value:'forwards', label: 'Forwards'},
    {value:'centerForward', label: 'Center Forward'}
];

export const UnderAge: SelectItem[] = [
    {value:'u-5', label: 'Under-5'},
    {value:'u-6', label: 'Under-6'},
    {value:'u-7', label: 'Under-7'},
    {value:'u-8', label: 'Under-8'},
    {value:'u-9', label: 'Under-9'},
    {value:'u-10', label: 'Under-10'},
    {value:'u-11', label: 'Under-11'},
    {value:'u-12', label: 'Under-12'},
    {value:'u-13', label: 'Under-13'},
    {value:'u-14', label: 'Under-14'},
    {value:'u-15', label: 'Under-15'},
    {value:'u-16', label: 'Under-16'},
    {value:'u-17', label: 'Under-17'},
    {value:'u-18', label: 'Under-18'},
    {value:'u-19', label: 'Under-19'},
    {value:'u-20', label: 'Under-20'},
    {value:'u-21', label: 'Under-21'},
    {value:'open', label: 'Open'}
];

export const Scholarship: SelectItem[] = [
    {value:'0', label: 'None'},
    {value:'10', label: '10'},
    {value:'15', label: '15'},
    {value:'25', label: '25'},
    {value:'50', label: '50'},
    {value:'100', label: '100'},
];

export const CompetencyLevel: SelectItem[] = [
    {value:'Beginner', label: 'Beginner'},
    {value:'Intermediate', label: 'Intermediate'},
    {value:'Advanced', label: 'Advanced'}
];

export const RatingLevel: SelectItemNum[] = [
    {value:0, label: 0},
    {value:1, label: 1},
    {value:2, label: 2},
    {value:3, label: 3},
    {value:4, label: 4},
    {value:5, label: 5},
    {value:6, label: 6},
    {value:7, label: 7},
    {value:8, label: 8},
    {value:9, label: 9},
    {value:10, label: 10}
]

export interface SportIconItem {
    value: string;
    label: string;
    icon: string;
}

export const SportsIconMap: SportIconItem[] = [
    { value: 'football', label: 'Football', icon: 'sports_soccer' },
    { value: 'volleyball', label: 'Volleyball', icon: 'sports_volleyball' },
    { value: 'badminton', label: 'Badminton', icon: 'sports_tennis' },
    { value: 'cricket', label: 'Cricket', icon: 'sports_cricket' },
    { value: 'hockey', label: 'Hockey', icon: 'sports_hockey' },
    { value: 'chess', label: 'Chess', icon: 'psychology' },
    { value: 'fitness', label: 'Fitness', icon: 'fitness_center' },
];

export function getSportIcon(sport: string): string {
    const match = SportsIconMap.find(s => s.value === (sport || '').toLowerCase());
    return match ? match.icon : 'sports';
}

export function getSportLabel(sport: string): string {
    const match = SportsIconMap.find(s => s.value === (sport || '').toLowerCase());
    return match ? match.label : sport || '';
}

export const Logo = {
    logoUrl: ``
}

// ─── Subscription Plan Definitions ──────────────────────────────

export type PlanId = 'FREE_TRIAL' | 'STARTER' | 'BASIC' | 'STANDARD' | 'PRO' | 'ENTERPRISE';

export interface PlanLimits {
    maxCoaches: number;
    maxStudents: number;
    maxGrounds: number;
}

export interface SubscriptionPlan {
    id: PlanId;
    name: string;
    monthlyPrice: number;
    annualPrice: number;
    limits: PlanLimits;
    features: string[];
    trialDays?: number;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
    {
        id: 'FREE_TRIAL',
        name: 'Free Trial',
        monthlyPrice: 0,
        annualPrice: 0,
        limits: { maxCoaches: 1, maxStudents: 15, maxGrounds: 1 },
        features: ['Basic attendance', 'Student management', '30-day trial'],
        trialDays: 30
    },
    {
        id: 'STARTER',
        name: 'Starter',
        monthlyPrice: 999,
        annualPrice: 8748,
        limits: { maxCoaches: 2, maxStudents: 30, maxGrounds: 1 },
        features: ['Attendance tracking', 'Student management', 'Email support']
    },
    {
        id: 'BASIC',
        name: 'Basic',
        monthlyPrice: 1999,
        annualPrice: 17508,
        limits: { maxCoaches: 5, maxStudents: 100, maxGrounds: 3 },
        features: ['All Starter features', 'Performance tracking', 'Excel export', 'Coach tasks']
    },
    {
        id: 'STANDARD',
        name: 'Standard',
        monthlyPrice: 2999,
        annualPrice: 26268,
        limits: { maxCoaches: 10, maxStudents: 250, maxGrounds: 5 },
        features: ['All Basic features', 'Analytics dashboard', 'Multi-ground support', 'Priority support']
    },
    {
        id: 'PRO',
        name: 'Pro',
        monthlyPrice: 3999,
        annualPrice: 35028,
        limits: { maxCoaches: 20, maxStudents: 500, maxGrounds: 10 },
        features: ['All Standard features', 'Advanced analytics', 'Scholarship management', 'Dedicated support']
    },
    {
        id: 'ENTERPRISE',
        name: 'Enterprise',
        monthlyPrice: 6999,
        annualPrice: 59988,
        limits: { maxCoaches: 9999, maxStudents: 9999, maxGrounds: 9999 },
        features: ['All Pro features', 'Unlimited coaches & students', 'Custom branding', 'SLA guarantee', 'Account manager']
    }
];

export function getPlanById(planId: PlanId): SubscriptionPlan | undefined {
    return SUBSCRIPTION_PLANS.find(p => p.id === planId);
}

export function getDefaultPlan(): SubscriptionPlan {
    return SUBSCRIPTION_PLANS.find(p => p.id === 'FREE_TRIAL')!;
}