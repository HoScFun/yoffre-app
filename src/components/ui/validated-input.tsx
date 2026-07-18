import * as React from "react";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

type ValidationState = "idle" | "valid" | "invalid";

interface ValidatedInputProps extends React.ComponentProps<"input"> {
  validate?: (value: string) => string | null;
  error?: string | null;
  /** Show validation state even without blur */
  forceValidation?: boolean;
}

const ValidatedInput = React.forwardRef<HTMLInputElement, ValidatedInputProps>(
  ({ className, validate, error: externalError, forceValidation, onBlur, onFocus, onChange, value, ...props }, ref) => {
    const [touched, setTouched] = React.useState(false);
    const [focused, setFocused] = React.useState(false);
    const [internalError, setInternalError] = React.useState<string | null>(null);

    const error = externalError !== undefined ? externalError : internalError;
    const showValidation = forceValidation || (touched && !focused);
    const strVal = String(value ?? "");

    const state: ValidationState = !showValidation
      ? focused ? "idle" : "idle"
      : error ? "invalid"
      : strVal.length > 0 ? "valid"
      : "idle";

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setTouched(true);
      setFocused(false);
      if (validate) setInternalError(validate(e.target.value));
      onBlur?.(e);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(true);
      onFocus?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (touched && validate) setInternalError(validate(e.target.value));
      onChange?.(e);
    };

    return (
      <div className="space-y-1">
        <div className="relative">
          <input
            ref={ref}
            value={value}
            className={cn(
              "flex h-10 w-full rounded-md border bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pr-9",
              focused && "border-primary ring-primary focus-visible:ring-primary",
              state === "valid" && "border-green-500",
              state === "invalid" && "border-destructive",
              state === "idle" && !focused && "border-input",
              className,
            )}
            onBlur={handleBlur}
            onFocus={handleFocus}
            onChange={handleChange}
            {...props}
          />
          {state === "valid" && (
            <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
          )}
          {state === "invalid" && (
            <X className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive" />
          )}
        </div>
        {state === "invalid" && error && (
          <p className="text-xs text-destructive">{error}</p>
        )}
      </div>
    );
  },
);
ValidatedInput.displayName = "ValidatedInput";

// Validated textarea variant
interface ValidatedTextareaProps extends React.ComponentProps<"textarea"> {
  validate?: (value: string) => string | null;
  error?: string | null;
  forceValidation?: boolean;
}

const ValidatedTextarea = React.forwardRef<HTMLTextAreaElement, ValidatedTextareaProps>(
  ({ className, validate, error: externalError, forceValidation, onBlur, onFocus, onChange, value, ...props }, ref) => {
    const [touched, setTouched] = React.useState(false);
    const [focused, setFocused] = React.useState(false);
    const [internalError, setInternalError] = React.useState<string | null>(null);

    const error = externalError !== undefined ? externalError : internalError;
    const showValidation = forceValidation || (touched && !focused);
    const strVal = String(value ?? "");

    const state: ValidationState = !showValidation
      ? "idle"
      : error ? "invalid"
      : strVal.length > 0 ? "valid"
      : "idle";

    return (
      <div className="space-y-1">
        <textarea
          ref={ref}
          value={value}
          className={cn(
            "flex min-h-[80px] w-full rounded-md border bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            focused && "border-primary ring-primary",
            state === "valid" && "border-green-500",
            state === "invalid" && "border-destructive",
            state === "idle" && !focused && "border-input",
            className,
          )}
          onBlur={(e) => { setTouched(true); setFocused(false); if (validate) setInternalError(validate(e.target.value)); onBlur?.(e); }}
          onFocus={(e) => { setFocused(true); onFocus?.(e); }}
          onChange={(e) => { if (touched && validate) setInternalError(validate(e.target.value)); onChange?.(e); }}
          {...props}
        />
        {state === "invalid" && error && (
          <p className="text-xs text-destructive">{error}</p>
        )}
      </div>
    );
  },
);
ValidatedTextarea.displayName = "ValidatedTextarea";

export { ValidatedInput, ValidatedTextarea };
