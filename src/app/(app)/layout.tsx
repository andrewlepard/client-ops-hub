import Link from "next/link";
import { redirect } from "next/navigation";
import { signOut } from "@/app/actions/auth";
import { createClient } from "@/lib/supabase/server";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/leads", label: "Leads" },
  { href: "/projects", label: "Projects" },
];

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-6 sm:py-6">
        <header className="sticky top-4 z-20 rounded-[2rem] border border-white/70 bg-white/88 px-6 py-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(15,23,42,0.18)]">
                CO
              </div>
              <div>
                <p className="text-lg font-semibold tracking-tight text-slate-950">
                  Client Ops Hub
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Service business command center
                </p>
              </div>
            </div>

            <nav className="flex flex-wrap items-center gap-2.5">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
                >
                  {item.label}
                </Link>
              ))}

              <form action={signOut}>
                <button
                  type="submit"
                  className="rounded-full bg-slate-950 px-4 py-2.5 text-sm font-medium text-white shadow-[0_10px_24px_rgba(15,23,42,0.16)] transition hover:bg-slate-800"
                >
                  Sign out
                </button>
              </form>
            </nav>
          </div>
        </header>

        <div className="mt-4 border-t border-slate-200/80" />

        <div className="flex-1 py-6 sm:py-8">
          {children}
        </div>
      </div>
    </div>
  );
}
