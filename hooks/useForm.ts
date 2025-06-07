import React from "react";
import { FormContext, type FormContextType } from "../components/Form.tsx";

/**
 * Returns `FormContext` only if it has been created. \
 * Otherwise, it will throw an error.
 */
export default function useForm<T>(): FormContextType<T> {
  const context = React.useContext(FormContext);
  if (!context) throw new Error("You can use this hook only when `FormContext` is created");

  return context;
}
