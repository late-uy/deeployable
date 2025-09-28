'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../../lib/api';

export default function SetupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hasUsers, setHasUsers] = useState<boolean | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<{ hasUsers: boolean }>('/auth/has-users')
      .then((res) => setHasUsers(res.hasUsers))
      .catch(() => setHasUsers(true));
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    try {
      await apiFetch('/auth/register-root', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setMessage('Administrador creado. Ya puedes iniciar sesión.');
      router.push('/(auth)/login');
    } catch (error) {
      setMessage('No se pudo crear el administrador: ' + (error as Error).message);
    }
  }

  if (hasUsers === null) {
    return <p>Comprobando instalación...</p>;
  }

  if (hasUsers) {
    return <p>La instalación ya está configurada. Ve a iniciar sesión.</p>;
  }

  return (
    <section className="table">
      <h1>Crear administrador</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Correo
          <input value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />
        </label>
        <button type="submit">Crear</button>
      </form>
      {message && <p>{message}</p>}
    </section>
  );
}
