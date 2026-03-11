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
    <main className="min-h-screen px-6 py-14 text-slate-900 sm:py-18">
      <div className="mx-auto grid min-h-[calc(100vh-7rem)] w-full max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <section className="rounded-[2.25rem] border border-white/70 bg-white/82 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:p-10 lg:p-12">
          <div className="flex items-center gap-4">
            <div className="flex h-13 w-13 items-center justify-center rounded-[1.3rem] bg-slate-950 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(15,23,42,0.16)]">
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

          <div className="mt-10">
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Run your client operations in one place.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Client Ops Hub helps small service businesses manage leads, stay
              organized, and turn rough notes into clear follow-up communication.
            </p>
          </div>

          <div className="mt-10 rounded-[1.6rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-6">
            <p className="text-sm font-medium text-slate-500">What it gives you</p>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-700">
              A clean workspace for managing leads, tracking follow-up, and keeping
              client communication organized.
            </p>
          </div>
        </section>

        <section className="flex items-center justify-center">
          <AuthCard searchParams={searchParams} />
        </section>

        <div className="lg:col-span-2">
          <p className="text-center text-sm text-slate-500">
            Sign in to access your dashboard, leads workspace, and AI notes assistant.
          </p>
        </div>
      </div>
    </main>
  );
}
