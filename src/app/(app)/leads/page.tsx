import { CreateLeadForm } from "@/components/leads/create-lead-form";
import { LeadsTable } from "@/components/leads/leads-table";
import { createClient } from "@/lib/supabase/server";

type LeadsPageProps = {
  searchParams: Promise<{
    message?: string;
  }>;
};

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
      <main className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">
          Leads
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
              Your leads
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              A clean lead list for the signed-in user only, with quick access to
              detail pages and simple pipeline tracking.
            </p>
          </div>
          <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
            {leads?.length ?? 0} total leads
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
          <LeadsTable leads={leads} />
        ) : (
          <div className="mt-8 rounded-[1.75rem] border border-dashed border-slate-300 bg-[linear-gradient(180deg,#f8fafc_0%,#f1f5f9_100%)] px-6 py-12 text-center">
            <p className="text-base font-medium text-slate-700">No leads yet</p>
            <p className="mt-2 text-sm text-slate-500">
              Use the form on the right to add your first lead and start building
              the demo pipeline.
            </p>
          </div>
        )}
      </main>

      <aside className="xl:pt-8">
        <CreateLeadForm />
      </aside>
    </div>
  );
}
