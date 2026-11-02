import { ROLE_PLANS, type Role } from '../utils/commission';

interface RoleToggleProps {
  role: Role;
  onRoleChange: (role: Role) => void;
}

export function RoleToggle({ role, onRoleChange }: RoleToggleProps) {
  const plan = ROLE_PLANS[role];

  return (
    <div className="text-center">
      <div className="inline-flex p-1 rounded-xl bg-gray-100" role="radiogroup" aria-label="Comp plan">
        {(Object.keys(ROLE_PLANS) as Role[]).map((key) => (
          <button
            key={key}
            role="radio"
            aria-checked={role === key}
            onClick={() => onRoleChange(key)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer select-none ${
              role === key ? 'bg-white text-brand-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {ROLE_PLANS[key].label}
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-gray-400">
        ${(plan.annualBase / 1000).toFixed(0)}K base · {plan.quotaPoints} pt quota · ${(plan.ote / 1000).toFixed(0)}K OTE
      </p>
    </div>
  );
}
