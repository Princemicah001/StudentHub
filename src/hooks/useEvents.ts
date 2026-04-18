import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface CampusEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image_url: string;
  total_seats: number;
  seats_remaining: number;
  is_featured: boolean;
  created_at: string;
}

export function useEvents() {
  return useQuery<CampusEvent[]>({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      return (data as CampusEvent[]) || [];
    },
  });
}

export function useEventRsvp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventId, userId }: { eventId: string; userId: string }) => {
      const { error } = await supabase
        .from('event_rsvps')
        .insert([{ event_id: eventId, user_id: userId }]);

      if (error) throw error;
    },
    onMutate: async ({ eventId }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['events'] });

      // Snapshot the previous value
      const previousEvents = queryClient.getQueryData<CampusEvent[]>(['events']);

      // Optimistically update to the new value
      queryClient.setQueryData<CampusEvent[]>(['events'], (old) => {
        if (!old) return old;
        return old.map((event) =>
          event.id === eventId
            ? { ...event, seats_remaining: Math.max(0, event.seats_remaining - 1) }
            : event
        );
      });

      // Return a context object with the snapshotted value
      return { previousEvents };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousEvents) {
        queryClient.setQueryData(['events'], context.previousEvents);
      }
    },
    onSettled: () => {
      // Always refetch after error or success to keep server and client in sync
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['rsvps'] });
    },
  });
}
