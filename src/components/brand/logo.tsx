import { cn } from "@/lib/utils";
import { BRAND } from "@/data/brand";

const sizes = {
  sm: { mark: "h-7 w-7", text: "text-lg" },
  md: { mark: "h-9 w-9", text: "text-2xl" },
  lg: { mark: "h-14 w-14", text: "text-4xl" },
} as const;

export function BrandMark({
  size = "md",
  className,
}: {
  size?: keyof typeof sizes;
  className?: string;
}) {
  return (
    <img
      src={BRAND.markUrl}
      alt={BRAND.markAlt}
      loading="lazy"
      className={cn(
        "shrink-0 rounded-full border border-border object-cover",
        sizes[size].mark,
        className,
      )}
    />
  );
}

export function Logo({
  size = "md",
  withWordmark = true,
  className,
}: {
  size?: keyof typeof sizes;
  withWordmark?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex min-w-0 items-center gap-2.5", className)}>
      <BrandMark size={size} />
      {withWordmark ? (
        <span
          className={cn(
            "truncate font-display uppercase leading-none tracking-wide text-foreground",
            sizes[size].text,
          )}
        >
          The 1% Club
        </span>
      ) : null}
    </span>
  );
}
