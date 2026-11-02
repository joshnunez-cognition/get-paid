import { Card, CardTitle } from './Card';
import {
  calculateCommission,
  calculateGrossPay,
  calculateAttainmentPercent,
  calculatePointsRemaining,
  formatCurrency,
  formatPercent,
  ROLE_PLANS,
  type Role,
} from '../utils/commission';

interface EarningsSummaryProps {
  points: number;
  role: Role;
}

export function EarningsSummary({ points, role }: EarningsSummaryProps) {
  const commission = calculateCommission(points);
  const grossPay = calculateGrossPay(points, role);
  const attainment = calculateAttainmentPercent(points, role);
  const remaining = calculatePointsRemaining(points, role);

  return (
    <Card>
      <CardTitle>Earnings Summary</CardTitle>
      <div className="space-y-4">
        {/* Commission & Gross - large display */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-brand-50 rounded-xl p-3 text-center">
            <p className="text-xs text-brand-600 font-medium mb-1">Commission</p>
            <p className="text-2xl font-extrabold text-brand-700 number-transition tabular-nums">
              {formatCurrency(commission)}
            </p>
          </div>
          <div className="bg-emerald-50 rounded-xl p-3 text-center">
            <p className="text-xs text-emerald-600 font-medium mb-1">Total Gross</p>
            <p className="text-2xl font-extrabold text-emerald-700 number-transition tabular-nums">
              {formatCurrency(grossPay)}
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Base Pay</p>
            <p className="text-sm font-bold text-gray-700">{formatCurrency(ROLE_PLANS[role].monthlyBaseGross)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Attainment</p>
            <p className={`text-sm font-bold ${attainment >= 100 ? 'text-emerald-600' : 'text-gray-700'}`}>
              {formatPercent(attainment)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-0.5">To Quota</p>
            <p className="text-sm font-bold text-gray-700">
              {remaining > 0 ? `${remaining} pts` : '✓ Hit'}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
