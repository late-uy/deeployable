'use client';

import Link from 'next/link';

export default function DashboardPage() {
  return (
    <section className="table">
      <h1>Panel principal</h1>
      <ul>
        <li>
          <Link href="/dashboard/environments">Entornos</Link>
        </li>
        <li>
          <Link href="/dashboard/variables">Variables</Link>
        </li>
        <li>
          <Link href="/dashboard/domains">Dominios</Link>
        </li>
        <li>
          <Link href="/dashboard/deploys">Despliegues</Link>
        </li>
      </ul>
    </section>
  );
}
