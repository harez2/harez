import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Mail, Trash2, ExternalLink, Building2, DollarSign, Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface AuditRequest {
  id: string;
  name: string;
  email: string;
  company: string | null;
  website: string | null;
  monthly_ad_spend: string | null;
  message: string | null;
  status: string;
  created_at: string;
}

const STATUSES = ["new", "contacted", "qualified", "won", "lost"] as const;
const STATUS_STYLES: Record<string, string> = {
  new: "bg-primary/10 text-primary border-primary/20",
  contacted: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  qualified: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  won: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  lost: "bg-muted text-muted-foreground border-border",
};

const AuditRequestsManager = () => {
  const queryClient = useQueryClient();

  const { data: requests, isLoading } = useQuery({
    queryKey: ["audit_requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audit_requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as AuditRequest[];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("audit_requests").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audit_requests"] });
      toast.success("Status updated.");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("audit_requests").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audit_requests"] });
      toast.success("Request deleted.");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const rows = requests ?? [];
  const counts = STATUSES.reduce<Record<string, number>>((acc, s) => {
    acc[s] = rows.filter((r) => r.status === s).length;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl mb-1">Audit Requests</h2>
        <p className="font-body text-sm text-muted-foreground">
          Leads submitted through the free growth audit and resource forms.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {STATUSES.map((s) => (
          <div key={s} className="p-4 rounded-xl bg-secondary/40 border border-border">
            <div className="font-body text-xs uppercase tracking-wider text-muted-foreground">{s}</div>
            <div className="font-display text-2xl mt-1">{counts[s] || 0}</div>
          </div>
        ))}
      </div>

      {rows.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground font-body">
          No audit requests yet.
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => (
            <article
              key={r.id}
              className="p-5 rounded-xl bg-card border border-border hover:shadow-soft transition-shadow"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-display text-lg">{r.name}</h3>
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-body font-medium uppercase tracking-wider border ${
                        STATUS_STYLES[r.status] || STATUS_STYLES.new
                      }`}
                    >
                      {r.status}
                    </span>
                  </div>
                  <div className="mt-2 grid sm:grid-cols-2 gap-x-6 gap-y-1 font-body text-sm text-muted-foreground">
                    <a
                      href={`mailto:${r.email}`}
                      className="inline-flex items-center gap-1.5 hover:text-primary"
                    >
                      <Mail className="w-3.5 h-3.5" /> {r.email}
                    </a>
                    {r.company && (
                      <span className="inline-flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5" /> {r.company}
                      </span>
                    )}
                    {r.website && (
                      <a
                        href={r.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 hover:text-primary truncate"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> {r.website}
                      </a>
                    )}
                    {r.monthly_ad_spend && (
                      <span className="inline-flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5" /> {r.monthly_ad_spend}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(r.created_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  {r.message && (
                    <p className="mt-3 font-body text-sm text-foreground/80 whitespace-pre-wrap">
                      {r.message}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Select
                    value={r.status}
                    onValueChange={(status) => updateStatus.mutate({ id: r.id, status })}
                  >
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => (
                        <SelectItem key={s} value={s} className="capitalize">
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        className="w-9 h-9 rounded-lg border border-border text-muted-foreground hover:text-destructive hover:border-destructive/40 transition-colors flex items-center justify-center"
                        aria-label="Delete request"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete audit request?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete {r.name}'s request. This action can't be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => remove.mutate(r.id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default AuditRequestsManager;