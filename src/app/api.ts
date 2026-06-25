export interface Product {
  id: string;
  name: string;
  category: string;
  material: string;
  finish: string;
  dimensions: string;
  description: string;
  image: string;
  featured: boolean;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

const TOKEN_KEY = "catalog_admin_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Request failed (${res.status})`);
  }

  return res.json();
}

export async function fetchProducts(category?: string) {
  const params = category && category !== "All" ? `?category=${encodeURIComponent(category)}` : "";
  return request<{ products: Product[]; categories: string[] }>(`/api/products${params}`);
}

export async function login(password: string) {
  const data = await request<{ token: string }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ password }),
  });
  setToken(data.token);
  return data;
}

export async function createProduct(product: Partial<Product>) {
  return request<{ product: Product }>("/api/products", {
    method: "POST",
    body: JSON.stringify(product),
  });
}

export async function updateProduct(id: string, product: Partial<Product>) {
  return request<{ product: Product }>(`/api/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(product),
  });
}

export async function uploadProductImage(id: string, file: File) {
  const formData = new FormData();
  formData.append("image", file);
  return request<{ product: Product }>(`/api/products/${id}/image`, {
    method: "POST",
    body: formData,
  });
}

export async function deleteProduct(id: string) {
  return request<{ success: boolean }>(`/api/products/${id}`, {
    method: "DELETE",
  });
}
