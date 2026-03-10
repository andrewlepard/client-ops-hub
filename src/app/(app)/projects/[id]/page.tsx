type ProjectDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { id } = await params;

  return (
    <main className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
        Project Detail
      </p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
        Project placeholder: {id}
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
        This placeholder confirms the protected detail route exists before the
        full project experience is built.
      </p>
    </main>
  );
}
