"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const t = useTranslations("auth.forgotPassword");
  const tErrors = useTranslations("errors.validation");

  const schema = z.object({
    email: z.string().min(1, tErrors("required")).email(tErrors("invalidEmail")),
  });
  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  // In production this calls Clerk's `signIn.create({ strategy: "reset_password_email_code", identifier })`
  // flow via the client SDK. Left as a clearly-marked integration point.
  async function onSubmit(values: FormValues) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    console.info("Password reset requested for", values.email);
  }

  return (
    <Card>
      <CardContent className="pt-6 text-center">
        <h1 className="mb-1 text-2xl">{t("title")}</h1>
        <p className="mb-6 text-sm text-muted-foreground">{t("subtitle")}</p>

        {isSubmitSuccessful ? (
          <p className="text-sm text-success">
            {t("title")} — check your inbox for the reset link.
          </p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" autoComplete="email" {...register("email")} />
              {errors.email && (
                <p className="text-xs text-error">{errors.email.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {t("submit")}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
