import { generateLeadAi } from "@/app/actions/leads";

type LeadAiAssistantProps = {
  leadId: string;
};

export function LeadAiAssistant({ leadId }: LeadAiAssistantProps) {
  return (
    <form
      action={generateLeadAi}
      className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm"
    >
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
        AI Notes Assistant
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
        Turn rough notes into a clean summary and draft email
      </h2>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        Paste rough call notes, meeting notes, or inquiry details. The result
        is saved to the most recent AI output for this lead.
      </p>

      <input type="hidden" name="leadId" value={leadId} />

      <label className="mt-6 block">
        <span className="mb-2 block text-sm font-medium text-slate-700">
          Rough notes
        </span>
        <textarea
          required
          name="rawNotes"
          rows={8}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-300 focus:bg-white"
          placeholder="Client needs a kitchen remodel estimate. Wants a modern look, budget is around 35k, hoping to start next month..."
        />
      </label>

      <button
        type="submit"
        className="mt-6 rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
      >
        Generate summary and email
      </button>
    </form>
  );
}
