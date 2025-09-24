"use client";
import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";

type Deploy = {
  id: number;
  projectId: number;
  environmentId: number;
  sha: string;
  status: "queued" | "running" | "success" | "failed";
  startedAt: string;
  finishedAt?: string | null;
};

type Environment = {
  id: number;
  projectId: number;
  name: string;
};

export default function ProjectDeploys({ params }: { params: { id: string } }) {
  const projectId = Number(params.id);
  const [deploys, setDeploys] = useState<Deploy[]>([]);
  const [envs, setEnvs] = useState<Environment[]>([]);
  const [selectedEnvId, setSelectedEnvId] = useState<number | null>(null);
  const [dockerAvailable, setDockerAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [posting, setPosting] = useState<boolean>(false);

  const projectEnvs = useMemo(() => envs.filter((e) => e.projectId === projectId), [envs, projectId]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [dep, env, health] = await Promise.all([
          apiFetch<Deploy[]>(`/projects/${projectId}/deploys`),
          apiFetch<Environment[]>(`/environments`),
          apiFetch<{ db: boolean; docker: boolean }>(`/platform/health`).catch(() => ({ db: false, docker: false })),
        ]);
        setDeploys(dep);
        setEnvs(env);
        setDockerAvailable(health.docker);
        if (!selectedEnvId && env.length > 0) {
          const first = env.find((e) => e.projectId === projectId);
          if (first) setSelectedEnvId(first.id);
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [projectId]);

  const deployNow = async (): Promise<void> => {
    if (!selectedEnvId) {
      alert("Selecciona un ambiente");
      return;
    }
    try {
      setPosting(true);
      await apiFetch(`/projects/${projectId}/deploys`, {
        method: "POST",
        body: { environmentId: selectedEnvId },
      });
      const refreshed = await apiFetch<Deploy[]>(`/projects/${projectId}/deploys`);
      setDeploys(refreshed);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      alert(message);
    } finally {
      setPosting(false);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {dockerAvailable === false && (
        <div style={{ padding: 8, background: "#fff3cd", border: "1px solid #ffeeba", borderRadius: 6 }}>
          Docker no detectado en el host. Instala Docker para deploys reales.
        </div>
      )}

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <label>Ambiente:</label>
        <select
          value={selectedEnvId ?? ""}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedEnvId(Number(e.target.value))}
        >
          {projectEnvs.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name}
            </option>
          ))}
        </select>
        <button onClick={deployNow} disabled={posting || !selectedEnvId}>
          {posting ? "Deploying..." : "Deploy now"}
        </button>
      </div>

      <div>
        <h3 style={{ margin: "8px 0" }}>Historial</h3>
        {deploys.length === 0 ? (
          <div>No hay deploys aún.</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 6 }}>ID</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 6 }}>Env</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 6 }}>SHA</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 6 }}>Status</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 6 }}>Inicio</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 6 }}>Fin</th>
              </tr>
            </thead>
            <tbody>
              {deploys.map((d) => (
                <tr key={d.id}>
                  <td style={{ padding: 6 }}>{d.id}</td>
                  <td style={{ padding: 6 }}>{projectEnvs.find((e) => e.id === d.environmentId)?.name || d.environmentId}</td>
                  <td style={{ padding: 6 }}>{d.sha?.slice(0, 7) || "-"}</td>
                  <td style={{ padding: 6 }}>{d.status}</td>
                  <td style={{ padding: 6 }}>{d.startedAt ? new Date(d.startedAt).toLocaleString() : "-"}</td>
                  <td style={{ padding: 6 }}>{d.finishedAt ? new Date(d.finishedAt).toLocaleString() : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}


