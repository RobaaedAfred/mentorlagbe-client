"use client";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
  ) {
    super(message);
  }
}

let cached: { token: string; exp: number } | null = null;

export const clearToken = () => {
  cached = null;
};

/** Exchanges the BetterAuth session cookie for a JWT (cached until shortly before expiry). */
export const getToken = async (): Promise<string> => {
  if (cached && cached.exp > Date.now()) return cached.token;
  const res = await fetch("/api/token", { credentials: "include", cache: "no-store" });
  if (!res.ok) throw new ApiError("Please sign in to continue", 401);
  const { token } = (await res.json()) as { token: string };
  cached = { token, exp: Date.now() + 90 * 60 * 1000 }; // server tokens live 2h
  return token;
};

interface Options {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  /** Send the JWT as a Bearer token (protected routes). */
  auth?: boolean;
}

export async function api<T>(path: string, { method = "GET", body, auth = false }: Options = {}): Promise<T> {
  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth) headers.Authorization = `Bearer ${await getToken()}`;

  let res: Response;
  try {
    res = await fetch(`/api${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });
  } catch {
    throw new ApiError("Cannot reach the server. Check your connection and try again.", 0);
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401) clearToken();
    throw new ApiError(data?.message || "Something went wrong", res.status, data?.code);
  }
  return data as T;
}

export const errorMessage = (err: unknown) => (err instanceof Error ? err.message : "Something went wrong");

/** Reads an image file as base64 and uploads it through the server's ImgBB proxy. */
export async function uploadImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new ApiError("Please choose an image file", 400);
  if (file.size > 6 * 1024 * 1024) throw new ApiError("Image must be smaller than 6MB", 400);
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new ApiError("Could not read the file", 400));
    reader.readAsDataURL(file);
  });
  const { url } = await api<{ url: string }>("/upload", { method: "POST", body: { image: base64 }, auth: true });
  return url;
}
