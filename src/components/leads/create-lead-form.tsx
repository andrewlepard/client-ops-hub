import { createLead } from "@/app/actions/leads";

export function CreateLeadForm() {
  return (
    <form
      action={createLead}
      className="rounded-[2rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)]"
    >
      <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">
            Create Lead
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
            Add a new lead
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Keep the intake simple. You can refine details later from the lead page.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Name
          </span>
          <input
            required
            name="name"
            type="text"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
            placeholder="Jordan Lee"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Company
          </span>
          <input
            name="company"
            type="text"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
            placeholder="Lee Home Services"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Email
          </span>
          <input
            name="email"
            type="email"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
            placeholder="jordan@example.com"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Phone
          </span>
          <input
            name="phone"
            type="text"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
            placeholder="(555) 123-4567"
          />
        </label>

        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Source
          </span>
          <input
            name="source"
            type="text"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
            placeholder="Referral, website, Instagram, etc."
          />
        </label>

        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Notes
          </span>
          <textarea
            name="notes"
            rows={4}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
            placeholder="Initial request, service details, budget, timeline..."
          />
        </label>
      </div>

      <button
        type="submit"
        className="mt-6 w-full rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white shadow-[0_10px_24px_rgba(15,23,42,0.16)] transition hover:-translate-y-0.5 hover:bg-slate-800"
      >
        Save lead
      </button>
    </form>
  );
}
