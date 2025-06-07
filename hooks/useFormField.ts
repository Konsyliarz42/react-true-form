import React from "react";
import useForm from "./useForm.ts";

type FieldState<T> = {
  value: T | undefined;
  errors: string[];

  setValue: (newValue: T) => void;
  setErrors: (newErrors: string[]) => void;
};

/**
 * Controller of the form field.
 */
export default function useFormField<T, K extends keyof T>(name: K): FieldState<T[K]> {
  const context = useForm<T>();

  const [value, errors] = React.useMemo(
    () => [context.value[name] || undefined, context.errors[name] || []],
    [context.value[name], context.errors[name]],
  );

  const setValue = React.useCallback(
    (newValue: T[K]) => context.setValue((current) => ({ ...current, [name]: newValue })),
    [context.setValue],
  );

  const setErrors = React.useCallback(
    (newErrors: string[]) => context.setErrors((current) => ({ ...current, [name]: newErrors })),
    [context.setErrors],
  );

  return { value, errors, setValue, setErrors };
}
