// lib/categoriesArticlesApi.js
// Async wrapper around the Futurism Express + MongoDB REST API.
// All functions are async and go through apiFetch() (lib/apiConfig.js) so
// they work correctly now that the API is a separate backend server
// instead of same-origin Next.js route handlers.

import { apiFetch } from './apiConfig';

// ─── Categories ──────────────────────────────────────────────────────────────

export async function getCategories() {
  const res  = await apiFetch('/api/admin/categories');
  const data = await res.json();
  return data.categories || [];
}

export async function saveCategory(data) {
  const isUpdate = Boolean(data._id);
  const url    = isUpdate ? `/api/admin/categories/${data._id}` : '/api/admin/categories';
  const method = isUpdate ? 'PUT' : 'POST';
  const res    = await apiFetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Failed to save category');
  return result.category;
}

export async function deleteCategory(id) {
  await apiFetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
}

// ─── Articles ────────────────────────────────────────────────────────────────

export async function getArticles(categoryId = '') {
  const params = new URLSearchParams({ limit: '200' });
  if (categoryId) params.set('categoryId', categoryId);
  const res  = await apiFetch(`/api/admin/articles?${params}`);
  const data = await res.json();
  return data.articles || [];
}

export async function saveArticle(data) {
  const isUpdate = Boolean(data._id);
  const url    = isUpdate ? `/api/admin/articles/${data._id}` : '/api/admin/articles';
  const method = isUpdate ? 'PUT' : 'POST';
  const res    = await apiFetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Failed to save article');
  return result.article;
}

export async function deleteArticle(id) {
  await apiFetch(`/api/admin/articles/${id}`, { method: 'DELETE' });
}

// ─── Image helpers ────────────────────────────────────────────────────────────

// Uploads a File to Cloudinary via the backend and returns { url, publicId }.
// Replaces the old toBase64() flow -- store the returned `url` on the
// article/author/category record's image field instead of a base64 string.
//
// `folder` groups uploads in Cloudinary (e.g. "articles", "authors",
// "categories") and is optional -- defaults to "misc" on the backend.
export async function uploadImage(file, folder = '') {
  const formData = new FormData();
  formData.append('image', file);
  if (folder) formData.append('folder', folder);

  // Do not set a Content-Type header manually -- the browser sets the
  // correct multipart/form-data boundary automatically when the body is a
  // FormData instance. apiFetch still adds credentials: 'include'.
  const res = await apiFetch('/api/admin/upload', {
    method: 'POST',
    body: formData,
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Failed to upload image');
  return result; // { url, publicId }
}

// Deprecated: converts a File to a base64 data URL for inline preview only.
// Kept for any code still importing it, but new code should use
// uploadImage() above and store the returned Cloudinary URL instead of a
// base64 string (base64-in-Mongo is exactly what the Cloudinary migration
// replaces).
export function toBase64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onloadend = () => res(r.result);
    r.onerror   = rej;
    r.readAsDataURL(file);
  });
}
