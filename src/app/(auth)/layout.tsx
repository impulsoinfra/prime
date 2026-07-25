export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-surface-1 px-5 py-10">
      <div className="w-full max-w-[360px]">
        <p className="font-voice mb-6 text-center text-[26px]">prime</p>
        <div className="rounded-[20px] border border-border bg-surface-2 p-6">
          {children}
        </div>
      </div>
    </main>
  );
}
