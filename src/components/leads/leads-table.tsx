"use client";

import { useRouter } from "next/navigation";
import { formatLeadDate, getLeadStatusStyles } from "@/lib/leads";

type LeadRow = {
  id: string;
  name: string;
  company: string | null;
  status: string;
  created_at: string;
};

type LeadsTableProps = {
  leads: LeadRow[];
};

export function LeadsTable({ leads }: LeadsTableProps) {
  const router = useRouter();

  function openLead(leadId: string) {
    router.push(`/leads/${leadId}`);
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLTableRowElement>,
    leadId: string,
  ) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openLead(leadId);
    }
  }

  return (
    <div className="mt-8 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50/80">
          <tr className="text-left text-sm text-slate-500">
            <th className="px-5 py-4 font-medium">Name</th>
            <th className="px-5 py-4 font-medium">Company</th>
            <th className="px-5 py-4 font-medium">Status</th>
            <th className="px-5 py-4 font-medium">Created</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white text-sm text-slate-700">
          {leads.map((lead) => (
            <tr
              key={lead.id}
              tabIndex={0}
              role="link"
              onClick={() => openLead(lead.id)}
              onKeyDown={(event) => handleKeyDown(event, lead.id)}
              className="cursor-pointer transition hover:bg-slate-50 focus:bg-sky-50 focus:outline-none"
              aria-label={`Open lead ${lead.name}`}
            >
              <td className="px-5 py-4 font-semibold text-slate-950">
                {lead.name}
              </td>
              <td className="px-5 py-4">{lead.company || "—"}</td>
              <td className="px-5 py-4">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getLeadStatusStyles(lead.status)}`}
                >
                  {lead.status}
                </span>
              </td>
              <td className="px-5 py-4">{formatLeadDate(lead.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
