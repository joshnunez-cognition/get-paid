// Commission calculation utility functions
// Q4 comp plan: one tiered rate card for SDR and Sr SDR
//   0–35 pts: $71.43/pt · 35–50 pts: $83.33/pt · 50+ pts: $115/pt
// SDR:    $70k base, 35pt quota, $2,500/mo variable at quota, $100k OTE
// Sr SDR: $80k base, 50pt quota, $3,750/mo variable at quota, $125k OTE

export type Role = 'sdr' | 'srSdr';

export const MAX_POINTS = 200;

export interface RolePlan {
  label: string;
  annualBase: number;
  monthlyBaseGross: number;
  quotaPoints: number;
  monthlyVariableTarget: number;
  ote: number;
}

export interface RateTier {
  from: number;
  to: number;
  rate: number;
  label: string;
}

export const RATE_TIERS: readonly RateTier[] = [
  { from: 0, to: 35, rate: 2500 / 35, label: '0–35' },
  { from: 35, to: 50, rate: 1250 / 15, label: '35–50' },
  { from: 50, to: Infinity, rate: 115, label: '50+' },
];

export const ROLE_PLANS: Record<Role, RolePlan> = {
  sdr: {
    label: 'SDR',
    annualBase: 70000,
    monthlyBaseGross: 70000 / 12,
    quotaPoints: 35,
    monthlyVariableTarget: 2500,
    ote: 100000,
  },
  srSdr: {
    label: 'Sr SDR',
    annualBase: 80000,
    monthlyBaseGross: 80000 / 12,
    quotaPoints: 50,
    monthlyVariableTarget: 3750,
    ote: 125000,
  },
};

export interface TierEarnings {
  tier: RateTier;
  points: number;
  value: number;
}

export interface TierBreakdown {
  tiers: TierEarnings[];
  totalCommission: number;
}

export interface TierStatus {
  tier: 'below' | 'quota' | 'over';
  label: string;
  attainmentPercent: number;
  pointsToNextTier: number;
  nextTierLabel: string;
  nextPointRate: number;
}

export interface ScenarioProjection {
  currentPoints: number;
  addedPoints: number;
  projectedPoints: number;
  currentCommission: number;
  projectedCommission: number;
  currentGross: number;
  projectedGross: number;
  increaseCommission: number;
  increaseGross: number;
}

export function calculateTierBreakdown(points: number): TierBreakdown {
  const tiers = RATE_TIERS.map((tier) => {
    const tierPoints = Math.max(0, Math.min(points, tier.to) - tier.from);
    return { tier, points: tierPoints, value: tierPoints * tier.rate };
  });
  return {
    tiers,
    totalCommission: tiers.reduce((sum, t) => sum + t.value, 0),
  };
}

export function getRateAtPoints(points: number): number {
  const tier = RATE_TIERS.find((t) => points >= t.from && points < t.to);
  return (tier ?? RATE_TIERS[RATE_TIERS.length - 1]).rate;
}

export function calculateCommission(points: number): number {
  return calculateTierBreakdown(points).totalCommission;
}

export function calculateGrossPay(points: number, role: Role): number {
  return ROLE_PLANS[role].monthlyBaseGross + calculateCommission(points);
}

export function calculateAttainmentPercent(points: number, role: Role): number {
  return (points / ROLE_PLANS[role].quotaPoints) * 100;
}

export function calculatePointsRemaining(points: number, role: Role): number {
  return Math.max(ROLE_PLANS[role].quotaPoints - points, 0);
}

export function getCurrentTierStatus(points: number, role: Role): TierStatus {
  const quota = ROLE_PLANS[role].quotaPoints;
  const attainmentPercent = calculateAttainmentPercent(points, role);
  const nextPointRate = getRateAtPoints(points);

  if (points > quota) {
    return {
      tier: 'over',
      label: 'Over Quota',
      attainmentPercent,
      pointsToNextTier: 0,
      nextTierLabel: '',
      nextPointRate,
    };
  }

  if (points === quota) {
    return {
      tier: 'quota',
      label: 'At Quota',
      attainmentPercent,
      pointsToNextTier: 0,
      nextTierLabel: 'Over Quota',
      nextPointRate,
    };
  }

  return {
    tier: 'below',
    label: 'Below Quota',
    attainmentPercent,
    pointsToNextTier: quota - points,
    nextTierLabel: 'Quota',
    nextPointRate,
  };
}

export function calculateScenarioProjection(
  currentPoints: number,
  addedPoints: number,
  role: Role
): ScenarioProjection {
  const projectedPoints = currentPoints + addedPoints;
  const currentCommission = calculateCommission(currentPoints);
  const projectedCommission = calculateCommission(projectedPoints);
  const currentGross = calculateGrossPay(currentPoints, role);
  const projectedGross = calculateGrossPay(projectedPoints, role);

  return {
    currentPoints,
    addedPoints,
    projectedPoints,
    currentCommission,
    projectedCommission,
    currentGross,
    projectedGross,
    increaseCommission: projectedCommission - currentCommission,
    increaseGross: projectedGross - currentGross,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}
