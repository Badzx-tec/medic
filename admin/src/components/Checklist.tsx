import { buildChecklist, type PageType } from '../lib/editor';

export function Checklist({ draft, type }: { draft: any; type: PageType }) {
  const checks = buildChecklist(draft, type);

  return (
    <ul className="space-y-3">
      {checks.map((item) => (
        <li
          key={item.label}
          className={`rounded-2xl border px-4 py-3 text-sm ${item.done ? 'border-emerald-500/25 bg-emerald-500/8 text-emerald-50' : 'border-amber-500/20 bg-amber-500/8 text-amber-50'}`}
        >
          <div className="flex items-center justify-between gap-3">
            <span className="font-medium">{item.label}</span>
            <span className={`inline-flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-xs font-semibold ${item.done ? 'bg-emerald-400/15 text-emerald-200' : 'bg-amber-400/15 text-amber-100'}`}>
              {item.done ? 'OK' : 'Pendente'}
            </span>
          </div>
          <p className="mt-1 text-xs text-current/70">{item.hint}</p>
        </li>
      ))}
    </ul>
  );
}
