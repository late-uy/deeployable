"use client";
import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";

type Environment = {
  id: number;
  projectId: number;
  name: string;
  subdomainPrefix: string;
  envVars: Record<string, string>;
};

export default function ProjectEnvironments({ params }: { params: { id: string } }) {
  const projectId = Number(params.id);
  const [envs, setEnvs] = useState<Environment[]>([]);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => envs.filter((e) => e.projectId === projectId), [envs, projectId]);

  useEffect(() => {
    const load = async () => {
      try {
        const all = await apiFetch<Environment[]>(`/environments`);
        setEnvs(all);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        setError(message);
      }
    };
    load();
  }, [projectId]);

  const createEnv = async (): Promise<void> => {
    const name = prompt("Nombre del ambiente");
    if (!name) return;
    const subdomainPrefix = prompt("Subdominio", name.toLowerCase().replace(/\s+/g, "-")) || name;
    try {
      const created = await apiFetch<Environment>(`/projects/${projectId}/environments`, {
        method: "POST",
        body: { name, subdomainPrefix, envVars: {} },
      });
      setEnvs((prev) => [...prev, created]);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      alert(message);
    }
  };

  const updateEnv = async (env: Environment): Promise<void> => {
    const name = prompt("Nuevo nombre", env.name) || env.name;
    const subdomainPrefix = prompt("Nuevo subdominio", env.subdomainPrefix) || env.subdomainPrefix;
    try {
      const updated = await apiFetch<Environment>(`/environments/${env.id}`, {
        method: "PATCH",
        body: { name, subdomainPrefix },
      });
      setEnvs((prev) => prev.map((e) => (e.id === env.id ? updated : e)));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      alert(message);
    }
  };

  const deleteEnv = async (env: Environment): Promise<void> => {
    if (!confirm(`Eliminar ${env.name}?`)) return;
    try {
      await apiFetch(`/environments/${env.id}`, { method: "DELETE" });
      setEnvs((prev) => prev.filter((e) => e.id !== env.id));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      alert(message);
    }
  };

  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <button onClick={createEnv}>+ Nuevo ambiente</button>
      </div>
      <ul>
        {filtered.map((e) => (
          <li key={e.id}>
            <b>{e.name}</b> — {e.subdomainPrefix}
            <button style={{ marginLeft: 8 }} onClick={() => updateEnv(e)}>
              Editar
            </button>
            <button style={{ marginLeft: 4 }} onClick={() => deleteEnv(e)}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}


