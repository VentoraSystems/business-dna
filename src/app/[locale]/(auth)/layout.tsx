import { Link } from "@/i18n/navigation";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary/30 px-4 py-12">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary font-display text-sm text-primary-foreground">
          B
        </span>
        <span className="font-display text-lg">BusinessDNA</span>
      </Link>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
