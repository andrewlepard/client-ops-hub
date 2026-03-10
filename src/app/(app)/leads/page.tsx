import Link from "next/link";
import { CreateLeadForm } from "@/components/leads/create-lead-form";
import { createClient } from "@/lib/supabase/server";

type LeadsPageProps = {
  searchParams: Promise<{
    message?: string;
  }>;
};

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

export default async function LeadsPage({ searchParams }: LeadsPageProps) {
  const resolvedSearchParams = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: leads, error } = await supabase
    .from("leads")
    .select("id, name, company, status, created_at")
    .eq("owner_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <main className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
          Leads
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
              Your leads
            </h1>
            <p className="mt-2 text-base leading-7 text-slate-600">
              Simple lead tracking for the signed-in user only.
            </p>
          </div>
          <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
            {leads?.length ?? 0} total
          </div>
        </div>

        {resolvedSearchParams.message ? (
          <div className="mt-6 rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-sky-900">
            {resolvedSearchParams.message}
          </div>
        ) : null}

        {error ? (
          <div className="mt-6 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {error.message}
          </div>
        ) : null}

        {leads && leads.length > 0 ? (
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
                {leads.map((lead) => (
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
            No leads yet. Use the form to add your first lead.
          </div>
        )}
      </main>

      <aside>
        <CreateLeadForm />
      </aside>
    </div>
  );
}
