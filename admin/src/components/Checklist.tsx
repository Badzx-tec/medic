export function Checklist({ draft, type }: { draft: any; type: 'doctor' | 'clinic' }) {
  const checks = type === 'doctor'
    ? [!!draft?.professional?.name, !!draft?.professional?.crmNumber, !!draft?.professional?.crmUF, !!draft?.professional?.specialty]
    : [!!draft?.clinic?.clinicName, !!draft?.clinic?.clinicCrmRegistration, !!draft?.clinic?.directorName, !!draft?.clinic?.directorCrm];
  return <ul className="space-y-2 text-sm">{checks.map((ok, i) => <li key={i} className={ok ? 'text-emerald-400' : 'text-amber-400'}>{ok ? '✓' : '!'} Item {i + 1}</li>)}</ul>;
}
