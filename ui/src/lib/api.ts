// ui/src/lib/api.ts
// Cliente API minimal, compatible con Next 13+/15 (App Router).
// Usa NEXT_PUBLIC_API_BASE en runtime; fallback a localhost para desarrollo.

const API_BASE =
	process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:3001";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface ApiOptions {
	method?: HttpMethod;
	body?: unknown;
	headers?: Record<string, string>;
	token?: string; // opcional: forzar token
}

// Helper genérico
export async function api<T = unknown>(
	path: string,
	options: ApiOptions = {}
): Promise<T> {
	const method = options.method ?? "GET";

	const headers: Record<string, string> = {
		"Content-Type": "application/json",
		...(options.headers ?? {}),
	};

	// Tomar JWT: prioriza el pasado por opción; sino, intenta localStorage (solo en cliente)
	let jwt = options.token ?? "";
	if (!jwt && typeof window !== "undefined") {
		jwt = localStorage.getItem("jwt") ?? "";
	}
	if (jwt) headers["Authorization"] = `Bearer ${jwt}`;

	const res = await fetch(`${API_BASE}${path}`, {
		method,
		headers,
		body: options.body ? JSON.stringify(options.body) : undefined,
		cache: "no-store", // evita cache en dev
		// next: { revalidate: 0 } // si querés indicarle a Next explícitamente
	});

	if (!res.ok) {
		// Intentar parsear JSON, si no, texto
		let detail = "";
		try {
			detail = JSON.stringify(await res.json());
		} catch {
			try {
				detail = await res.text();
			} catch {
				detail = "";
			}
		}
		throw new Error(
			`API ${method} ${path} → ${res.status} ${res.statusText} ${detail}`
		);
	}

	// Si no hay body, devolvé undefined
	try {
		return (await res.json()) as T;
	} catch {
		return undefined as T;
	}
}

// Endpoints típicos que te van a servir pronto:
export const login = (email: string, password: string) =>
	api<{ token: string }>("/auth/login", {
		method: "POST",
		body: { email, password },
	});

export const registerRoot = (email: string, password: string) =>
	api("/auth/register-root", {
		method: "POST",
		body: { email, password },
	});

export const apiFetch = api;