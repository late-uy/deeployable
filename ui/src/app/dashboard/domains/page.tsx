'use client';

import { FormEvent, useEffect, useState } from 'react';
import { apiFetch } from '../../../lib/api';

interface Environment {
  id: number;
  name: string;
}

interface Domain {
  id: number;
  hostname: string;
  verified: boolean;
  verificationToken: string;
}

export default function DomainsPage() {
  const [token, setToken] = useState<string | null>(null);
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [hostname, setHostname] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('deeployable_token');
    setToken(stored);
    if (!stored) return;
    apiFetch<Environment[]>('/environments', {}, stored).then((envs) => {
      setEnvironments(envs);
      if (envs[0]) setSelected(envs[0].id);
    });
  }, []);

  useEffect(() => {
    if (!token || !selected) return;
    apiFetch<Domain[]>(`/domains?environmentId=${selected}`, {}, token).then(setDomains);
  }, [token, selected]);

  if (!token) {
    return <p>Inicia sesión para administrar dominios.</p>;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!selected) return;
    await apiFetch('/domains', {
      method: 'POST',
      body: JSON.stringify({ environmentId: selected, hostname }),
    }, token);
    setHostname('');
    const list = await apiFetch<Domain[]>(`/domains?environmentId=${selected}`, {}, token);
    setDomains(list);
  }

  async function verify(id: number, verified: boolean) {
    await apiFetch(`/domains/${id}/verify`, {
      method: 'POST',
      body: JSON.stringify({ verified }),
    }, token);
    const list = await apiFetch<Domain[]>(`/domains?environmentId=${selected}`, {}, token);
    setDomains(list);
  }

  return (
    <section className="table">
      <h1>Dominios</h1>
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
      {selected && (
        <>
          <form onSubmit={handleSubmit}>
            <label>
              Hostname
              <input value={hostname} onChange={(e) => setHostname(e.target.value)} required />
            </label>
            <button type="submit">Añadir</button>
          </form>
          <ul>
            {domains.map((domain) => (
              <li key={domain.id}>
                <div>
                  <strong>{domain.hostname}</strong>
                  <div>Token DNS: {domain.verificationToken}</div>
                  <div>Estado: {domain.verified ? 'Verificado' : 'Pendiente'}</div>
                </div>
                <button type="button" onClick={() => verify(domain.id, !domain.verified)}>
                  {domain.verified ? 'Marcar pendiente' : 'Marcar verificado'}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
