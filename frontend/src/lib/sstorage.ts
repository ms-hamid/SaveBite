import { supabase } from "./supabase";

const BUCKET_NAME = "listing-images";

export async function uploadFile(
  file: File,
  folder = ""
) {
  const fileExt =
    file.name.split(".").pop();

  const fileName =
    `${Date.now()}-${crypto.randomUUID()}.${fileExt}`;

  const filePath = folder
    ? `${folder}/${fileName}`
    : fileName;

  const { data, error } =
    await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file);

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteFile(
  path: string
) {
  const { error } =
    await supabase.storage
      .from(BUCKET_NAME)
      .remove([path]);

  if (error) {
    throw error;
  }

  return true;
}

export function getPublicUrl(
  path: string
) {
  const { data } =
    supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(path);

  return data.publicUrl;
}

export async function listFiles(
  folder = ""
) {
  const { data, error } =
    await supabase.storage
      .from(BUCKET_NAME)
      .list(folder);

  if (error) {
    throw error;
  }

  return data;
}