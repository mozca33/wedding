import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Storage buckets
export const STORAGE_BUCKETS = {
	GALLERY: 'gallery',
	FILES: 'files',
	AVATARS: 'avatars',
} as const;

// Helper functions
export const uploadFile = async (bucket: string, path: string, file: File) => {
	const { data, error } = await supabase.storage.from(bucket).upload(path, file);

	if (error) throw error;
	return data;
};

export const getPublicUrl = (bucket: string, path: string): string => {
	const { data } = supabase.storage.from(bucket).getPublicUrl(path);

	return data.publicUrl;
};

export const deleteFile = async (bucket: string, path: string): Promise<void> => {
	const { error } = await supabase.storage.from(bucket).remove([path]);

	if (error) throw error;
};
