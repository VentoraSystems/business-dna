import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { isAdmin } from "@/lib/auth";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Middleware already gates /admin routes; this is a second, server-side
  // check in case a page is ever rendered outside that middleware matcher.
  const admin = await isAdmin();
  if (!admin) redirect("/dashboard");

  const t = await getTranslations("admin");

  return (
    <div className="min-h-screen bg-[#161511] text-[#EDEAE4]">
      <header className="flex items-center justify-between border-b border-[#2B2924] px-8 py-5">
        <Link href="/dashboard" className="text-xs text-[#9C988E] hover:text-[#EDEAE4]">
          ← {t("backToApp")}
        </Link>
        <span className="font-display text-lg">BusinessDNA — {t("title")}</span>
        <span className="w-20" />
      </header>
      <main className="mx-auto max-w-6xl px-8 py-10">{children}</main>
    </div>
  );
}
