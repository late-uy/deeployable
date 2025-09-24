"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type Project = {
  id: number;
  name: string;
  repoUrl: string;
  branch: string;
  runtimePort: number;
};

export default function ProjectOverview({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const p = await apiFetch<Project>(`/projects/${Number(params.id)}`);
        setProject(p);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        setError(message);
      }
    };
    load();
  }, [params.id]);

  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!project) return <div>Cargando...</div>;

  const publicLink = null as string | null; // placeholder: depende de Domains/Environments

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>{project.name}</h1>
      <div style={{ color: "#666", fontSize: 12 }}>
        Repo: {project.repoUrl} (branch: {project.branch}) · Port: {project.runtimePort}
      </div>
      {publicLink ? (
        <p>
          Public URL: <a href={publicLink}>{publicLink}</a>
        </p>
      ) : (
        <p>Sin dominio público configurado.</p>
      )}
    </div>
  );
}


