import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function getStatusStyles(status: string) {
  const styles: Record<string, string> = {
    new: "bg-slate-100 text-slate-700",
    contacted: "bg-sky-100 text-sky-700",
    qualified: "bg-amber-100 text-amber-700",
    won: "bg-emerald-100 text-emerald-700",
    lost: "bg-rose-100 text-rose-700",
  };

  return styles[status] ?? "bg-slate-100 text-slate-700";
}

const summaryConfig = [
  { key: "total", label: "Total Leads" },
  { key: "contacted", label: "Contacted Leads" },
  { key: "qualified", label: "Qualified Leads" },
  { key: "won", label: "Won Leads" },
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
      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
              Dashboard
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
              Lead snapshot
            </h1>
            <p className="mt-2 max-w-2xl text-base leading-7 text-slate-600">
              A simple overview of the signed-in user&apos;s leads.
            </p>
          </div>

          <Link
            href="/leads"
            className="inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Create Lead
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryConfig.map((item) => (
            <div
              key={item.key}
              className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5"
            >
              <p className="text-sm font-medium text-slate-500">{item.label}</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                {summary[item.key]}
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

      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
              Recent Leads
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
              Last 5 created leads
            </h2>
          </div>
          <Link
            href="/leads"
            className="text-sm font-medium text-sky-700 transition hover:text-sky-800"
          >
            View all leads
          </Link>
        </div>

        {recentLeads.length > 0 ? (
          <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr className="text-left text-sm text-slate-500">
                  <th className="px-5 py-4 font-medium">Name</th>
                  <th className="px-5 py-4 font-medium">Company</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 font-medium">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white text-sm text-slate-700">
                {recentLeads.map((lead) => (
                  <tr key={lead.id} className="transition hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <Link
                        href={`/leads/${lead.id}`}
                        className="font-medium text-slate-950 hover:text-sky-700"
                      >
                        {lead.name}
                      </Link>
                    </td>
                    <td className="px-5 py-4">{lead.company || "—"}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyles(lead.status)}`}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">{formatDate(lead.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-6 rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-sm text-slate-500">
            No leads yet. Create your first one from the leads page.
          </div>
        )}
      </section>
    </main>
  );
}
