import { useId, type ReactNode } from "react";
import { AlertCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function FieldMessage({
  error,
  helper,
}: {
  error?: string | undefined;
  helper?: string | undefined;
}) {
  if (error) {
    return (
      <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-medium text-crimson-tint">
        <AlertCircle className="size-3.5 shrink-0" /> {error}
      </p>
    );
  }
  if (helper) return <p className="mt-1.5 text-xs text-muted-foreground">{helper}</p>;
  return null;
}

export function Field({
  label,
  htmlFor,
  error,
  helper,
  children,
  className,
}: {
  label: string;
  htmlFor?: string | undefined;
  error?: string | undefined;
  helper?: string | undefined;
  children: ReactNode;
  className?: string | undefined;
}) {
  return (
    <div className={cn("w-full", className)}>
      <Label htmlFor={htmlFor} className="mb-1.5 block font-body text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      {children}
      <FieldMessage error={error} helper={helper} />
    </div>
  );
}

type InputFieldProps = React.ComponentProps<typeof Input> & {
  label: string;
  error?: string | undefined;
  helper?: string | undefined;
};

export function InputField({ label, error, helper, className, ...props }: InputFieldProps) {
  const id = useId();
  return (
    <Field label={label} htmlFor={props.id ?? id} error={error} helper={helper}>
      <Input
        id={props.id ?? id}
        aria-invalid={Boolean(error) || undefined}
        className={cn(
          "h-11 border-border bg-charcoal text-foreground placeholder:text-muted-foreground/70",
          error && "border-crimson focus-visible:ring-crimson",
          className,
        )}
        {...props}
      />
    </Field>
  );
}

type TextareaFieldProps = React.ComponentProps<typeof Textarea> & {
  label: string;
  error?: string | undefined;
  helper?: string | undefined;
};

export function TextareaField({ label, error, helper, className, ...props }: TextareaFieldProps) {
  const id = useId();
  return (
    <Field label={label} htmlFor={props.id ?? id} error={error} helper={helper}>
      <Textarea
        id={props.id ?? id}
        aria-invalid={Boolean(error) || undefined}
        className={cn(
          "min-h-24 border-border bg-charcoal text-foreground placeholder:text-muted-foreground/70",
          error && "border-crimson focus-visible:ring-crimson",
          className,
        )}
        {...props}
      />
    </Field>
  );
}
