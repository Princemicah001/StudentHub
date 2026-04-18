import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface Vendor {
  id: string;
  user_id: string;
  name: string;
  role: string;
  bio?: string;
  image: string;
  whatsapp_number?: string;
  operating_hours?: string;
  portfolio_images: string[];
  specializations: string[];
  verified: boolean;
  top_vendor: boolean;
  is_published: boolean;
  rating: number;
  success_rate: string;
  experience: string;
  sales: number;
  followers: number;
  endorsements: number;
  created_at: string;
}

export function useVendors() {
  return useQuery<Vendor[]>({
    queryKey: ['vendors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('is_published', true)
        .order('rating', { ascending: false });

      if (error) throw error;
      return (data as Vendor[]) || [];
    },
    staleTime: 1000 * 60, // Keep data fresh for 60 seconds
  });
}

export function useUpdateVendor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ vendorId, data }: { vendorId: string; data: Partial<Vendor> }) => {
      const { error } = await supabase
        .from('vendors')
        .update(data)
        .eq('id', vendorId);

      if (error) throw error;
    },
    onMutate: async ({ vendorId, data }) => {
      await queryClient.cancelQueries({ queryKey: ['vendors'] });
      const previousVendors = queryClient.getQueryData<Vendor[]>(['vendors']);

      queryClient.setQueryData<Vendor[]>(['vendors'], (old) => {
        if (!old) return old;
        return old.map((v) => (v.id === vendorId ? { ...v, ...data } : v));
      });

      return { previousVendors };
    },
    onError: (err, variables, context) => {
      if (context?.previousVendors) {
        queryClient.setQueryData(['vendors'], context.previousVendors);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
    },
  });
}
