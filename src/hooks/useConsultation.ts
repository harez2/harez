import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Types
export interface ConsultationContent {
  id: string;
  section: string;
  content: Record<string, any>;
}

export interface ConsultationProject {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  link: string | null;
  display_order: number;
}

export interface ConsultationReview {
  id: string;
  client_name: string;
  client_company: string | null;
  client_photo: string | null;
  review_text: string;
  rating: number;
  display_order: number;
}

export interface ConsultationSlot {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export interface ConsultationBooking {
  id: string;
  slot_id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  payment_method: string;
  transaction_id: string;
  amount: number;
  status: string;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  consultation_slots?: ConsultationSlot;
}

// Content hooks
export const useConsultationContent = (section: string) => {
  return useQuery({
    queryKey: ["consultation_content", section],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("consultation_content" as any)
        .select("*")
        .eq("section", section)
        .maybeSingle();
      if (error) throw error;
      return data as unknown as ConsultationContent | null;
    },
  });
};

export const useUpdateConsultationContent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ section, content }: { section: string; content: Record<string, any> }) => {
      const { data: existing } = await supabase
        .from("consultation_content" as any)
        .select("id")
        .eq("section", section)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from("consultation_content" as any)
          .update({ content } as any)
          .eq("section", section);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("consultation_content" as any)
          .insert({ section, content } as any);
        if (error) throw error;
      }
    },
    onSuccess: (_, { section }) => {
      queryClient.invalidateQueries({ queryKey: ["consultation_content", section] });
    },
  });
};

// Projects hooks
export const useConsultationProjects = () => {
  return useQuery({
    queryKey: ["consultation_projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("consultation_projects" as any)
        .select("*")
        .order("display_order");
      if (error) throw error;
      return data as unknown as ConsultationProject[];
    },
  });
};

export const useCreateConsultationProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (project: Omit<ConsultationProject, "id">) => {
      const { error } = await supabase.from("consultation_projects" as any).insert(project as any);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["consultation_projects"] }),
  });
};

export const useUpdateConsultationProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (project: ConsultationProject) => {
      const { id, ...rest } = project;
      const { error } = await supabase.from("consultation_projects" as any).update(rest as any).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["consultation_projects"] }),
  });
};

export const useDeleteConsultationProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("consultation_projects" as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["consultation_projects"] }),
  });
};

// Reviews hooks
export const useConsultationReviews = () => {
  return useQuery({
    queryKey: ["consultation_reviews"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("consultation_reviews" as any)
        .select("*")
        .order("display_order");
      if (error) throw error;
      return data as unknown as ConsultationReview[];
    },
  });
};

export const useCreateConsultationReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (review: Omit<ConsultationReview, "id">) => {
      const { error } = await supabase.from("consultation_reviews" as any).insert(review as any);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["consultation_reviews"] }),
  });
};

export const useUpdateConsultationReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (review: ConsultationReview) => {
      const { id, ...rest } = review;
      const { error } = await supabase.from("consultation_reviews" as any).update(rest as any).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["consultation_reviews"] }),
  });
};

export const useDeleteConsultationReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("consultation_reviews" as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["consultation_reviews"] }),
  });
};

// Slots hooks
export const useConsultationSlots = (availableOnly = false) => {
  return useQuery({
    queryKey: ["consultation_slots", availableOnly],
    queryFn: async () => {
      let query = supabase.from("consultation_slots" as any).select("*").order("date").order("start_time");
      if (availableOnly) {
        query = query.eq("is_available", true).gte("date", new Date().toISOString().split("T")[0]);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data as unknown as ConsultationSlot[];
    },
  });
};

export const useCreateConsultationSlot = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (slot: Omit<ConsultationSlot, "id">) => {
      const { error } = await supabase.from("consultation_slots" as any).insert(slot as any);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["consultation_slots"] }),
  });
};

export const useUpdateConsultationSlot = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (slot: ConsultationSlot) => {
      const { id, ...rest } = slot;
      const { error } = await supabase.from("consultation_slots" as any).update(rest as any).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["consultation_slots"] }),
  });
};

export const useDeleteConsultationSlot = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("consultation_slots" as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["consultation_slots"] }),
  });
};

// Bookings hooks
export const useConsultationBookings = () => {
  return useQuery({
    queryKey: ["consultation_bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("consultation_bookings" as any)
        .select("*, consultation_slots(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as ConsultationBooking[];
    },
  });
};

export const useCreateConsultationBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (booking: {
      slot_id: string;
      client_name: string;
      client_email: string;
      client_phone: string;
      payment_method: string;
      transaction_id: string;
      amount: number;
    }) => {
      // Insert booking
      const { data, error } = await supabase
        .from("consultation_bookings" as any)
        .insert(booking as any)
        .select()
        .single();
      if (error) throw error;

      // Mark slot as unavailable
      await supabase
        .from("consultation_slots" as any)
        .update({ is_available: false } as any)
        .eq("id", booking.slot_id);

      // Send notification email
      try {
        await supabase.functions.invoke("send-booking-email", {
          body: { booking: data, type: "new_booking" },
        });
      } catch (e) {
        console.error("Email notification failed:", e);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultation_bookings"] });
      queryClient.invalidateQueries({ queryKey: ["consultation_slots"] });
    },
  });
};

export const useUpdateConsultationBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ConsultationBooking> & { id: string }) => {
      const { data, error } = await supabase
        .from("consultation_bookings" as any)
        .update(updates as any)
        .eq("id", id)
        .select("*, consultation_slots(*)")
        .single();
      if (error) throw error;

      // Send status update email if status changed
      if (updates.status) {
        try {
          await supabase.functions.invoke("send-booking-email", {
            body: { booking: data, type: "status_update" },
          });
        } catch (e) {
          console.error("Email notification failed:", e);
        }
      }

      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["consultation_bookings"] }),
  });
};
