import { supabase } from '@/utils/supabase';
import * as DocumentPicker from 'expo-document-picker';

// Upload file into Storage
export async function uploadDocument() {
  const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });

  if (result.canceled) return null;

  const file = result.assets[0];
  const filePath = `documents/${Date.now()}_${file.name}`;

  const { error } = await supabase.storage
    .from('documents')
    .upload(filePath, {
      uri: file.uri,
      type: file.mimeType || 'application/octet-stream',
      name: file.name,
    });

  if (error) {
    console.error("Upload error:", error);
    return null;
  }

  return filePath;
}

// Insert into documents table
export async function addDocument(
  name: string,
  relatedTo: 'property' | 'tenant' | 'payment',
  relatedId: string
) {
  const filePath = await uploadDocument();
  if (!filePath) return null;

  const { data, error } = await supabase.from('documents').insert([
    {
      name,
      file_url: filePath,
      relatedTo,
      relatedId,
    },
  ]);

  if (error) {
    console.error("DB insert error:", error);
    return null;
  }

  return data;
}

// Get public URL for viewing
export function getFileUrl(path: string) {
  const { data } = supabase.storage.from('documents').getPublicUrl(path);
  return data.publicUrl;
}
