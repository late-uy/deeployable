"use client";
import { useState } from "react";
import { apiFetch } from "@/lib/api";

type CreateDomainResponse = { id: number } & Record<string, unknown>;

export default function ProjectDomains({ params }: { params: { id: string } }) {
  const projectId = Number(params.id);
  const [mode, setMode] = useState<"managed" | "custom" | null>(null);
  const [host, setHost] = useState<string>("");
  const [cnameTarget, setCnameTarget] = useState<string>("");
  const [createdId, setCreatedId] = useState<number | null>(null);
  const [verifying, setVerifying] = useState<boolean>(false);
  const [verifyResult, setVerifyResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onCreate = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError(null);
    setVerifyResult(null);
    setCreatedId(null);
    if (!mode) return;
    try {
      const created = await apiFetch<CreateDomainResponse>("/domains", {
        method: "POST",
        body: { projectId, host, type: mode, targetUrl: cnameTarget || undefined },
      });
      setCreatedId(created.id);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      setError(message || "Error");
    }
  };

  const onVerify = async (): Promise<void> => {
    if (!createdId) return;
    setVerifying(true);
    setVerifyResult(null);
    try {
      const res = await apiFetch<{ ok: boolean; verifiedAt: string | null }>(`/domains/${createdId}/verify`, {
        method: "GET",
      });
      setVerifyResult(res.ok ? "Verificado correctamente" : "No verificado aún. Revisa tu configuración DNS");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      setVerifyResult(message || "Error al verificar");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Add Domain</h2>
      <p>Elige el tipo de dominio y completa los datos requeridos.</p>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button onClick={(): void => setMode("managed")} disabled={mode === "managed"}>
          Subdominio administrado
        </button>
        <button onClick={(): void => setMode("custom")} disabled={mode === "custom"}>
          Custom domain
        </button>
      </div>

      {mode === null ? (
        <p>Selecciona una opción para continuar.</p>
      ) : (
        <form onSubmit={onCreate} style={{ display: "grid", gap: 8, maxWidth: 640 }}>
          {mode === "managed" ? (
            <>
              <div>
                <label>Host (subdominio administrado)</label>
                <input
                  placeholder="ej: myapp.apps.tu-dominio.com"
                  value={host}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHost(e.target.value)}
                />
              </div>
              <small>
                Requiere configurar DNS en tu zona apuntando a nuestro ingress. Lo documentaremos en la guía.
              </small>
            </>
          ) : (
            <>
              <div>
                <label>Host (custom)</label>
                <input
                  placeholder="ej: app.mi-dominio.com"
                  value={host}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHost(e.target.value)}
                />
              </div>
              <div>
                <label>CNAME target</label>
                <input
                  placeholder="ej: myapp.apps.tu-dominio.com"
                  value={cnameTarget}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCnameTarget(e.target.value)}
                />
              </div>
            </>
          )}
          <div>
            <button type="submit">Crear dominio</button>
          </div>
        </form>
      )}

      {createdId && (
        <div style={{ marginTop: 16 }}>
          <p>Dominio creado con id {createdId}.</p>
          {mode === "custom" && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button onClick={onVerify} disabled={verifying}>
                {verifying ? "Verificando..." : "Verify"}
              </button>
              {verifyResult && <span>{verifyResult}</span>}
            </div>
          )}
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}


