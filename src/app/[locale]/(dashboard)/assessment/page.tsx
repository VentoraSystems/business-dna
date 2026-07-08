import { setRequestLocale } from "next-intl/server";
import { isValidLocale, defaultLocale } from "@/i18n/config";
import { getOrCreateActiveSession } from "@/features/assessment/actions/assessment-actions";
import { AssessmentFlow } from "@/features/assessment/components/assessment-flow";

// Resuming an in-progress assessment is a server-side concern: we resolve
// (or create) the session before anything renders, so the client component
// never has to deal with a "loading my own progress" state.
export default async function AssessmentPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const activeLocale = isValidLocale(locale) ? locale : defaultLocale;

  const session = await getOrCreateActiveSession(activeLocale);

  return (
    <AssessmentFlow
      sessionId={session.id}
      initialStep={session.currentStep}
      initialAnswers={session.answers}
    />
  );
}
