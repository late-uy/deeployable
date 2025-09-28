'use client';

import { FormEvent, useEffect, useState } from 'react';
import { apiFetch } from '../../../lib/api';

interface Environment {
  id: number;
  name: string;
  branch: string;
}

export default function EnvironmentsPage() {
  const [token, setToken] = useState<string | null>(null);
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [name, setName] = useState('');
  const [branch, setBranch] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('deeployable_token');
    setToken(stored);
    if (!stored) return;
    apiFetch<Environment[]>('/environments', {}, stored)
      .then(setEnvironments)
      .catch((err) => setError(err.message));
  }, []);

  if (!token) {
    return <p>Necesitas iniciar sesión para gestionar entornos.</p>;
  }

  async function refresh() {
    const list = await apiFetch<Environment[]>('/environments', {}, token);
    setEnvironments(list);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    try {
      await apiFetch('/environments', {
        method: 'POST',
        body: JSON.stringify({ name, branch }),
      }, token);
      setName('');
      setBranch('');
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    }
  }

  async function remove(id: number) {
    await apiFetch(`/environments/${id}`, { method: 'DELETE' }, token);
    await refresh();
  }

  return (
    <section className="table">
      <h1>Entornos</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Nombre
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Rama
          <input value={branch} onChange={(e) => setBranch(e.target.value)} required />
        </label>
        <button type="submit">Crear entorno</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {environments.map((env) => (
          <li key={env.id}>
            <span>
              {env.name} → {env.branch}
            </span>
            <button type="button" onClick={() => remove(env.id)}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
