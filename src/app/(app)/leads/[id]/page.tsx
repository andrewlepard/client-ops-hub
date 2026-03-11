import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyOutputButton } from "@/components/leads/copy-output-button";
import { LeadAiAssistant } from "@/components/leads/lead-ai-assistant";
import { UpdateLeadForm } from "@/components/leads/update-lead-form";
import {
  formatLeadDateTime,
} from "@/lib/leads";
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

  return (
    <div className="space-y-6">
      <div>
        <main className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <Link
            href="/leads"
            className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-sky-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-800"
          >
            ← Back to leads
          </Link>

          {resolvedSearchParams.message ? (
            <div className="mt-6 rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-sky-900">
              {resolvedSearchParams.message}
            </div>
          ) : null}

          <UpdateLeadForm lead={lead} />
        </main>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <LeadAiAssistant leadId={lead.id} />

        <section className="rounded-[2rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-7 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">
            Assistant Output
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            Most recent suggested content
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            This keeps the latest generated summary and follow-up draft easy to
            review, present, and copy into the next step of the workflow.
          </p>

          {latestAiGeneration ? (
            <div className="mt-6 space-y-5">
              <div className="flex items-center justify-between gap-4 rounded-[1.5rem] border border-slate-200 bg-white px-5 py-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">Generated</p>
                  <p className="mt-1 text-sm text-slate-700">
                    {formatLeadDateTime(latestAiGeneration.created_at)}
                  </p>
                </div>
                <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  Saved
                </span>
              </div>

              <div className="rounded-[1.6rem] border border-slate-200 bg-white p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Suggested summary
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      A concise overview of the lead and their current request.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                      Summary
                    </span>
                    <CopyOutputButton
                      label="Summary"
                      value={latestAiGeneration.summary}
                    />
                  </div>
                </div>
                <div className="mt-4 rounded-[1.25rem] bg-slate-50 px-4 py-4">
                  <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                    {latestAiGeneration.summary}
                  </p>
                </div>
              </div>

              <div className="rounded-[1.6rem] border border-slate-200 bg-white p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Suggested follow-up email
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      A polished draft that feels ready to send with light editing.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full border border-amber-100 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                      Email
                    </span>
                    <CopyOutputButton
                      label="Email"
                      value={latestAiGeneration.draft_email}
                    />
                  </div>
                </div>
                <div className="mt-4 rounded-[1.25rem] bg-slate-50 px-4 py-4">
                  <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                    {latestAiGeneration.draft_email}
                  </p>
                </div>
              </div>

              <div className="rounded-[1.6rem] border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Source notes
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      The original rough notes used to generate the suggestions.
                    </p>
                  </div>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">
                    Source
                  </span>
                </div>
                <div className="mt-4 rounded-[1.25rem] bg-slate-50 px-4 py-4">
                  <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                    {latestAiGeneration.raw_notes}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-[1.75rem] border border-dashed border-slate-300 bg-[linear-gradient(180deg,#f8fafc_0%,#f1f5f9_100%)] px-6 py-12 text-center">
              <p className="text-base font-medium text-slate-700">
                No assistant output yet
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Generate a summary and follow-up email from rough notes to turn
                this into a presentation-ready example.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
