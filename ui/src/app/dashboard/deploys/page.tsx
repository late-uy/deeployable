'use client';

import { FormEvent, useEffect, useState } from 'react';
import { apiFetch } from '../../../lib/api';

interface Environment {
  id: number;
  name: string;
}

interface Deploy {
  id: number;
  status: string;
  startedAt: string | null;
  finishedAt: string | null;
}

export default function DeploysPage() {
  const [token, setToken] = useState<string | null>(null);
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [deploys, setDeploys] = useState<Deploy[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('deeployable_token');
    setToken(stored);
    if (!stored) return;
    apiFetch<Environment[]>('/environments', {}, stored).then((envs) => {
      setEnvironments(envs);
      if (envs[0]) setSelected(envs[0].id);
    });
    refreshDeploys(stored);
    const interval = setInterval(() => stored && refreshDeploys(stored), 3000);
    return () => clearInterval(interval);
  }, []);

  async function refreshDeploys(authToken: string) {
    const list = await apiFetch<Deploy[]>('/deploys', {}, authToken);
    setDeploys(list);
  }

  if (!token) {
    return <p>Inicia sesión para gestionar despliegues.</p>;
  }

  async function handleTrigger(event: FormEvent) {
    event.preventDefault();
    if (!selected) return;
    await apiFetch('/deploys', {
      method: 'POST',
      body: JSON.stringify({ environmentId: selected }),
    }, token);
    await refreshDeploys(token);
  }

  return (
    <section className="table">
      <h1>Despliegues</h1>
      <form onSubmit={handleTrigger}>
        <label>
          Entorno
          <select value={selected ?? ''} onChange={(e) => setSelected(Number(e.target.value))}>
            {environments.map((env) => (
              <option key={env.id} value={env.id}>
                {env.name}
              </option>
            ))}
          </select>
        </label>
        <button type="submit">Lanzar despliegue</button>
      </form>
      <ul>
        {deploys.map((deploy) => (
          <li key={deploy.id}>
            <span>
              #{deploy.id} → {deploy.status}
            </span>
            <span>
              Inicio: {deploy.startedAt ?? '—'} · Fin: {deploy.finishedAt ?? '—'}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
