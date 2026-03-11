import Link from "next/link";
import { LeadsTable } from "@/components/leads/leads-table";
import { createClient } from "@/lib/supabase/server";

const summaryConfig = [
  { key: "total", label: "Total Leads", tone: "from-slate-950 to-slate-800" },
  { key: "contacted", label: "Contacted Leads", tone: "from-sky-600 to-sky-500" },
  { key: "qualified", label: "Qualified Leads", tone: "from-amber-500 to-orange-400" },
  { key: "won", label: "Won Leads", tone: "from-emerald-600 to-emerald-500" },
] as const;

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: leads, error } = await supabase
    .from("leads")
    .select("id, name, company, status, created_at")
    .eq("owner_id", user!.id)
    .order("created_at", { ascending: false });

  const allLeads = leads ?? [];
  const summary = {
    total: allLeads.length,
    contacted: allLeads.filter((lead) => lead.status === "contacted").length,
    qualified: allLeads.filter((lead) => lead.status === "qualified").length,
    won: allLeads.filter((lead) => lead.status === "won").length,
  };
  const recentLeads = allLeads.slice(0, 5);

  return (
    <main className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">
              Dashboard
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
              Lead snapshot
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              A quick operating view of your pipeline, built for a clean demo and
              an easy walkthrough.
            </p>
          </div>

          <Link
            href="/leads"
            className="inline-flex items-center rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white shadow-[0_10px_24px_rgba(15,23,42,0.16)] transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            Create Lead
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryConfig.map((item) => (
            <div
              key={item.key}
              className="relative overflow-hidden rounded-[1.6rem] border border-slate-200 bg-slate-50/80 p-5"
            >
              <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${item.tone}`} />
              <p className="text-sm font-medium text-slate-500">{item.label}</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                {summary[item.key]}
              </p>
              <p className="mt-2 text-sm text-slate-500">
                {item.key === "total"
                  ? "All leads in your workspace"
                  : `Currently marked as ${item.key}`}
              </p>
            </div>
          ))}
        </div>

        {error ? (
          <div className="mt-6 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {error.message}
          </div>
        ) : null}
      </section>

      <section className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">
              Recent Leads
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
              Last 5 created leads
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              The newest lead activity for the signed-in account.
            </p>
          </div>
          <Link
            href="/leads"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-sky-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-800"
          >
            View all leads
          </Link>
        </div>

        {recentLeads.length > 0 ? (
          <LeadsTable leads={recentLeads} />
        ) : (
          <div className="mt-6 rounded-[1.75rem] border border-dashed border-slate-300 bg-[linear-gradient(180deg,#f8fafc_0%,#f1f5f9_100%)] px-6 py-12 text-center">
            <p className="text-base font-medium text-slate-700">No leads yet</p>
            <p className="mt-2 text-sm text-slate-500">
              Create your first lead to populate the dashboard and recent activity.
            </p>
            <Link
              href="/leads"
              className="mt-5 inline-flex rounded-full bg-slate-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Go to leads
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
