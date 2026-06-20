export default function MusicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6 text-zinc-100">
      <div className="grid gap-6 md:grid-cols-2">{children}</div>
    </div>
  );
}