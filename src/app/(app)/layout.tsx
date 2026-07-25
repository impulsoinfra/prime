import { redirect } from "next/navigation";
import { BottomNav } from "@/components/layout/BottomNav";
import { Sidebar } from "@/components/layout/Sidebar";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const nombre = (user.user_metadata?.nombre as string | undefined) ?? null;
  const email = user.email ?? null;

  return (
    <div className="min-h-dvh md:flex">
      <Sidebar nombre={nombre} email={email} />
      <div className="min-w-0 flex-1 pb-24 md:pb-0">
        <div className="mx-auto max-w-[1120px] px-4 py-5 md:px-8 md:py-8">
          {children}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
