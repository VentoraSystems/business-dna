"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ProfileForm() {
  const { user, isLoaded } = useUser();
  const t = useTranslations("settings.profile");
  const tCommon = useTranslations("common");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [saving, setSaving] = useState(false);
  const [avatarSaving, setAvatarSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName ?? "");
      setLastName(user.lastName ?? "");
    }
  }, [user]);

  if (!isLoaded || !user) return null;

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await user!.update({ firstName: firstName.trim(), lastName: lastName.trim() });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : tCommon("somethingWentWrong"));
    } finally {
      setSaving(false);
    }
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarSaving(true);
    setError(null);
    try {
      await user!.setProfileImage({ file });
    } catch (err) {
      setError(err instanceof Error ? err.message : tCommon("somethingWentWrong"));
    } finally {
      setAvatarSaving(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="space-y-4">
      {/* Avatar */}
      <div className="flex items-center gap-4">
        <Image
          src={user.imageUrl}
          alt={user.firstName ?? "Avatar"}
          width={64}
          height={64}
          className="rounded-full object-cover"
        />
        <div className="space-y-1">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={avatarSaving}
            onClick={() => fileRef.current?.click()}
          >
            {avatarSaving ? tCommon("loading") : t("changePhoto")}
          </Button>
          <p className="text-xs text-muted-foreground">{t("photoHint")}</p>
        </div>
      </div>

      {/* Name */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="pf-firstName">{t("firstName")}</Label>
          <Input
            id="pf-firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pf-lastName">{t("lastName")}</Label>
          <Input
            id="pf-lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
      </div>

      {/* Email — read-only, managed by Clerk */}
      <div className="space-y-1.5">
        <Label htmlFor="pf-email">{t("email")}</Label>
        <Input
          id="pf-email"
          type="email"
          value={user.primaryEmailAddress?.emailAddress ?? ""}
          readOnly
          className="cursor-not-allowed opacity-60"
        />
      </div>

      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
      {success && <p className="text-sm font-medium text-green-600">{t("saved")}</p>}

      <Button type="button" disabled={saving} onClick={handleSave}>
        {saving ? tCommon("loading") : tCommon("save")}
      </Button>
    </div>
  );
}
