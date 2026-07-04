import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, TrendingUp, MousePointerClick, UserPlus, Calendar, Eye } from "lucide-react";

type EventRow = {
  id: string;
  event_name: string;
  path: string | null;
  source: string | null;
  session_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
};

const RANGES = [
  { key: "24h", label: "Last 24h", hours: 24 },
  { key: "7d", label: "Last 7 days", hours: 24 * 7 },
  { key: "30d", label: "Last 30 days", hours: 24 * 30 },
  { key: "all", label: "All time", hours: 24 * 365 * 5 },
];

const AnalyticsDashboard = () => {
  const [range, setRange] = useState("7d");
  const [rows, setRows] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const hours = RANGES.find((r) => r.key === range)?.hours ?? 168;
      const since = new Date(Date.now() - hours * 3600 * 1000).toISOString();
      const { data, error } = await supabase
        .from("analytics_events")
        .select("*")
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(2000);
      if (!error && data) setRows(data as unknown as EventRow[]);
      setLoading(false);
    };
    load();
  }, [range]);

  const stats = useMemo(() => {
    const pageViews = rows.filter((r) => r.event_name === "PageView").length;
    const leads = rows.filter((r) => r.event_name === "Lead").length;
    const bookings = rows.filter((r) => r.event_name === "Schedule").length;
    const clicks = rows.filter((r) => r.event_name === "Click").length;
    const sessions = new Set(rows.map((r) => r.session_id).filter(Boolean)).size;
    const conversionRate = sessions ? ((leads + bookings) / sessions) * 100 : 0;
    return { pageViews, leads, bookings, clicks, sessions, conversionRate };
  }, [rows]);

  const topPaths = useMemo(() => {
    const counts = new Map<string, number>();
    rows.filter((r) => r.event_name === "PageView").forEach((r) => {
      const p = r.path || "/";
      counts.set(p, (counts.get(p) || 0) + 1);
    });
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
  }, [rows]);

  const topSources = useMemo(() => {
    const counts = new Map<string, number>();
    rows.filter((r) => r.event_name === "Lead" || r.event_name === "Schedule").forEach((r) => {
      const s = r.source || "unknown";
      counts.set(s, (counts.get(s) || 0) + 1);
    });
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
  }, [rows]);

  const recent = rows.slice(0, 50);

  const StatCard = ({ icon: Icon, label, value, hint }: { icon: any; label: string; value: string | number; hint?: string }) => (
    <div className="bg-secondary/40 border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-body uppercase tracking-wider text-muted-foreground">{label}</span>
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div className="font-display text-3xl">{value}</div>
      {hint && <div className="text-xs text-muted-foreground mt-1">{hint}</div>}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display text-2xl">Analytics</h2>
          <p className="text-sm text-muted-foreground">Traffic, engagement, and conversion events.</p>
        </div>
        <div className="flex gap-2">
          {RANGES.map((r) => (
            <button
              key={r.key}
              onClick={() => setRange(r.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-body transition-all ${
                range === r.key ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            <StatCard icon={Eye} label="Page Views" value={stats.pageViews} />
            <StatCard icon={TrendingUp} label="Sessions" value={stats.sessions} />
            <StatCard icon={MousePointerClick} label="Clicks" value={stats.clicks} />
            <StatCard icon={UserPlus} label="Leads" value={stats.leads} />
            <StatCard icon={Calendar} label="Bookings" value={stats.bookings} />
            <StatCard icon={TrendingUp} label="Conv. rate" value={`${stats.conversionRate.toFixed(1)}%`} hint="Leads+Bookings / Sessions" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-secondary/40 border border-border rounded-xl p-5">
              <h3 className="font-display text-lg mb-4">Top Pages</h3>
              {topPaths.length === 0 ? (
                <p className="text-sm text-muted-foreground">No data yet.</p>
              ) : (
                <ul className="space-y-2">
                  {topPaths.map(([path, count]) => (
                    <li key={path} className="flex justify-between text-sm font-body">
                      <span className="truncate text-foreground/80">{path}</span>
                      <span className="text-primary font-medium">{count}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="bg-secondary/40 border border-border rounded-xl p-5">
              <h3 className="font-display text-lg mb-4">Top Conversion Sources</h3>
              {topSources.length === 0 ? (
                <p className="text-sm text-muted-foreground">No conversions yet.</p>
              ) : (
                <ul className="space-y-2">
                  {topSources.map(([src, count]) => (
                    <li key={src} className="flex justify-between text-sm font-body">
                      <span className="truncate text-foreground/80">{src}</span>
                      <span className="text-primary font-medium">{count}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="bg-secondary/40 border border-border rounded-xl p-5">
            <h3 className="font-display text-lg mb-4">Recent Events</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-body">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                    <th className="py-2 pr-4">Time</th>
                    <th className="py-2 pr-4">Event</th>
                    <th className="py-2 pr-4">Path</th>
                    <th className="py-2 pr-4">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((r) => (
                    <tr key={r.id} className="border-b border-border/50">
                      <td className="py-2 pr-4 text-muted-foreground whitespace-nowrap">
                        {new Date(r.created_at).toLocaleString()}
                      </td>
                      <td className="py-2 pr-4">
                        <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs">{r.event_name}</span>
                      </td>
                      <td className="py-2 pr-4 text-foreground/80 truncate max-w-[240px]">{r.path || "—"}</td>
                      <td className="py-2 pr-4 text-muted-foreground">{r.source || "—"}</td>
                    </tr>
                  ))}
                  {recent.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-muted-foreground">
                        No events in this range.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsDashboard;