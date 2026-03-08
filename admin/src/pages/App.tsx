import * as Tabs from '@radix-ui/react-tabs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  CheckCircle2,
  Globe,
  ImagePlus,
  LayoutTemplate,
  Loader2,
  LogOut,
  RefreshCw,
  Save,
  ShieldCheck,
  Sparkles,
  Wand2
} from 'lucide-react';
import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { Checklist } from '../components/Checklist';
import {
  FeatureCard,
  FeedbackBanner,
  Field,
  inputClass,
  LinkCard,
  ObjectListEditor,
  SectionCard,
  SkeletonCard,
  textareaClass,
  TextListField
} from '../components/EditorBlocks';
import { MediaAssetField } from '../components/MediaField';
import { api } from '../lib/api';
import { createEditableDraft, getStatusTone, setDraftValue, slugToLabel, type PageRecord, type PageType } from '../lib/editor';

type EditorState = {
  id: string;
  type: PageType;
  status: string;
  slug: string;
  themePreset: string;
  customDomain: string;
  accountLabel: string;
  draft: any;
};

type LoginFormState = { email: string; password: string };
type FeedbackState = { tone: 'success' | 'error' | 'info'; message: string } | null;

const tabClass =
  'rounded-full px-4 py-2 text-sm font-medium transition data-[state=active]:bg-white data-[state=active]:text-slate-950 data-[state=inactive]:text-slate-300 data-[state=inactive]:hover:bg-white/[0.06]';

const themePresets = [
  { value: 'clinic-trust', label: 'Clinic Trust' },
  { value: 'clinic-modern', label: 'Clinic Modern' },
  { value: 'clinic-editorial', label: 'Clinic Editorial' }
];

function makeEditorState(page: PageRecord): EditorState {
  return {
    id: page.id,
    type: page.type,
    status: page.status,
    slug: page.slug,
    themePreset: page.themePreset,
    customDomain: page.customDomain ?? '',
    accountLabel: page.account?.name ?? page.account?.email ?? page.accountId,
    draft: createEditableDraft(page.draftJson, page.type)
  };
}

export function App() {
  const queryClient = useQueryClient();
  const [sessionToken, setSessionToken] = useState(() => localStorage.getItem('token'));
  const [loginForm, setLoginForm] = useState<LoginFormState>({ email: '', password: '' });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [previewNonce, setPreviewNonce] = useState(0);

  const pagesQuery = useQuery({
    queryKey: ['pages'],
    queryFn: () => api<PageRecord[]>('/api/admin/pages'),
    enabled: Boolean(sessionToken)
  });

  const pages = pagesQuery.data ?? [];
  const selectedPage = pages.find((page) => page.id === selectedId) ?? pages[0] ?? null;

  useEffect(() => {
    if (!pages.length) return;
    if (!selectedId) setSelectedId(pages[0].id);
  }, [pages, selectedId]);

  useEffect(() => {
    if (!selectedPage) {
      setEditor(null);
      return;
    }
    setEditor((current) => (current && current.id === selectedPage.id ? current : makeEditorState(selectedPage)));
  }, [selectedPage]);

  const isDirty = useMemo(() => {
    if (!editor || !selectedPage) return false;
    return JSON.stringify({
      slug: editor.slug,
      customDomain: editor.customDomain || null,
      themePreset: editor.themePreset,
      draftJson: editor.draft
    }) !== JSON.stringify({
      slug: selectedPage.slug,
      customDomain: selectedPage.customDomain || null,
      themePreset: selectedPage.themePreset,
      draftJson: selectedPage.draftJson
    });
  }, [editor, selectedPage]);

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const publicUrl = selectedPage ? `${origin}/p/${selectedPage.slug}` : '';
  const robotsUrl = `${origin}/robots.txt`;
  const sitemapUrl = `${origin}/sitemap.xml`;

  const loginMutation = useMutation({
    mutationFn: (payload: LoginFormState) =>
      api<{ token: string }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload)
      }),
    onSuccess: (result) => {
      localStorage.setItem('token', result.token);
      setSessionToken(result.token);
      setFeedback({ tone: 'success', message: 'Sessão autenticada. Editor liberado.' });
      queryClient.invalidateQueries({ queryKey: ['pages'] });
    },
    onError: (error) => setFeedback({ tone: 'error', message: error instanceof Error ? error.message : 'Falha ao autenticar.' })
  });

  const saveMutation = useMutation({
    mutationFn: (payload: EditorState) =>
      api<PageRecord>(`/api/admin/pages/${payload.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          slug: payload.slug,
          customDomain: payload.customDomain || null,
          themePreset: payload.themePreset,
          draftJson: payload.draft
        })
      }),
    onSuccess: (result) => {
      queryClient.setQueryData<PageRecord[]>(['pages'], (current) => current?.map((page) => (page.id === result.id ? result : page)) ?? [result]);
      setSelectedId(result.id);
      setEditor(makeEditorState(result));
      setPreviewNonce((value) => value + 1);
      setFeedback({ tone: 'success', message: 'Página salva. Preview pronto para revisão.' });
    },
    onError: (error) => setFeedback({ tone: 'error', message: error instanceof Error ? error.message : 'Falha ao salvar.' })
  });

  const publishMutation = useMutation({
    mutationFn: (id: string) => api<PageRecord>(`/api/admin/pages/${id}/publish`, { method: 'POST' }),
    onSuccess: (result) => {
      queryClient.setQueryData<PageRecord[]>(['pages'], (current) => current?.map((page) => (page.id === result.id ? result : page)) ?? [result]);
      setSelectedId(result.id);
      setEditor(makeEditorState(result));
      setPreviewNonce((value) => value + 1);
      setFeedback({ tone: 'success', message: 'Página publicada.' });
    },
    onError: (error) => setFeedback({ tone: 'error', message: error instanceof Error ? error.message : 'Falha ao publicar.' })
  });

  const uploadMutation = useMutation({
    mutationFn: (payload: { pageId: string; kind: string; dataUrl: string }) =>
      api<{ url: string }>(`/api/admin/pages/${payload.pageId}/media`, {
        method: 'POST',
        body: JSON.stringify(payload)
      })
  });

  const updateMeta = (field: 'slug' | 'themePreset' | 'customDomain', value: string) => {
    setEditor((current) => (current ? { ...current, [field]: value } : current));
  };

  const updateDraft = (path: Array<string | number>, value: unknown) => {
    setEditor((current) => (current ? { ...current, draft: setDraftValue(current.draft, path, value) } : current));
  };

  const uploadMedia = async (path: Array<string | number>, kind: string, dataUrl: string) => {
    if (!editor) return;
    try {
      const result = await uploadMutation.mutateAsync({ pageId: editor.id, kind, dataUrl });
      updateDraft(path, result.url);
      setFeedback({ tone: 'success', message: 'Imagem pronta. Salve a página para persistir a referência.' });
    } catch (error) {
      setFeedback({ tone: 'error', message: error instanceof Error ? error.message : 'Falha ao enviar imagem.' });
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setSessionToken(null);
    setSelectedId(null);
    setEditor(null);
    queryClient.removeQueries({ queryKey: ['pages'] });
    setFeedback({ tone: 'info', message: 'Sessão encerrada.' });
  };

  const submitLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    loginMutation.mutate(loginForm);
  };

  if (!sessionToken) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,#12324b,transparent_42%),linear-gradient(180deg,#030712,#08111d)] px-6 py-10 text-slate-50">
        <div className="mx-auto grid min-h-[calc(100vh-80px)] max-w-6xl items-center gap-10 lg:grid-cols-[1.2fr,420px]">
          <div className="space-y-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100">
              <ShieldCheck className="h-4 w-4" />
              Public Experience Studio
            </span>
            <div className="space-y-5">
              <h1 className="max-w-3xl text-5xl font-semibold tracking-[-0.05em] text-white">Editor premium para páginas públicas médicas.</h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300">
                Ajuste identidade, copy institucional, SEO, assets e publicação do tenant em uma superfície única, focada em venda e confiança.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <FeatureCard icon={<Wand2 className="h-5 w-5" />} title="Editor guiado" description="Estruture hero, confiança, especialidades, FAQ e CTA sem editar JSON bruto." />
              <FeatureCard icon={<ImagePlus className="h-5 w-5" />} title="Mídia tratada" description="Suba portrait, hero e social image com crop antes de salvar." />
              <FeatureCard icon={<Globe className="h-5 w-5" />} title="SEO operacional" description="Sitemap, robots e validação de structured data entram no build." />
            </div>
          </div>

          <motion.form layout onSubmit={submitLogin} className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 shadow-[0_35px_120px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">Superadmin</p>
              <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white">Entrar no editor</h2>
              <p className="text-sm leading-6 text-slate-400">Use as credenciais administrativas para gerenciar tenants e publicar páginas.</p>
            </div>
            <div className="mt-8 space-y-5">
              <Field label="E-mail"><input value={loginForm.email} onChange={(event) => setLoginForm((current) => ({ ...current, email: event.target.value }))} className={inputClass} autoComplete="email" /></Field>
              <Field label="Senha"><input value={loginForm.password} onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))} className={inputClass} type="password" autoComplete="current-password" /></Field>
            </div>
            {feedback && <FeedbackBanner className="mt-6" tone={feedback.tone} message={feedback.message} />}
            <button type="submit" className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:opacity-60" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Acessar editor'}
            </button>
          </motion.form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05101a] text-slate-50">
      <div className="mx-auto max-w-[1600px] px-4 py-4 md:px-6">
        <header className="mb-4 flex flex-col gap-4 rounded-[28px] border border-white/10 bg-white/[0.04] px-5 py-5 backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-100">
              <Sparkles className="h-3.5 w-3.5" />
              ClinicLink Public Studio
            </div>
            <h1 className="text-2xl font-semibold tracking-[-0.04em] text-white">Operação pública do tenant</h1>
            <p className="text-sm text-slate-400">Editor guiado para branding, conteúdo institucional, mídia pública e publicação com SEO validado.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a href={sitemapUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-slate-200 transition hover:bg-white/[0.06]">
              <Globe className="h-4 w-4" />
              Sitemap
            </a>
            <button type="button" onClick={logout} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-slate-200 transition hover:bg-white/[0.06]">
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        </header>

        {feedback && <FeedbackBanner className="mb-4" tone={feedback.tone} message={feedback.message} />}
        {pagesQuery.isError && <FeedbackBanner className="mb-4" tone="error" message={pagesQuery.error instanceof Error ? pagesQuery.error.message : 'Não foi possível carregar as páginas.'} />}

        <div className="grid gap-4 xl:grid-cols-[290px,minmax(0,1fr),420px]">
          <aside className="rounded-[28px] border border-white/10 bg-white/[0.04] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Tenants</p>
                <h2 className="mt-1 text-lg font-semibold text-white">Páginas públicas</h2>
              </div>
              <button type="button" onClick={() => pagesQuery.refetch()} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-slate-200 transition hover:bg-white/[0.06]">
                <RefreshCw className={`h-4 w-4 ${pagesQuery.isFetching ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {pagesQuery.isLoading && (<><SkeletonCard /><SkeletonCard /></>)}
              {pages.map((page) => {
                const active = page.id === selectedPage?.id;
                return (
                  <motion.button
                    key={page.id}
                    whileHover={{ y: -2 }}
                    type="button"
                    onClick={() => setSelectedId(page.id)}
                    className={`w-full rounded-[24px] border px-4 py-4 text-left transition ${active ? 'border-cyan-400/35 bg-cyan-400/[0.10]' : 'border-white/10 bg-[#08111b] hover:bg-[#0b1624]'}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-base font-semibold text-white">{page.draftJson?.branding?.logoText || slugToLabel(page.slug)}</p>
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${getStatusTone(page.status)}`}>{page.status}</span>
                    </div>
                    <p className="mt-1 text-sm text-slate-400">/{page.slug}</p>
                    <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                      <span>{page.type === 'doctor' ? 'Médico' : 'Clínica'}</span>
                      <span>{page.account?.name ?? 'Conta principal'}</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </aside>

          <main className="rounded-[28px] border border-white/10 bg-white/[0.04] p-4 md:p-5">
            {!editor ? (
              <div className="grid min-h-[720px] place-items-center rounded-[24px] border border-dashed border-white/10 bg-[#08111b] text-center">
                <div className="max-w-md space-y-3 px-6">
                  <LayoutTemplate className="mx-auto h-10 w-10 text-slate-500" />
                  <h2 className="text-2xl font-semibold text-white">Nenhuma página selecionada</h2>
                  <p className="text-sm leading-6 text-slate-400">Escolha um tenant para editar conteúdo, revisar mídia e publicar.</p>
                </div>
              </div>
            ) : (
              <Tabs.Root defaultValue="positioning" className="space-y-5">
                <div className="flex flex-col gap-4 rounded-[24px] border border-white/10 bg-[#08111b] px-5 py-5 xl:flex-row xl:items-start xl:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${getStatusTone(editor.status)}`}>{editor.status}</span>
                      <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-400">{editor.type === 'doctor' ? 'Perfil médico' : 'Página de clínica'}</span>
                    </div>
                    <h2 className="text-3xl font-semibold tracking-[-0.05em] text-white">{editor.draft.branding.logoText || slugToLabel(editor.slug)}</h2>
                    <p className="text-sm text-slate-400">Conta {editor.accountLabel} · preview público salvo em {selectedPage ? `/p/${selectedPage.slug}` : '/p/...'}</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <a href={selectedPage ? `/p/${selectedPage.slug}` : '#'} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-slate-100 transition hover:bg-white/[0.06]">
                      <ArrowUpRight className="h-4 w-4" />
                      Abrir preview
                    </a>
                    <button type="button" onClick={() => editor && saveMutation.mutate(editor)} disabled={!isDirty || saveMutation.isPending} className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/15 px-4 py-2.5 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/20 disabled:opacity-50">
                      {saveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      Salvar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!editor) return;
                        if (isDirty) {
                          setFeedback({ tone: 'info', message: 'Salve a página antes de publicar.' });
                          return;
                        }
                        publishMutation.mutate(editor.id);
                      }}
                      disabled={publishMutation.isPending}
                      className="inline-flex items-center gap-2 rounded-full bg-emerald-300 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-200 disabled:opacity-60"
                    >
                      {publishMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                      Publicar
                    </button>
                  </div>
                </div>

                <Tabs.List className="flex flex-wrap gap-2 rounded-full border border-white/10 bg-[#08111b] p-2">
                  <Tabs.Trigger value="positioning" className={tabClass}>Posicionamento</Tabs.Trigger>
                  <Tabs.Trigger value="content" className={tabClass}>Conteúdo</Tabs.Trigger>
                  <Tabs.Trigger value="media" className={tabClass}>Mídia</Tabs.Trigger>
                  <Tabs.Trigger value="seo" className={tabClass}>SEO & publicação</Tabs.Trigger>
                </Tabs.List>

                <Tabs.Content value="positioning" className="space-y-4">
                  <SectionCard title="Base da página" description="Slug, domínio, tema e narrativa principal da experiência pública.">
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                      <Field label="Slug público"><input className={inputClass} value={editor.slug} onChange={(event) => updateMeta('slug', event.target.value)} /></Field>
                      <Field label="Domínio customizado"><input className={inputClass} value={editor.customDomain} onChange={(event) => updateMeta('customDomain', event.target.value)} placeholder="medico.com.br" /></Field>
                      <Field label="Tema visual"><select className={inputClass} value={editor.themePreset} onChange={(event) => updateMeta('themePreset', event.target.value)}>{themePresets.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></Field>
                      <Field label="Cor de destaque">
                        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#09121d] px-4 py-3">
                          <input type="color" value={editor.draft.branding.accentColor} onChange={(event) => updateDraft(['branding', 'accentColor'], event.target.value)} className="h-10 w-12 rounded-lg border-0 bg-transparent" />
                          <input value={editor.draft.branding.accentColor} onChange={(event) => updateDraft(['branding', 'accentColor'], event.target.value)} className="w-full bg-transparent text-sm text-slate-50 outline-none" />
                        </div>
                      </Field>
                    </div>
                  </SectionCard>
                  <SectionCard title="Branding editorial" description="Mensagem superior, assinatura visual e posicionamento institucional.">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Marca textual"><input className={inputClass} value={editor.draft.branding.logoText} onChange={(event) => updateDraft(['branding', 'logoText'], event.target.value)} /></Field>
                      <Field label="Eyebrow"><input className={inputClass} value={editor.draft.branding.eyebrow} onChange={(event) => updateDraft(['branding', 'eyebrow'], event.target.value)} /></Field>
                    </div>
                    <Field label="Tagline premium"><textarea className={textareaClass} rows={3} value={editor.draft.branding.tagline} onChange={(event) => updateDraft(['branding', 'tagline'], event.target.value)} /></Field>
                  </SectionCard>
                  <SectionCard title="SEO principal" description="Title, description e canonical com linguagem institucional.">
                    <Field label="Title tag"><input className={inputClass} value={editor.draft.seo.title} onChange={(event) => updateDraft(['seo', 'title'], event.target.value)} /></Field>
                    <Field label="Meta description"><textarea className={textareaClass} rows={4} value={editor.draft.seo.description} onChange={(event) => updateDraft(['seo', 'description'], event.target.value)} /></Field>
                    <Field label="Canonical path" hint="Opcional"><input className={inputClass} value={editor.draft.seo.canonicalPath ?? ''} onChange={(event) => updateDraft(['seo', 'canonicalPath'], event.target.value)} placeholder="/dermatologia" /></Field>
                  </SectionCard>
                </Tabs.Content>

                <Tabs.Content value="content" className="space-y-4">
                  {editor.type === 'doctor' ? (
                    <SectionCard title="Identificação profissional" description="Campos públicos obrigatórios para o perfil do médico.">
                      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        <Field label="Nome profissional"><input className={inputClass} value={editor.draft.professional.name} onChange={(event) => updateDraft(['professional', 'name'], event.target.value)} /></Field>
                        <Field label="Especialidade"><input className={inputClass} value={editor.draft.professional.specialty} onChange={(event) => updateDraft(['professional', 'specialty'], event.target.value)} /></Field>
                        <Field label="Headline institucional"><input className={inputClass} value={editor.draft.professional.headline ?? ''} onChange={(event) => updateDraft(['professional', 'headline'], event.target.value)} /></Field>
                        <Field label="CRM"><input className={inputClass} value={editor.draft.professional.crmNumber} onChange={(event) => updateDraft(['professional', 'crmNumber'], event.target.value)} /></Field>
                        <Field label="UF"><input className={inputClass} value={editor.draft.professional.crmUF} onChange={(event) => updateDraft(['professional', 'crmUF'], event.target.value.toUpperCase())} maxLength={2} /></Field>
                        <Field label="RQE"><input className={inputClass} value={editor.draft.professional.rqeNumber ?? ''} onChange={(event) => updateDraft(['professional', 'rqeNumber'], event.target.value)} /></Field>
                      </div>
                    </SectionCard>
                  ) : (
                    <>
                      <SectionCard title="Identificação da clínica" description="Informações institucionais e direção técnica.">
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                          <Field label="Nome da clínica"><input className={inputClass} value={editor.draft.clinic.clinicName} onChange={(event) => updateDraft(['clinic', 'clinicName'], event.target.value)} /></Field>
                          <Field label="Registro da clínica"><input className={inputClass} value={editor.draft.clinic.clinicCrmRegistration} onChange={(event) => updateDraft(['clinic', 'clinicCrmRegistration'], event.target.value)} /></Field>
                          <Field label="Diretor técnico"><input className={inputClass} value={editor.draft.clinic.directorName} onChange={(event) => updateDraft(['clinic', 'directorName'], event.target.value)} /></Field>
                          <Field label="CRM do diretor"><input className={inputClass} value={editor.draft.clinic.directorCrm} onChange={(event) => updateDraft(['clinic', 'directorCrm'], event.target.value)} /></Field>
                        </div>
                        <Field label="Resumo institucional"><textarea className={textareaClass} rows={3} value={editor.draft.clinic.summary ?? ''} onChange={(event) => updateDraft(['clinic', 'summary'], event.target.value)} /></Field>
                      </SectionCard>
                      <ObjectListEditor
                        title="Equipe clínica"
                        description="Exiba equipe com papel institucional e identificação pública."
                        items={editor.draft.team}
                        createItem={() => ({ name: '', crmNumber: '', crmUF: '', specialty: '', role: '', rqeNumber: '' })}
                        addLabel="Adicionar profissional"
                        onChange={(value) => updateDraft(['team'], value)}
                        fields={[
                          { key: 'name', label: 'Nome' },
                          { key: 'role', label: 'Cargo' },
                          { key: 'specialty', label: 'Especialidade' },
                          { key: 'crmNumber', label: 'CRM' },
                          { key: 'crmUF', label: 'UF' },
                          { key: 'rqeNumber', label: 'RQE' }
                        ]}
                      />
                    </>
                  )}

                  <SectionCard title="Apresentação e diferenciais" description="Texto humano e institucional, sem claims sensacionalistas.">
                    <Field label="Resumo do atendimento"><textarea className={textareaClass} rows={5} value={editor.draft.about.summary} onChange={(event) => updateDraft(['about', 'summary'], event.target.value)} /></Field>
                    <Field label="Abordagem"><textarea className={textareaClass} rows={4} value={editor.draft.about.approach} onChange={(event) => updateDraft(['about', 'approach'], event.target.value)} /></Field>
                  </SectionCard>

                  <TextListField label="Diferenciais curtos" description="Usados como chips e sinais de confiança." items={editor.draft.about.highlights} placeholder="Atendimento particular com agenda organizada" onChange={(value) => updateDraft(['about', 'highlights'], value)} />
                  <TextListField label="Credenciais" description="Formação, registros e dados públicos institucionais." items={editor.draft.about.credentials} placeholder="CRM-SP 123456" onChange={(value) => updateDraft(['about', 'credentials'], value)} />
                  <TextListField label="Idiomas" description="Usado no JSON-LD e no bloco de atendimento." items={editor.draft.about.languages} placeholder="Português" onChange={(value) => updateDraft(['about', 'languages'], value)} />

                  <SectionCard title="Contato e localização" description="Estruture formas de conversão, mapa e presença digital.">
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      <Field label="WhatsApp"><input className={inputClass} value={editor.draft.whatsapp.phone} onChange={(event) => updateDraft(['whatsapp', 'phone'], event.target.value)} /></Field>
                      <Field label="Telefone visível"><input className={inputClass} value={editor.draft.contact.phoneDisplay ?? ''} onChange={(event) => updateDraft(['contact', 'phoneDisplay'], event.target.value)} /></Field>
                      <Field label="E-mail"><input className={inputClass} value={editor.draft.contact.email ?? ''} onChange={(event) => updateDraft(['contact', 'email'], event.target.value)} /></Field>
                      <Field label="URL de agendamento"><input className={inputClass} value={editor.draft.contact.bookingUrl ?? ''} onChange={(event) => updateDraft(['contact', 'bookingUrl'], event.target.value)} /></Field>
                      <Field label="Instagram"><input className={inputClass} value={editor.draft.contact.instagramUrl ?? ''} onChange={(event) => updateDraft(['contact', 'instagramUrl'], event.target.value)} /></Field>
                      <Field label="Mensagem WhatsApp"><input className={inputClass} value={editor.draft.whatsapp.message} onChange={(event) => updateDraft(['whatsapp', 'message'], event.target.value)} /></Field>
                    </div>
                    <Field label="Endereço"><input className={inputClass} value={editor.draft.location.address} onChange={(event) => updateDraft(['location', 'address'], event.target.value)} /></Field>
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                      <Field label="Cidade"><input className={inputClass} value={editor.draft.location.city ?? ''} onChange={(event) => updateDraft(['location', 'city'], event.target.value)} /></Field>
                      <Field label="Estado"><input className={inputClass} value={editor.draft.location.state ?? ''} onChange={(event) => updateDraft(['location', 'state'], event.target.value)} /></Field>
                      <Field label="CEP"><input className={inputClass} value={editor.draft.location.postalCode ?? ''} onChange={(event) => updateDraft(['location', 'postalCode'], event.target.value)} /></Field>
                      <Field label="País"><input className={inputClass} value={editor.draft.location.country ?? ''} onChange={(event) => updateDraft(['location', 'country'], event.target.value)} /></Field>
                    </div>
                    <Field label="URL do mapa"><input className={inputClass} value={editor.draft.location.mapsUrl} onChange={(event) => updateDraft(['location', 'mapsUrl'], event.target.value)} /></Field>
                    <Field label="Resumo da localização"><input className={inputClass} value={editor.draft.location.summary ?? ''} onChange={(event) => updateDraft(['location', 'summary'], event.target.value)} /></Field>
                  </SectionCard>

                  <TextListField label="Links sociais adicionais" description="URLs extras usadas em sameAs." items={editor.draft.contact.sameAs ?? []} placeholder="https://linkedin.com/company/..." onChange={(value) => updateDraft(['contact', 'sameAs'], value)} />
                  <TextListField label="Modalidades de consulta" description="Ex.: consulta presencial, retorno programado." items={editor.draft.care.consultationModes} placeholder="Consulta presencial" onChange={(value) => updateDraft(['care', 'consultationModes'], value)} />
                  <TextListField label="Público" description="Ex.: adultos, adolescentes, famílias." items={editor.draft.care.audience} placeholder="Adultos" onChange={(value) => updateDraft(['care', 'audience'], value)} />

                  <ObjectListEditor title="Jornada do atendimento" description="Mostre como o paciente percorre contato, consulta e acompanhamento." items={editor.draft.care.steps} createItem={() => ({ title: '', description: '' })} addLabel="Adicionar etapa" onChange={(value) => updateDraft(['care', 'steps'], value)} fields={[{ key: 'title', label: 'Etapa' }, { key: 'description', label: 'Descrição', multiline: true }]} />
                  <ObjectListEditor title="Serviços e áreas" description="Cards públicos que explicam o escopo clínico sem poluição visual." items={editor.draft.services} createItem={() => ({ name: '', description: '' })} addLabel="Adicionar serviço" onChange={(value) => updateDraft(['services'], value)} fields={[{ key: 'name', label: 'Título' }, { key: 'description', label: 'Descrição', multiline: true }]} />
                  <ObjectListEditor title="Horários" description="Faixa de atendimento e disponibilidade institucional." items={editor.draft.hours} createItem={() => ({ label: '', value: '' })} addLabel="Adicionar horário" onChange={(value) => updateDraft(['hours'], value)} fields={[{ key: 'label', label: 'Faixa' }, { key: 'value', label: 'Horário' }]} />
                  <ObjectListEditor title="FAQ" description="Respostas objetivas para dúvidas comuns." items={editor.draft.faq} createItem={() => ({ q: '', a: '' })} addLabel="Adicionar pergunta" onChange={(value) => updateDraft(['faq'], value)} fields={[{ key: 'q', label: 'Pergunta' }, { key: 'a', label: 'Resposta', multiline: true }]} />
                  {editor.type === 'clinic' && <TextListField label="Convênios / reembolso" description="Use somente políticas reais da operação." items={editor.draft.insurance ?? []} placeholder="Atendimento particular" onChange={(value) => updateDraft(['insurance'], value)} />}
                </Tabs.Content>

                <Tabs.Content value="media" className="space-y-4">
                  <SectionCard title="Assets públicos" description="Uploads são servidos em /uploads/. Use volume persistente em produção para evitar perda de arquivos.">
                    <div className="grid gap-4 xl:grid-cols-2">
                      <MediaAssetField label="Imagem de retrato" description="Principal imagem do hero. Prefira enquadramento vertical." value={editor.draft.branding.portraitUrl ?? ''} aspectRatio={4 / 5} outputWidth={1200} outputHeight={1500} onChange={(value) => updateDraft(['branding', 'portraitUrl'], value)} onUpload={(dataUrl) => uploadMedia(['branding', 'portraitUrl'], 'portrait', dataUrl)} />
                      <MediaAssetField label="Imagem de hero" description="Imagem ampla usada como apoio visual do topo." value={editor.draft.branding.heroImageUrl ?? editor.draft.clinic?.heroImageUrl ?? ''} aspectRatio={16 / 10} outputWidth={1600} outputHeight={1000} onChange={(value) => { updateDraft(['branding', 'heroImageUrl'], value); if (editor.type === 'clinic') updateDraft(['clinic', 'heroImageUrl'], value); }} onUpload={(dataUrl) => uploadMedia(['branding', 'heroImageUrl'], editor.type === 'clinic' ? 'clinic-hero' : 'hero', dataUrl)} />
                      <MediaAssetField label="Imagem social" description="Open Graph e Twitter Cards." value={editor.draft.branding.socialImageUrl ?? ''} aspectRatio={1200 / 630} outputWidth={1200} outputHeight={630} onChange={(value) => updateDraft(['branding', 'socialImageUrl'], value)} onUpload={(dataUrl) => uploadMedia(['branding', 'socialImageUrl'], 'social', dataUrl)} />
                      {editor.type === 'clinic' && <MediaAssetField label="Logo da clínica" description="Opcional. Reforça a marca textual." value={editor.draft.clinic.logoUrl ?? ''} aspectRatio={1} outputWidth={720} outputHeight={720} onChange={(value) => updateDraft(['clinic', 'logoUrl'], value)} onUpload={(dataUrl) => uploadMedia(['clinic', 'logoUrl'], 'clinic-logo', dataUrl)} />}
                    </div>
                  </SectionCard>
                </Tabs.Content>

                <Tabs.Content value="seo" className="space-y-4">
                  <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr),380px]">
                    <SectionCard title="Publicação e consistência" description="Use este painel para revisar se a página está pronta antes de publicar.">
                      <Checklist draft={editor.draft} type={editor.type} />
                    </SectionCard>
                    <SectionCard title="Structured data" description="Esses tipos entram automaticamente na renderização SSR e são validados no build.">
                      <div className="space-y-3">
                        {[editor.type === 'doctor' ? 'Physician' : 'MedicalClinic', 'FAQPage', 'WebPage'].map((type) => (
                          <div key={type} className="rounded-2xl border border-white/10 bg-[#09121d] px-4 py-3 text-sm text-slate-200">{type}</div>
                        ))}
                      </div>
                    </SectionCard>
                  </div>
                  <SectionCard title="Índice técnico" description="Rotas públicas expostas automaticamente para crawler e compartilhamento social.">
                    <div className="grid gap-4 md:grid-cols-2">
                      <LinkCard label="URL pública" value={publicUrl || 'Salve a página para abrir a rota'} href={publicUrl || undefined} />
                      <LinkCard label="Robots" value={robotsUrl} href={robotsUrl} />
                      <LinkCard label="Sitemap" value={sitemapUrl} href={sitemapUrl} />
                      <LinkCard label="Social card" value={selectedPage ? `${origin}/p/${selectedPage.slug}/social-card.svg` : '---'} href={selectedPage ? `${origin}/p/${selectedPage.slug}/social-card.svg` : undefined} />
                    </div>
                  </SectionCard>
                  <TextListField label="Seções publicadas" description="Controle a composição do template SSR e do conteúdo indexável." items={editor.draft.sections ?? []} placeholder="hero" onChange={(value) => updateDraft(['sections'], value)} />
                </Tabs.Content>
              </Tabs.Root>
            )}
          </main>

          <aside className="rounded-[28px] border border-white/10 bg-white/[0.04] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Preview</p>
                <h2 className="mt-1 text-lg font-semibold text-white">Render público</h2>
              </div>
              <button type="button" onClick={() => setPreviewNonce((value) => value + 1)} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-slate-200 transition hover:bg-white/[0.06]">
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 rounded-[24px] border border-white/10 bg-[#08111b] p-3">
              {selectedPage ? (
                <iframe key={`${selectedPage.slug}-${previewNonce}`} className="min-h-[720px] w-full rounded-[18px] border border-white/10 bg-white" src={`/p/${selectedPage.slug}?preview=${previewNonce}`} title="Preview público" />
              ) : (
                <div className="grid min-h-[720px] place-items-center text-sm text-slate-500">Selecione uma página para visualizar.</div>
              )}
            </div>
            <div className="mt-4 space-y-3">
              <LinkCard label="Preview em nova aba" value={selectedPage ? `/p/${selectedPage.slug}` : '---'} href={selectedPage ? `/p/${selectedPage.slug}` : undefined} />
              <LinkCard label="QR da página" value={selectedPage ? `/p/${selectedPage.slug}/qr/page.png` : '---'} href={selectedPage ? `/p/${selectedPage.slug}/qr/page.png` : undefined} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
