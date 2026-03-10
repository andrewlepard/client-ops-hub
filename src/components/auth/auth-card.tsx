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
    <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_20px_80px_rgba(15,23,42,0.08)]">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
        Sign in
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
        Access the protected demo workspace
      </h2>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        Use email and password for the simplest v1 auth flow. New accounts can
        be created here too.
      </p>

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
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-300 focus:bg-white"
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
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-300 focus:bg-white"
            placeholder="At least 6 characters"
          />
        </label>

        <button
          type="submit"
          formAction={signIn}
          className="w-full rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Sign in
        </button>
        <button
          type="submit"
          formAction={signUp}
          className="w-full rounded-full border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
        >
          Create account
        </button>
      </form>
      <p className="mt-3 text-xs leading-5 text-slate-500">
        Use the same email and password fields above, then choose either sign
        in or create account.
      </p>
    </div>
  );
}
