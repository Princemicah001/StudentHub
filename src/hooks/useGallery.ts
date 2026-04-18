import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface GalleryImage {
  id: string;
  image_url: string;
  tag?: string;
  tagged_vendor_ids: string[];
  created_at: string;
}

export function useGalleryImages() {
  return useQuery<GalleryImage[]>({
    queryKey: ['gallery'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data as GalleryImage[]) || [];
    },
  });
}
