import { supabase } from './supabase';

const PRODUCT_IMAGES_BUCKET = 'product-images';

export const STORAGE_MIGRATION_HINT =
  'Run supabase/migrations/20260623120000_product_images_storage.sql in the Supabase SQL Editor to create the product-images bucket and storage policies.';

interface StorageErrorLike {
  message?: string;
  statusCode?: string | number;
  error?: string;
}

export function formatStorageUploadError(error: unknown): string {
  const err = error as StorageErrorLike;
  const message =
    err?.message ?? (error instanceof Error ? error.message : 'Upload failed');
  const lower = message.toLowerCase();

  if (
    lower.includes('bucket not found') ||
    lower.includes('does not exist') ||
    lower.includes('not found')
  ) {
    return `Storage bucket missing: ${message}. ${STORAGE_MIGRATION_HINT}`;
  }

  if (
    lower.includes('row-level security') ||
    lower.includes('policy') ||
    err?.statusCode === '403' ||
    err?.statusCode === 403
  ) {
    return `Upload denied: ${message}. Sign in as an admin (profiles.is_admin = true). ${STORAGE_MIGRATION_HINT}`;
  }

  if (
    lower.includes('jwt') ||
    lower.includes('not authenticated') ||
    lower.includes('invalid claim') ||
    lower.includes('session')
  ) {
    return 'Session expired — please sign in again at /admin/login';
  }

  return message;
}

export async function uploadProductImage(file: File): Promise<string> {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    throw new Error(formatStorageUploadError(sessionError));
  }

  if (!session?.user) {
    throw new Error('You must be signed in as admin to upload images. Please sign in again.');
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const filePath = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type || undefined,
    });

  if (error) {
    throw new Error(formatStorageUploadError(error));
  }

  return resolveProductImageUrl(filePath);
}

/** Normalize admin-stored values to a public storage URL (full URL or bare object path). */
export function resolveProductImageUrl(url?: string | null): string {
  const trimmed = url?.trim();
  if (!trimmed) return '';

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  const path = trimmed.replace(/^\/+/, '').replace(/^product-images\//, '');
  const { data } = supabase.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
