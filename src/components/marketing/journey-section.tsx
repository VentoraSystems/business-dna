import { getTranslations } from "next-intl/server";

export async function JourneySection() {
  const t = await getTranslations("marketing.journey");

  return (
    <section className="border-y border-border bg-secondary/40 py-20">
      <div className="container text-center">
        <h2 className="text-3xl">{t("title")}</h2>
        <p className="mt-3 text-muted-foreground">{t("subtitle")}</p>
        <div className="mx-auto mt-12 flex max-w-3xl items-center justify-between">
          {["assessment", "matches", "blueprint", "roadmap", "launch"].map((stage, i, arr) => (
            <div key={stage} className="flex flex-1 items-center">
              <div className="flex h-3 w-3 shrink-0 rounded-full bg-primary" />
              {i < arr.length - 1 && <div className="h-px flex-1 bg-border" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
