import { getTranslations } from "next-intl/server";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const testimonialKeys = ["t1", "t2", "t3"] as const;

export async function TestimonialsSection() {
  const t = await getTranslations("marketing.testimonials");

  return (
    <section className="container py-20">
      <h2 className="text-center text-3xl">{t("title")}</h2>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {testimonialKeys.map((key) => {
          const name = t(`items.${key}.name` as "items.t1.name");
          return (
            <Card key={key}>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">
                  &ldquo;{t(`items.${key}.quote` as "items.t1.quote")}&rdquo;
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">{name}</p>
                    <p className="text-xs text-muted-foreground">
                      {t(`items.${key}.role` as "items.t1.role")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
