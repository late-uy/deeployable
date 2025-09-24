"use client";
import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";

type Project = {
  id: number;
  name: string;
  repoUrl: string;
  branch: string;
  runtimePort: number;
};

type Environment = {
  id: number;
  projectId: number;
  name: string;
  subdomainPrefix: string;
  envVars: Record<string, string>;
};

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [envs, setEnvs] = useState<Environment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const envsByProject = useMemo(() => {
    const map: Record<number, Environment[]> = {};
    for (const e of envs) {
      if (!map[e.projectId]) map[e.projectId] = [];
      map[e.projectId].push(e);
    }
    return map;
  }, [envs]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [p, e] = await Promise.all([
          apiFetch<Project[]>("/projects"),
          apiFetch<Environment[]>("/environments"),
        ]);
        setProjects(p);
        setEnvs(e);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        setError(message || "Error");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const createEnv = async (projectId: number): Promise<void> => {
    const name = prompt("Nombre del ambiente");
    if (!name) return;
    const subdomainPrefix = prompt("Subdominio (prefijo)", name.toLowerCase().replace(/\s+/g, "-")) || name;
    try {
      const created = await apiFetch<Environment>("/environments", {
        method: "POST",
        body: { projectId, name, subdomainPrefix, envVars: {} },
      });
      setEnvs((prev) => [...prev, created]);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      alert(message || "Error");
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
      alert(message || "Error");
    }
  };

  const deleteEnv = async (env: Environment): Promise<void> => {
    if (!confirm(`Eliminar ambiente ${env.name}?`)) return;
    try {
      await apiFetch(`/environments/${env.id}`, { method: "DELETE" });
      setEnvs((prev) => prev.filter((e) => e.id !== env.id));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      alert(message || "Error");
    }
  };

  if (loading) return <div style={{ padding: 24 }}>Cargando...</div>;
  if (error) return <div style={{ padding: 24, color: "red" }}>{error}</div>;

  return (
    <div style={{ padding: 24 }}>
      <h1>Dashboard</h1>
      <p>Proyectos y ambientes</p>
      <div style={{ margin: '8px 0 16px' }}>
        <button
          onClick={async (): Promise<void> => {
            const name = prompt('Nombre del proyecto');
            if (!name) return;
            const repoUrl = prompt('Repo URL (https://...)', 'https://example.com/repo.git') || 'https://example.com/repo.git';
            const branch = prompt('Branch', 'main') || 'main';
            const buildCmd = prompt('Build command', 'npm run build') || 'npm run build';
            const startCmd = prompt('Start command', 'npm start') || 'npm start';
            const runtimePortInput = prompt('Puerto de runtime', '3000') || '3000';
            const runtimePort = Number(runtimePortInput);
            if (!Number.isFinite(runtimePort) || runtimePort <= 0) {
              alert('Puerto inválido');
              return;
            }
            try {
              const created = await apiFetch<Project>('/projects', {
                method: 'POST',
                body: { name, repoUrl, branch, buildCmd, startCmd, runtimePort },
              });
              setProjects((prev) => [...prev, created]);
            } catch (error: unknown) {
              const message = error instanceof Error ? error.message : String(error);
              alert(message || 'Error');
            }
          }}
        >
          Nuevo Proyecto
        </button>
      </div>
      <div style={{ display: "grid", gap: 16 }}>
        {projects.map((p) => (
          <div key={p.id} style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
            <h2 style={{ margin: 0 }}>
              <a href={`/dashboard/projects/${p.id}`}>{p.name}</a>
            </h2>
            <div style={{ color: "#666", fontSize: 12 }}>
              <div>Repo: {p.repoUrl} (branch: {p.branch})</div>
              <div>Port: {p.runtimePort}</div>
            </div>
            <div style={{ marginTop: 8 }}>
              <button onClick={() => createEnv(p.id)}>+ Ambiente</button>
            </div>
            <ul>
              {(envsByProject[p.id] || []).map((e) => (
                <li key={e.id}>
                  <b>{e.name}</b> — {e.subdomainPrefix}
                  <button style={{ marginLeft: 8 }} onClick={() => updateEnv(e)}>Editar</button>
                  <button style={{ marginLeft: 4 }} onClick={() => deleteEnv(e)}>Eliminar</button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
