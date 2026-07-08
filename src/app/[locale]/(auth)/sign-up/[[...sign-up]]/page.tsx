import { SignUp } from "@clerk/nextjs";
import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function SignUpPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("auth.signUp");

  return (
    <div className="text-center">
      <h1 className="mb-1 text-2xl">{t("title")}</h1>
      <p className="mb-6 text-sm text-muted-foreground">{t("subtitle")}</p>
      <SignUp
        appearance={{
          variables: {
            colorPrimary: "#1E3A2E",
            colorBackground: "#FFFFFF",
            colorText: "#1C1F1B",
            colorTextSecondary: "#6B6F68",
            borderRadius: "14px",
            fontFamily: "var(--font-sans)",
          },
          elements: {
            card: "shadow-none border border-[#ECE8E2]",
            headerTitle: "hidden",
            headerSubtitle: "hidden",
          },
        }}
      />
    </div>
  );
}
