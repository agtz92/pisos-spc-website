/**
 * ComparisonTable — Feature × Pricing-plan matrix.
 *
 * Renders when ``comparisonEnabled`` is true and the page has at least
 * one comparison row + one pricing plan. Each row's ``values`` is a
 * ``{ '<pricingPlan.id>': <cell content> }`` dict; cells whose key
 * doesn't match a current plan render as empty (graceful).
 *
 * Layouts call this right before the existing pricing-card grid.
 */
import type { LandingPage } from '@/lib/graphql';
import { t } from '../sections';

function renderCell(raw: unknown): React.ReactNode {
  if (raw == null || raw === '') return <span style={{ color: t.mutedText }}>—</span>;
  if (raw === true || raw === '✓') return <span style={{ color: t.accent, fontWeight: 700 }}>✓</span>;
  if (raw === false || raw === '✗') return <span style={{ color: t.mutedText }}>✗</span>;
  return <span>{String(raw)}</span>;
}

export default function ComparisonTable({ page }: { page: LandingPage }) {
  if (!page.comparisonEnabled) return null;
  const rows = page.comparisonRows || [];
  const plans = page.pricingPlans || [];
  if (rows.length === 0 || plans.length === 0) return null;

  return (
    <section className="py-16" style={{ background: t.panel }}>
      <div className="max-w-5xl mx-auto px-4">
        {page.comparisonHeading && (
          <h2 className="text-center text-2xl sm:text-3xl font-bold mb-10" style={{ color: t.ink }}>
            {page.comparisonHeading}
          </h2>
        )}
        <div className="overflow-x-auto rounded-2xl" style={{ border: `1px solid ${t.panelBorder}` }}>
          <table className="w-full text-sm" style={{ background: t.panel }}>
            <thead>
              <tr style={{ background: t.mutedPanel, borderBottom: `1px solid ${t.panelBorder}` }}>
                <th className="text-left px-5 py-3 font-semibold" style={{ color: t.ink }}>Feature</th>
                {plans.map((plan) => (
                  <th key={plan.id} className="px-4 py-3 font-semibold text-center" style={{ color: t.ink }}>
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} style={{ borderTop: `1px solid ${t.panelBorder}` }}>
                  <td className="px-5 py-3" style={{ color: t.ink }}>{row.featureName}</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="px-4 py-3 text-center" style={{ color: t.ink }}>
                      {renderCell((row.values as Record<string, unknown>)[String(plan.id)])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
