import { updateLead } from "@/app/actions/leads";

const statusOptions = ["new", "contacted", "qualified", "won", "lost"] as const;

type UpdateLeadFormProps = {
  lead: {
    id: string;
    status: string;
    notes: string | null;
  };
};

export function UpdateLeadForm({ lead }: UpdateLeadFormProps) {
  return (
    <form
      action={updateLead}
      className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm"
    >
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
        Update Lead
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
        Edit status and notes
      </h2>

      <input type="hidden" name="leadId" value={lead.id} />

      <div className="mt-6 space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Status
          </span>
          <select
            name="status"
            defaultValue={lead.status}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-300 focus:bg-white"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Notes
          </span>
          <textarea
            name="notes"
            rows={8}
            defaultValue={lead.notes ?? ""}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-300 focus:bg-white"
            placeholder="Add lead notes here..."
          />
        </label>
      </div>

      <button
        type="submit"
        className="mt-6 rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
      >
        Save changes
      </button>
    </form>
  );
}
