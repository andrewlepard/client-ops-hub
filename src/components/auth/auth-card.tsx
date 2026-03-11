import { signIn, signUp } from "@/app/actions/auth";

type AuthCardProps = {
  searchParams?: Promise<{
    message?: string;
  }>;
};

export async function AuthCard({ searchParams }: AuthCardProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const message = resolvedSearchParams?.message;

  return (
    <div className="w-full max-w-md rounded-[2.1rem] border border-white/70 bg-white/92 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.10)] backdrop-blur">
      <div className="border-b border-slate-200 pb-5">
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
          Sign in to your workspace
        </h2>
      </div>

      {message ? (
        <div className="mt-6 rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm leading-6 text-sky-900">
          {message}
        </div>
      ) : null}

      <form className="mt-6 space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Email
          </span>
          <input
            required
            type="email"
            name="email"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
            placeholder="you@example.com"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Password
          </span>
          <input
            required
            minLength={6}
            type="password"
            name="password"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
            placeholder="At least 6 characters"
          />
        </label>

        <div className="pt-2">
          <button
            type="submit"
            formAction={signIn}
            className="w-full rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white shadow-[0_12px_28px_rgba(15,23,42,0.16)] transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            Sign in
          </button>
          <button
            type="submit"
            formAction={signUp}
            className="mt-3 w-full rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
          >
            Create account
          </button>
        </div>
      </form>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
        <p className="text-xs leading-5 text-slate-500">
          Use the same email and password to sign in or create an account.
        </p>
      </div>
    </div>
  );
}
