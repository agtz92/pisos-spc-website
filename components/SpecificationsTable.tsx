import type { SpecGroup } from '@/lib/graphql';

interface Props {
  groups: SpecGroup[];
}

const KEY_VALUE_HEADERS = ['característica', 'valor'];

/**
 * Renders one or more spec tables. Each group is a section with a heading and table.
 * When a group has exactly 2 columns matching the default key/value headers,
 * the <thead> is hidden so it reads as a simple definition list.
 *
 * Uses only template CSS vars (--template-*) — colors adapt to whichever
 * visual template (modern / retro / futuristic) is active.
 */
export default function SpecificationsTable({ groups }: Props) {
  if (!groups || groups.length === 0) return null;

  const visible = groups.filter((g) => g.rows && g.rows.length > 0);
  if (visible.length === 0) return null;

  return (
    <section className="mt-12" data-product-specs>
      <h2
        className="mb-6 text-xl font-bold"
        style={{ color: 'var(--template-ink, #161218)' }}
      >
        Specifications
      </h2>
      <div className="space-y-8">
        {visible.map((group, gi) => {
          const isKeyValue =
            group.headers.length === 2 &&
            group.headers.every((h, i) =>
              (h || '').trim().toLowerCase() === KEY_VALUE_HEADERS[i],
            );

          return (
            <div key={gi}>
              {group.name && (
                <h3
                  className="mb-3 text-sm font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--template-muted-text, #6b7280)' }}
                >
                  {group.name}
                </h3>
              )}
              <div
                className="overflow-x-auto rounded-lg border"
                style={{ borderColor: 'var(--template-panel-border, #e5e7eb)' }}
              >
                <table className="w-full text-sm">
                  {!isKeyValue && (
                    <thead>
                      <tr
                        style={{
                          background: 'var(--template-muted-panel, #f9fafb)',
                          color: 'var(--template-muted-text, #6b7280)',
                        }}
                      >
                        {group.headers.map((h, ci) => (
                          <th
                            key={ci}
                            className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider"
                            style={{ borderColor: 'var(--template-panel-border, #e5e7eb)' }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                  )}
                  <tbody>
                    {group.rows.map((row, ri) => (
                      <tr
                        key={ri}
                        style={{
                          borderTop: ri === 0 && isKeyValue ? 'none' : `1px solid var(--template-panel-border, #e5e7eb)`,
                        }}
                      >
                        {row.map((cell, ci) => {
                          const isLabelColumn = isKeyValue && ci === 0;
                          return (
                            <td
                              key={ci}
                              className="px-4 py-2.5 align-top"
                              style={{
                                color: isLabelColumn
                                  ? 'var(--template-muted-text, #6b7280)'
                                  : 'var(--template-ink, #161218)',
                                fontWeight: isLabelColumn ? 500 : 400,
                                width: isLabelColumn ? '40%' : undefined,
                              }}
                            >
                              {cell || '—'}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
