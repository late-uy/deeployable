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
  const [creatingJson, setCreatingJson] = useState<string>("{\n  \"KEY\": \"VALUE\"\n}");
  const [creatingName, setCreatingName] = useState<string>("");
  const [creatingSubdomain, setCreatingSubdomain] = useState<string>("");
  const [editingEnvId, setEditingEnvId] = useState<number | null>(null);
  const [editingJson, setEditingJson] = useState<string>("{}");
  const [jsonError, setJsonError] = useState<string | null>(null);

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
    try {
      const parsed = JSON.parse(creatingJson || "{}");
      const name = creatingName.trim();
      const subdomainPrefix = (creatingSubdomain || creatingName).trim() || "env";
      if (!name) {
        alert("Nombre requerido");
        return;
      }
      const created = await apiFetch<Environment>(`/projects/${projectId}/environments`, {
        method: "POST",
        body: { name, subdomainPrefix, envVars: parsed },
      });
      setEnvs((prev) => [...prev, created]);
      setCreatingName("");
      setCreatingSubdomain("");
      setCreatingJson("{\n  \"KEY\": \"VALUE\"\n}");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      alert(message);
    }
  };

  const startEditEnvVars = (env: Environment): void => {
    setEditingEnvId(env.id);
    setJsonError(null);
    setEditingJson(JSON.stringify(env.envVars ?? {}, null, 2));
  };

  const saveEnvVars = async (env: Environment): Promise<void> => {
    try {
      const parsed = JSON.parse(editingJson || "{}");
      const updated = await apiFetch<Environment>(`/environments/${env.id}`, {
        method: "PATCH",
        body: { envVars: parsed },
      });
      setEnvs((prev) => prev.map((e) => (e.id === env.id ? updated : e)));
      setEditingEnvId(null);
      setJsonError(null);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      setJsonError(message || "Error guardando JSON");
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
      <div style={{ display: "grid", gap: 8, marginBottom: 12, maxWidth: 720 }}>
        <h3 style={{ margin: 0 }}>Crear ambiente</h3>
        <div>
          <label>Nombre</label>
          <input value={creatingName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCreatingName(e.target.value)} />
        </div>
        <div>
          <label>Subdominio</label>
          <input value={creatingSubdomain} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCreatingSubdomain(e.target.value)} placeholder="opcional (auto)" />
        </div>
        <div>
          <label>envVars (JSON)</label>
          <textarea
            value={creatingJson}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCreatingJson(e.target.value)}
            rows={8}
            style={{ width: "100%", fontFamily: "monospace" }}
          />
        </div>
        <div>
          <button onClick={createEnv}>+ Nuevo ambiente</button>
        </div>
      </div>

      <ul>
        {filtered.map((e) => (
          <li key={e.id} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <b>{e.name}</b> — {e.subdomainPrefix}
              <button style={{ marginLeft: 8 }} onClick={() => startEditEnvVars(e)}>
                Edit envVars
              </button>
              <button style={{ marginLeft: 4 }} onClick={() => deleteEnv(e)}>
                Eliminar
              </button>
            </div>
            {editingEnvId === e.id && (
              <div style={{ marginTop: 8 }}>
                <textarea
                  value={editingJson}
                  onChange={(ev: React.ChangeEvent<HTMLTextAreaElement>) => setEditingJson(ev.target.value)}
                  rows={8}
                  style={{ width: "100%", fontFamily: "monospace" }}
                />
                <div style={{ marginTop: 4, display: "flex", gap: 8 }}>
                  <button onClick={() => saveEnvVars(e)}>Guardar</button>
                  <button onClick={() => { setEditingEnvId(null); setJsonError(null); }}>Cancelar</button>
                </div>
                {jsonError && <div style={{ color: "red", marginTop: 4 }}>{jsonError}</div>}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}


