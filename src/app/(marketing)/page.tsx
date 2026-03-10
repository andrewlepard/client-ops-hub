import { redirect } from "next/navigation";
import { AuthCard } from "@/components/auth/auth-card";
import { createClient } from "@/lib/supabase/server";

type LandingPageProps = {
  searchParams: Promise<{
    message?: string;
  }>;
};

export default async function LandingPage({ searchParams }: LandingPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#dbeafe_0%,#f8fafc_42%,#e0f2fe_100%)] px-6 py-16 text-slate-900">
      <div className="mx-auto grid min-h-[calc(100vh-8rem)] w-full max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[2rem] border border-white/70 bg-white/80 p-10 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
            Client Ops Hub
          </p>
          <h1 className="mt-5 max-w-2xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            A polished demo workspace for small service businesses.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Track leads, keep projects organized, and turn rough notes into a
            usable summary and follow-up email draft.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-500">MVP focus</p>
              <p className="mt-2 text-base font-semibold text-slate-900">
                Leads, projects, and one AI workflow
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-500">Auth</p>
              <p className="mt-2 text-base font-semibold text-slate-900">
                Email and password with Supabase
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-500">Next step</p>
              <p className="mt-2 text-base font-semibold text-slate-900">
                Protected app shell, then CRUD UI
              </p>
            </div>
          </div>

          <div className="mt-10 text-sm text-slate-500">
            After signing in, you will land in the protected app area at{" "}
            <code className="rounded bg-slate-100 px-2 py-1 text-slate-700">
              /dashboard
            </code>
            .
          </div>
        </section>

        <section className="flex items-center justify-center">
          <AuthCard searchParams={searchParams} />
        </section>

        <div className="lg:col-span-2">
          <p className="text-center text-sm text-slate-500">
            Demo-oriented setup only. Full CRUD pages are intentionally not
            built yet. Sign in to confirm auth, route protection, and the app
            shell are working before moving on to CRUD pages.
          </p>
        </div>
      </div>
    </main>
  );
}
