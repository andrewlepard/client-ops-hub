export function formatLeadDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function formatLeadDateTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatLeadPhone(value: string | null | undefined) {
  if (!value) {
    return "—";
  }

  const digitsOnly = value.replace(/\D/g, "");

  if (digitsOnly.length !== 10) {
    return value;
  }

  return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
}

export function getLeadStatusStyles(status: string) {
  const styles: Record<string, string> = {
    new: "border border-slate-200 bg-slate-100 text-slate-700",
    contacted: "border border-sky-200 bg-sky-100 text-sky-700",
    qualified: "border border-amber-200 bg-amber-100 text-amber-700",
    won: "border border-emerald-200 bg-emerald-100 text-emerald-700",
    lost: "border border-rose-200 bg-rose-100 text-rose-700",
  };

  return styles[status] ?? styles.new;
}
