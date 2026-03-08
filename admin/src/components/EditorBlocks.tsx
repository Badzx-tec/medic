import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import type { ReactNode } from 'react';
import { removeArrayItem, updateArrayItem } from '../lib/editor';

export const inputClass =
  'w-full rounded-2xl border border-white/10 bg-[#09121d] px-4 py-3 text-sm text-slate-50 outline-none transition placeholder:text-slate-500 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/20';

export const textareaClass = `${inputClass} min-h-[120px]`;

export function FeatureCard({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-5">
      <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-300/15 text-cyan-100">{icon}</div>
      <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
    </div>
  );
}

export function FeedbackBanner({
  tone,
  message,
  className = ''
}: {
  tone: 'success' | 'error' | 'info';
  message: string;
  className?: string;
}) {
  const toneClass =
    tone === 'success'
      ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-50'
      : tone === 'error'
        ? 'border-rose-500/25 bg-rose-500/10 text-rose-50'
        : 'border-cyan-500/20 bg-cyan-500/10 text-cyan-50';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        className={`${className} rounded-[22px] border px-4 py-3 text-sm ${toneClass}`}
      >
        {message}
      </motion.div>
    </AnimatePresence>
  );
}

export function SectionCard({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <section className="rounded-[26px] border border-white/10 bg-[#08111b] p-5">
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-slate-400">{description}</p>
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

export function Field({
  label,
  hint,
  children
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</span>
        {hint && <span className="text-xs text-slate-500">{hint}</span>}
      </div>
      {children}
    </label>
  );
}

export function LinkCard({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-[#08111b] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-2 break-all text-sm leading-6 text-slate-200">{value || '---'}</p>
      {href && (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-cyan-200 transition hover:text-cyan-100"
        >
          Abrir rota
          <ExternalLink className="h-4 w-4" />
        </a>
      )}
    </div>
  );
}

export function SkeletonCard() {
  return <div className="h-28 animate-pulse rounded-[24px] border border-white/10 bg-white/[0.04]" />;
}

export function TextListField({
  label,
  description,
  items,
  placeholder,
  onChange
}: {
  label: string;
  description: string;
  items: string[];
  placeholder: string;
  onChange: (value: string[]) => void;
}) {
  return (
    <SectionCard title={label} description={description}>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={`${label}-${index}`} className="flex gap-3">
            <input
              className={inputClass}
              value={item}
              onChange={(event) => onChange(updateArrayItem(items, index, event.target.value))}
              placeholder={placeholder}
            />
            <button
              type="button"
              className="rounded-full border border-rose-500/20 bg-rose-500/10 px-4 text-sm text-rose-100 transition hover:bg-rose-500/20"
              onClick={() => onChange(removeArrayItem(items, index))}
            >
              Remover
            </button>
          </div>
        ))}
        <button
          type="button"
          className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/[0.06]"
          onClick={() => onChange([...items, ''])}
        >
          Adicionar item
        </button>
      </div>
    </SectionCard>
  );
}

type ObjectListEditorProps<T extends Record<string, string | undefined>> = {
  title: string;
  description: string;
  items: T[];
  createItem: () => T;
  addLabel: string;
  onChange: (value: T[]) => void;
  fields: Array<{
    key: keyof T;
    label: string;
    placeholder?: string;
    multiline?: boolean;
  }>;
};

export function ObjectListEditor<T extends Record<string, string | undefined>>(props: ObjectListEditorProps<T>) {
  return (
    <SectionCard title={props.title} description={props.description}>
      <div className="space-y-4">
        {props.items.map((item, index) => (
          <div key={`${props.title}-${index}`} className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
            <div className={`grid gap-4 ${props.fields.length > 2 ? 'md:grid-cols-2 xl:grid-cols-3' : 'md:grid-cols-2'}`}>
              {props.fields.map((field) => (
                <Field key={String(field.key)} label={field.label}>
                  {field.multiline ? (
                    <textarea
                      className={textareaClass}
                      rows={3}
                      value={item[field.key] ?? ''}
                      onChange={(event) =>
                        props.onChange(updateArrayItem(props.items, index, { ...item, [field.key]: event.target.value }))
                      }
                      placeholder={field.placeholder}
                    />
                  ) : (
                    <input
                      className={inputClass}
                      value={item[field.key] ?? ''}
                      onChange={(event) =>
                        props.onChange(updateArrayItem(props.items, index, { ...item, [field.key]: event.target.value }))
                      }
                      placeholder={field.placeholder}
                    />
                  )}
                </Field>
              ))}
            </div>
            <button
              type="button"
              className="mt-3 rounded-full border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-sm text-rose-100 transition hover:bg-rose-500/20"
              onClick={() => props.onChange(removeArrayItem(props.items, index))}
            >
              Remover item
            </button>
          </div>
        ))}
        <button
          type="button"
          className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/[0.06]"
          onClick={() => props.onChange([...props.items, props.createItem()])}
        >
          {props.addLabel}
        </button>
      </div>
    </SectionCard>
  );
}
