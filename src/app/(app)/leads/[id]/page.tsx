import Link from "next/link";
import { notFound } from "next/navigation";
import { LeadAiAssistant } from "@/components/leads/lead-ai-assistant";
import { UpdateLeadForm } from "@/components/leads/update-lead-form";
import { createClient } from "@/lib/supabase/server";

type LeadDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    message?: string;
  }>;
};

export default async function LeadDetailPage({
  params,
  searchParams,
}: LeadDetailPageProps) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: lead } = await supabase
    .from("leads")
    .select(
      "id, name, company, email, phone, source, status, notes, created_at",
    )
    .eq("id", id)
    .single();

  if (!lead) {
    notFound();
  }

  const { data: latestAiGeneration } = await supabase
    .from("ai_generations")
    .select("raw_notes, summary, draft_email, created_at")
    .eq("owner_id", user!.id)
    .eq("lead_id", id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const detailRows = [
    { label: "Company", value: lead.company || "—" },
    { label: "Email", value: lead.email || "—" },
    { label: "Phone", value: lead.phone || "—" },
    { label: "Source", value: lead.source || "—" },
    {
      label: "Created",
      value: new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(lead.created_at)),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <main className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-sm">
          <Link
            href="/leads"
            className="text-sm font-medium text-sky-700 transition hover:text-sky-800"
          >
            ← Back to leads
          </Link>

          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
            Lead Detail
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
            {lead.name}
          </h1>

          {resolvedSearchParams.message ? (
            <div className="mt-6 rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-sky-900">
              {resolvedSearchParams.message}
            </div>
          ) : null}

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {detailRows.map((row) => (
              <div
                key={row.label}
                className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5"
              >
                <p className="text-sm font-medium text-slate-500">{row.label}</p>
                <p className="mt-2 text-base font-medium text-slate-900">
                  {row.value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-medium text-slate-500">Current status</p>
            <p className="mt-2 text-base font-medium capitalize text-slate-900">
              {lead.status}
            </p>
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-medium text-slate-500">Notes preview</p>
            <p className="mt-2 whitespace-pre-wrap text-base leading-7 text-slate-700">
              {lead.notes || "No notes yet."}
            </p>
          </div>
        </main>

        <aside>
          <UpdateLeadForm lead={lead} />
        </aside>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <LeadAiAssistant leadId={lead.id} />

        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
            Latest AI Output
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
            Most recent saved result
          </h2>

          {latestAiGeneration ? (
            <div className="mt-6 space-y-5">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-500">Generated</p>
                <p className="mt-2 text-sm text-slate-700">
                  {new Intl.DateTimeFormat("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  }).format(new Date(latestAiGeneration.created_at))}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-500">Summary</p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                  {latestAiGeneration.summary}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-500">
                  Draft follow-up email
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                  {latestAiGeneration.draft_email}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-500">Source notes</p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                  {latestAiGeneration.raw_notes}
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-sm text-slate-500">
              No AI output yet. Generate one from the form.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
