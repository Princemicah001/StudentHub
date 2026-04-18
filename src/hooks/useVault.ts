import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface VaultSubmission {
  content: string;
}

export function useVault() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (submission: VaultSubmission) => {
      const { data, error } = await supabase
        .from('feedback')
        .insert([{ content: submission.content }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
    },
  });
}
