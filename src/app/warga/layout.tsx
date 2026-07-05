export default async function WargaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
