"use client";
import {
  useId,
  useState,
  ChangeEvent,
  FocusEvent,
  InputHTMLAttributes,
} from "react";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "onBlur"> & {
  name: string;
  label: string;
  validate?: (value: string) => Promise<string | null>;
  onValidatedChange?: (value: string, isValid: boolean) => void;
};

export function ValidatedField({
  name,
  label,
  validate,
  onValidatedChange,
  defaultValue = "",
  ...rest
}: Props) {
  const id = useId();
  const [value, setValue] = useState<string>(String(defaultValue));
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleBlur(_: FocusEvent<HTMLInputElement>) {
    if (!validate) return;
    setBusy(true);
    try {
      const err = await validate(value);
      setError(err);
      onValidatedChange?.(value, err === null);
    } finally {
      setBusy(false);
    }
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
    if (error) setError(null);
  }

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        name={name}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
        className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        {...rest}
      />
      {busy && <span className="text-xs text-zinc-500">Validando…</span>}
      {error && (
        <p id={`${id}-err`} role="alert" className="text-xs text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
}
