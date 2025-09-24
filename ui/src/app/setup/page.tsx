'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function SetupPage() {
  const [email, setEmail] = useState<string>('root@local');
  const [password, setPassword] = useState<string>('changeme');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasUsers, setHasUsers] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkHasUsers = async (): Promise<void> => {
      try {
        const res = await apiFetch<{ hasUsers: boolean }>('/auth/has-users');
        if (res.hasUsers) {
          router.replace('/login');
        } else {
          setHasUsers(false);
        }
      } catch {
        // Si falla, dejamos ver el formulario por si es el primer arranque
        setHasUsers(false);
      }
    };
    checkHasUsers();
  }, [router]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await apiFetch('/auth/register-root', { method: 'POST', body: { email, password } });
      // Iniciar sesión automáticamente y guardar token
      const login = await apiFetch<{ access_token: string }>('/auth/login', {
        method: 'POST',
        body: { email, password },
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('jwt', login.access_token);
      }
      router.push('/dashboard');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      setError(message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Setup</h1>
      <p>Crea el usuario root si aún no existe.</p>
      {hasUsers === null ? (
        <p>Verificando instalación...</p>
      ) : (
        <form onSubmit={onSubmit}>
        <div>
          <label>Email</label>
          <input value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Password</label>
          <input type='password' value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />
        </div>
        <button type='submit' disabled={loading}>{loading ? 'Creando...' : 'Crear root'}</button>
        </form>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
