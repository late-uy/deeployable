'use client';

import { FormEvent, useEffect, useState } from 'react';
import { apiFetch } from '../../../lib/api';

interface Environment {
  id: number;
  name: string;
}

interface Variable {
  id: number;
  key: string;
  isSecret: boolean;
}

export default function VariablesPage() {
  const [token, setToken] = useState<string | null>(null);
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [variables, setVariables] = useState<Variable[]>([]);
  const [keyName, setKeyName] = useState('');
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('deeployable_token');
    setToken(stored);
    if (!stored) return;
    apiFetch<Environment[]>('/environments', {}, stored).then((envs) => {
      setEnvironments(envs);
      if (envs[0]) {
        setSelected(envs[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (!token || !selected) return;
    apiFetch<Variable[]>(`/variables?environmentId=${selected}`, {}, token).then(setVariables);
  }, [token, selected]);

  if (!token) {
    return <p>Inicia sesión para administrar variables.</p>;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!selected) return;
    await apiFetch('/variables', {
      method: 'POST',
      body: JSON.stringify({ environmentId: selected, key: keyName, value }),
    }, token);
    setKeyName('');
    setValue('');
    const list = await apiFetch<Variable[]>(`/variables?environmentId=${selected}`, {}, token);
    setVariables(list);
  }

  return (
    <section className="table">
      <h1>Variables</h1>
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
              Clave
              <input value={keyName} onChange={(e) => setKeyName(e.target.value)} required />
            </label>
            <label>
              Valor
              <input value={value} onChange={(e) => setValue(e.target.value)} required />
            </label>
            <button type="submit">Guardar</button>
          </form>
          <ul>
            {variables.map((v) => (
              <li key={v.id}>
                {v.key} → {v.isSecret ? '••••••' : 'visible'}
              </li>
            ))}
          </ul>
        </>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </section>
  );
}
