import { generateLeadAi } from "@/app/actions/leads";

type LeadAiAssistantProps = {
  leadId: string;
};

export function LeadAiAssistant({ leadId }: LeadAiAssistantProps) {
  return (
    <form
      action={generateLeadAi}
      className="rounded-[2rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-7 shadow-[0_24px_80px_rgba(15,23,42,0.08)]"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(15,23,42,0.16)]">
          AI
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">
            AI Notes Assistant
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            Turn rough notes into a client-ready follow-up
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
            Paste unstructured notes from a call, estimate request, or client
            conversation. The assistant will clean them up into a concise summary
            and a polished draft email you can reuse in the demo.
          </p>
        </div>
      </div>

      <input type="hidden" name="leadId" value={leadId} />

      <div className="mt-7 rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">Rough notes</p>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Short, messy notes work well here. Bullet points, fragments, and
              half-finished thoughts are fine.
            </p>
          </div>
          <span className="rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
            Input
          </span>
        </div>

        <label className="mt-4 block">
          <span className="mb-2 block text-sm font-medium text-slate-700">
          Rough notes
          </span>
          <textarea
            required
            name="rawNotes"
            rows={10}
            className="w-full rounded-[1.4rem] border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-900 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
            placeholder="Spoke with owner this morning. Wants kitchen remodel estimate. Modern style, likely 30-35k budget. Needs rough timeline before next Friday. Mentioned they are comparing 2 other contractors and care a lot about communication."
          />
        </label>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
          Tip: include goals, budget, timeline, pain points, and next steps if
          you have them. The more specific the notes, the better the demo output.
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 hover:bg-slate-800"
      >
        Generate suggested summary and email
      </button>
    </form>
  );
}
