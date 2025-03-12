import * as React from "react";
import { cn } from "../lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, value, defaultValue, error, ...props }, ref) => {
    const [focused, setFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(!!defaultValue || !!value);
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    React.useEffect(() => {
      if (
        (label === "State" || label === "Country" || label === "Postal Code") &&
        !hasValue
      ) {
        inputRef.current?.focus();
      }
    }, [hasValue, label]);

    const handleFocus = () => setFocused(true);
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      setHasValue(!!e.target.value);
    };

    return (
      <div className="relative w-full">
        <input
          type={type}
          ref={(el) => {
            inputRef.current = el;
            if (typeof ref === "function") ref(el);
            else if (ref) ref.current = el;
          }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={value}
          className={cn(
            "peer w-full rounded-md border px-3 pt-5 pb-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none",
            error ? "border-red-500 focus:ring-red-500" : "border-gray-300",
            className
          )}
          {...props}
        />
 <label
  className={cn(
    "absolute transition-all duration-300 px-1 bg-white",
    focused || hasValue
      ? "text-xs -top-2 text-indigo-500"
      : "top-3.5 text-sm text-gray-400 dark:text-black",
    "left-3" // Ensuring alignment with other fields
  )}
>


          {label}
        </label>
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
