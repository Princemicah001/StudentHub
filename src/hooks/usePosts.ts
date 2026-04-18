import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface PostBlock {
  id: string;
  type: 'text' | 'image' | 'heading';
  content: string;
  visible: boolean;
  meta?: any;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  blocks: PostBlock[];
  published: boolean;
  scheduled_for?: string;
  created_at: string;
}

export function usePosts() {
  return useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data as Post[]) || [];
    },
  });
}
