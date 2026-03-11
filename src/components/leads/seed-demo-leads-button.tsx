import { seedDemoAiOutputs, seedDemoLeads } from "@/app/actions/leads";

export function SeedDemoLeadsButton() {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white/90 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">
        Demo Data
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Need a fast meeting-ready setup? Add realistic leads and a few saved AI
        outputs for the signed-in user.
      </p>

      <div className="mt-4 space-y-3">
        <form action={seedDemoLeads}>
          <button
            type="submit"
            className="w-full rounded-full bg-slate-950 px-4 py-2.5 text-sm font-medium text-white shadow-[0_10px_24px_rgba(15,23,42,0.16)] transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            Seed Demo Leads
          </button>
        </form>

        <form action={seedDemoAiOutputs}>
          <button
            type="submit"
            className="w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
          >
            Seed Demo AI Outputs
          </button>
        </form>
      </div>
    </div>
  );
}
