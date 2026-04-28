import { supabase } from "./supabase";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

async function getToken() {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token;
}

async function request(
  path: string,
  options: RequestInit = {}
) {
  const token = await getToken();

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  let data;

  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    throw new Error(
      data?.message || "Erro na API"
    );
  }

  return data;
}

export const api = {
  get: (path: string) => request(path),

  post: (path: string, body?: any) =>
    request(path, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  patch: (path: string, body?: any) =>
    request(path, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  delete: (path: string) =>
    request(path, {
      method: "DELETE",
    }),
};