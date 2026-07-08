import { setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";

// Clerk's <SignIn /> already includes a built-in "Forgot password?" flow
// (email code + reset). No separate page is needed — send the user there.
export default async function ForgotPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const prefix = locale === "ro" ? "/ro" : "";
  redirect(`${prefix}/sign-in`);
}
