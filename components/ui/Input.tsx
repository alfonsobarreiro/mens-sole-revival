import { forwardRef, useId } from "react";
import { cn } from "./cn";

// Base styles shared by both tones — layout, sizing, invalid state.
const fieldBase =
  "block w-full border px-4 py-3 text-[0.9375rem] leading-[1.5] " +
  "transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 " +
  "disabled:cursor-not-allowed " +
  "aria-[invalid=true]:border-signal-error aria-[invalid=true]:focus:ring-signal-error";

// Tone-specific styling — light (default) sits on ground surfaces,
// dark sits on ink surfaces (newsletter band, exit-intent popup).
// Both tones use accent-600 focus rim per DS "accent stays the accent" rule.
const toneStyles = {
  light:
    "bg-bg-elevated text-ink placeholder:text-neutral-500 " +
    "border-border-input focus:border-accent-600 focus:ring-accent-600/40 " +
    "disabled:bg-neutral-100 disabled:text-neutral-400",
  dark:
    "bg-white/10 text-white placeholder:text-white/50 " +
    "border-white/30 focus:border-accent-600 focus:ring-accent-600/40 " +
    "disabled:bg-white/5 disabled:text-white/40",
} as const;

export type Tone = "light" | "dark";

export type FieldProps = {
  label: string;
  hint?: string;
  error?: string;
  hideLabel?: boolean;
  containerClassName?: string;
  tone?: Tone;
};

// ────────────────────────────── Text input
export type InputProps = FieldProps &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "className"> & {
    className?: string;
  };

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, hideLabel, containerClassName, tone = "light", id, className, ...rest },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const isDark = tone === "dark";

  return (
    <div className={cn("flex flex-col gap-2", containerClassName)}>
      <label
        htmlFor={inputId}
        className={cn(
          "text-[0.8125rem] font-medium",
          isDark ? "text-white" : "text-ink",
          hideLabel && "sr-only",
        )}
      >
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={cn(hintId, errorId) || undefined}
        className={cn(fieldBase, toneStyles[tone], className)}
        {...rest}
      />
      {hint && !error && (
        <p id={hintId} className={cn("text-[0.75rem]", isDark ? "text-white/60" : "text-text-muted")}>
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-[0.75rem] text-signal-error">
          {error}
        </p>
      )}
    </div>
  );
});

// ────────────────────────────── Textarea
export type TextareaProps = FieldProps &
  Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "className"> & {
    className?: string;
  };

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hint, error, hideLabel, containerClassName, tone = "light", id, className, rows = 4, ...rest },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const isDark = tone === "dark";

  return (
    <div className={cn("flex flex-col gap-2", containerClassName)}>
      <label
        htmlFor={inputId}
        className={cn(
          "text-[0.8125rem] font-medium",
          isDark ? "text-white" : "text-ink",
          hideLabel && "sr-only",
        )}
      >
        {label}
      </label>
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={cn(hintId, errorId) || undefined}
        className={cn(fieldBase, toneStyles[tone], "resize-y min-h-[6rem]", className)}
        {...rest}
      />
      {hint && !error && (
        <p id={hintId} className={cn("text-[0.75rem]", isDark ? "text-white/60" : "text-text-muted")}>
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-[0.75rem] text-signal-error">
          {error}
        </p>
      )}
    </div>
  );
});

// ────────────────────────────── Checkbox
export type CheckboxProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "className"
> & {
  label: string;
  hint?: string;
  className?: string;
  containerClassName?: string;
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, hint, id, className, containerClassName, ...rest },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <label
      htmlFor={inputId}
      className={cn("flex items-start gap-3 cursor-pointer", containerClassName)}
    >
      <input
        ref={ref}
        id={inputId}
        type="checkbox"
        className={cn(
          "mt-[3px] h-4 w-4 border border-border-input bg-bg-elevated " +
            "accent-cta-fill focus-visible:outline-none focus-visible:ring-2 " +
            "focus-visible:ring-focus-ring focus-visible:ring-offset-2",
          className,
        )}
        {...rest}
      />
      <span className="flex flex-col gap-1">
        <span className="text-[0.9375rem] text-ink leading-tight">{label}</span>
        {hint && <span className="text-[0.75rem] text-text-muted">{hint}</span>}
      </span>
    </label>
  );
});

// ────────────────────────────── Radio
export type RadioProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "className"
> & {
  label: string;
  hint?: string;
  className?: string;
  containerClassName?: string;
};

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { label, hint, id, className, containerClassName, ...rest },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <label
      htmlFor={inputId}
      className={cn("flex items-start gap-3 cursor-pointer", containerClassName)}
    >
      <input
        ref={ref}
        id={inputId}
        type="radio"
        className={cn(
          "mt-[3px] h-4 w-4 border border-border-input bg-bg-elevated " +
            "accent-cta-fill focus-visible:outline-none focus-visible:ring-2 " +
            "focus-visible:ring-focus-ring focus-visible:ring-offset-2",
          className,
        )}
        {...rest}
      />
      <span className="flex flex-col gap-1">
        <span className="text-[0.9375rem] text-ink leading-tight">{label}</span>
        {hint && <span className="text-[0.75rem] text-text-muted">{hint}</span>}
      </span>
    </label>
  );
});

export default Input;
