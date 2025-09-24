'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const match = pathname?.match(/\/dashboard\/projects\/([^/]+)/);
  const id = match?.[1] ?? '';

  const tabs = [
    { href: `/dashboard/projects/${id}`, label: 'Overview', exact: true },
    { href: `/dashboard/projects/${id}/environments`, label: 'Environments' },
    { href: `/dashboard/projects/${id}/deploys`, label: 'Deploys' },
    { href: `/dashboard/projects/${id}/domains`, label: 'Domains' },
    { href: `/dashboard/projects/${id}/settings`, label: 'Settings' },
  ] as const;

  return (
    <div style={{ padding: 24 }}>
      <nav style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        {tabs.map((t) => (
          <Link key={t.href} href={t.href} style={{ fontWeight: pathname === t.href ? 700 : 400 }}>
            {t.label}
          </Link>
        ))}
      </nav>
      {children}
    </div>
  );
}


