import { motion } from 'framer-motion';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { CommandMenu } from '../components/CommandMenu';
import { Checklist } from '../components/Checklist';

type Page = { id: string; slug: string; status: string; type: 'doctor' | 'clinic'; themePreset: string; customDomain?: string | null; draftJson: any };

export function App() {
  const [selected, setSelected] = useState<Page | null>(null);
  const { data, refetch, isLoading } = useQuery({ queryKey: ['pages'], queryFn: () => api<Page[]>('/api/admin/pages') });

  const login = async () => {
    const res = await api<{ token: string }>('/api/auth/login', { method: 'POST', body: JSON.stringify({ email: prompt('Email') || '', password: prompt('Senha') || '' }) });
    localStorage.setItem('token', res.token);
    refetch();
  };

  return (
    <div className="min-h-screen p-8 space-y-6">
      <CommandMenu onCreate={() => alert('Use endpoint /api/admin/pages para criar rapidamente no MVP.')} />
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">CLINICLINK Admin</h1>
        <button className="rounded-lg bg-cyan-500 px-4 py-2" onClick={login}>Login superadmin</button>
      </header>
      {isLoading && <div className="animate-pulse h-24 bg-slate-800 rounded-xl" />}
      <div className="grid md:grid-cols-2 gap-4">
        {data?.map((page) => (
          <motion.button whileHover={{ y: -4 }} key={page.id} className="rounded-2xl border border-slate-700 p-4 text-left bg-slate-900" onClick={() => setSelected(page)}>
            <p className="text-sm text-slate-400">{page.type} · {page.status}</p>
            <h2 className="text-xl font-medium">/{page.slug}</h2>
            <p className="text-slate-300">Tema: {page.themePreset}</p>
          </motion.button>
        ))}
      </div>
      {selected && (
        <section className="grid lg:grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-700 p-4 bg-slate-900">
            <h3 className="font-semibold mb-2">Publish checklist</h3>
            <Checklist draft={selected.draftJson} type={selected.type} />
            <div className="mt-4 flex gap-2">
              <a className="rounded bg-slate-700 px-3 py-2" href={`/p/${selected.slug}`} target="_blank">Preview</a>
              <button className="rounded bg-emerald-600 px-3 py-2" onClick={async () => { await api(`/api/admin/pages/${selected.id}/publish`, { method: 'POST' }); alert('Publicado'); }}>Publish</button>
              <a className="rounded bg-slate-700 px-3 py-2" href={`/p/${selected.slug}/qr/page.png`} target="_blank">QR página</a>
            </div>
          </div>
          <iframe className="w-full min-h-96 rounded-xl border border-slate-700" src={`/p/${selected.slug}`} title="preview" />
        </section>
      )}
    </div>
  );
}
