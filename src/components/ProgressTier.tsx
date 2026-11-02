import { Card, CardTitle } from './Card';
import {
  getCurrentTierStatus,
  formatCurrency,
  formatPercent,
  RATE_TIERS,
  ROLE_PLANS,
  type Role,
} from '../utils/commission';

interface ProgressTierProps {
  points: number;
  role: Role;
}

const TIER_COLORS = {
  below: { bg: 'bg-gray-100', text: 'text-gray-600', badge: 'bg-gray-200 text-gray-700' },
  quota: { bg: 'bg-brand-100', text: 'text-brand-700', badge: 'bg-brand-500 text-white' },
  over: { bg: 'bg-emerald-100', text: 'text-emerald-700', badge: 'bg-emerald-500 text-white' },
};

const BAND_COLORS = ['bg-brand-200', 'bg-violet-200', 'bg-emerald-200'];
const MAX_DISPLAY = 70;

export function ProgressTier({ points, role }: ProgressTierProps) {
  const quota = ROLE_PLANS[role].quotaPoints;
  const status = getCurrentTierStatus(points, role);
  const colors = TIER_COLORS[status.tier];

  const bands = RATE_TIERS.map((tier) => ({
    ...tier,
    widthPct: ((Math.min(tier.to, MAX_DISPLAY) - tier.from) / MAX_DISPLAY) * 100,
  }));
  const quotaPct = (quota / MAX_DISPLAY) * 100;
  const fillPct = Math.min((points / MAX_DISPLAY) * 100, 100);
  const nextRate = formatCurrency(status.nextPointRate);

  return (
    <Card>
      <CardTitle>Progress & Tier</CardTitle>

      {/* Tier badge */}
      <div className="flex items-center justify-between mb-4">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${colors.badge} ${status.tier !== 'below' ? 'tier-badge-shimmer' : ''}`}>
          {status.label}
        </span>
        <span className={`text-sm font-bold ${colors.text}`}>
          {formatPercent(status.attainmentPercent)}
        </span>
      </div>

      {/* Segmented progress bar */}
      <div className="relative mb-3">
        <div className="flex h-4 rounded-full overflow-hidden bg-gray-100">
          {bands.map((band, i) => (
            <div
              key={band.label}
              className={`${BAND_COLORS[i]} ${i < bands.length - 1 ? 'border-r border-white/50' : ''}`}
              style={{ width: `${band.widthPct}%` }}
            />
          ))}
        </div>
        {/* Fill overlay */}
        <div className="absolute top-0 left-0 h-4 rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${fillPct}%`,
            background: points <= quota
              ? 'linear-gradient(90deg, #3b82f6, #60a5fa)'
              : 'linear-gradient(90deg, #3b82f6, #10b981)',
          }}
        />
        {/* Quota marker */}
        <div className="absolute -top-1 h-6 w-0.5 bg-gray-700/70 rounded" style={{ left: `${quotaPct}%` }} title={`Quota: ${quota} pts`} />
      </div>

      {/* Labels under bar */}
      <div className="flex text-[10px] text-gray-400 font-medium mb-4">
        {bands.map((band) => (
          <div key={band.label} style={{ width: `${band.widthPct}%` }} className="text-center leading-tight">
            <div>{band.label}</div>
            <div className="text-gray-500">{formatCurrency(band.rate)}</div>
          </div>
        ))}
      </div>

      {/* Status text */}
      <div className="space-y-1 text-sm">
        {status.tier === 'below' && (
          <>
            <p className="text-gray-600">
              <span className="font-bold">{status.pointsToNextTier.toFixed(1)}</span> points to quota ({quota} pts)
            </p>
            <p className="text-gray-400">Next point earns {nextRate} — keep booking!</p>
          </>
        )}
        {status.tier === 'quota' && (
          <>
            <p className="text-brand-600 font-semibold">You hit quota!</p>
            <p className="text-gray-400">Every additional point earns {nextRate}</p>
          </>
        )}
        {status.tier === 'over' && (
          <>
            <p className={`${colors.text} font-semibold`}>
              Over quota! Earning {nextRate} per additional point.
            </p>
            <p className="text-gray-500">
              <span className="font-bold">{(points - quota).toFixed(1)}</span> pts over quota
            </p>
          </>
        )}
      </div>
    </Card>
  );
}
