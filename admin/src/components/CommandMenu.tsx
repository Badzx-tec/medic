import { useEffect, useState } from 'react';

export function CommandMenu({ onCreate }: { onCreate: () => void }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/60 grid place-items-center" onClick={() => setOpen(false)}>
      <div className="w-full max-w-md rounded-xl bg-slate-900 p-4 border border-slate-700" onClick={(e) => e.stopPropagation()}>
        <button className="w-full rounded-lg bg-cyan-500 px-4 py-2" onClick={onCreate}>Criar nova página</button>
      </div>
    </div>
  );
}
