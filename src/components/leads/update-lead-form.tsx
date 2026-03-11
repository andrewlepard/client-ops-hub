"use client";

import { useState } from "react";
import { formatLeadPhone, getLeadStatusStyles } from "@/lib/leads";
import { updateLead } from "@/app/actions/leads";

const statusOptions = ["new", "contacted", "qualified", "won", "lost"] as const;

type UpdateLeadFormProps = {
  lead: {
    id: string;
    name: string;
    company: string | null;
    email: string | null;
    phone: string | null;
    source: string | null;
    status: string;
    notes: string | null;
  };
};

export function UpdateLeadForm({ lead }: UpdateLeadFormProps) {
  const [isEditing, setIsEditing] = useState(false);

  const detailRows = [
    { label: "Company", value: lead.company || "—" },
    { label: "Email", value: lead.email || "—" },
    { label: "Phone", value: formatLeadPhone(lead.phone) },
    { label: "Source", value: lead.source || "—" },
  ];

  if (!isEditing) {
    return (
      <section className="mt-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">
              Lead Detail
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
              {lead.name}
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex h-fit rounded-full px-3 py-1 text-xs font-semibold capitalize ${getLeadStatusStyles(lead.status)}`}
            >
              {lead.status}
            </span>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
            >
              Edit lead
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {detailRows.map((row) => (
            <div
              key={row.label}
              className="rounded-[1.5rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-5"
            >
              <p className="text-sm font-medium text-slate-500">{row.label}</p>
              <p className="mt-2 text-base font-medium text-slate-900">
                {row.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-5">
          <p className="text-sm font-medium text-slate-500">Notes preview</p>
          <p className="mt-2 whitespace-pre-wrap text-base leading-7 text-slate-700">
            {lead.notes || "No notes yet."}
          </p>
        </div>
      </section>
    );
  }

  return (
    <form
      action={updateLead}
      className="mt-8 rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">
            Edit Lead
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
            Update lead details
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
        Keep the record current with one simple edit form for contact info,
        pipeline status, and notes.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>

      <input type="hidden" name="leadId" value={lead.id} />

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Name
          </span>
          <input
            required
            name="name"
            type="text"
            defaultValue={lead.name}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Company
          </span>
          <input
            name="company"
            type="text"
            defaultValue={lead.company ?? ""}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Email
          </span>
          <input
            name="email"
            type="email"
            defaultValue={lead.email ?? ""}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Phone
          </span>
          <input
            name="phone"
            type="text"
            defaultValue={lead.phone ?? ""}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
          />
        </label>

        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Source
          </span>
          <input
            name="source"
            type="text"
            defaultValue={lead.source ?? ""}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Status
          </span>
          <select
            name="status"
            defaultValue={lead.status}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <span
            className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getLeadStatusStyles(lead.status)}`}
          >
            Current: {lead.status}
          </span>
        </label>

        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Notes
          </span>
          <textarea
            name="notes"
            rows={8}
            defaultValue={lead.notes ?? ""}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
            placeholder="Add lead notes here..."
          />
        </label>
      </div>

      <button
        type="submit"
        className="mt-6 rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white shadow-[0_10px_24px_rgba(15,23,42,0.16)] transition hover:-translate-y-0.5 hover:bg-slate-800"
      >
        Save lead
      </button>
    </form>
  );
}
