import Ajv, { type ErrorObject, type JSONSchemaType } from "ajv";
import React from "react";
import type { FormErrors, ReactStateSetter } from "./types.ts";
import useFirstUpdate from "../hooks/useFirstUpdate.ts";

const ajv = new Ajv();

export type FormContextType<T> = {
  errors: FormErrors<T>;
  setErrors: ReactStateSetter<FormErrors<T>>;
  setValue: ReactStateSetter<T>;
  submitted: boolean;
  value: T;
};
export const FormContext = React.createContext<FormContextType<any> | undefined>(undefined);

export type FormProps<T> = {
  /** Form fields. */
  children: React.ReactNode | React.ReactNode[];
  /** Default values of form fields. */
  default: T;

  /** Modify errors after validation. */
  afterValidation?: (errors: FormErrors<T>) => FormErrors<T> | Promise<FormErrors<T>>;
  /** {@link https://ajv.js.org/ | Ajv} instance used to validation. */
  ajvInstance?: Ajv;
  /** Modify data before validation. */
  beforeValidation?: (data: T) => T | Promise<T>;
  /** Clear the form after `onSubmit`. */
  clearAfterSubmit?: boolean;
  /** Validate the form after each change to a form field. */
  liveValidation?: boolean;
  /** This function is called after reset the form. */
  onReset?: () => void | Promise<void>;
  /** This function is called after successful validation. */
  onSubmit?: (data: T) => void | Promise<void>;
  /** JSONSchema used to validate the form. \
   * If `validationSchema` is `undefined`, form validation is disabled.
   */
  validationSchema?: JSONSchemaType<T>;
};
/**
 * True React Form.
 */
export default function Form<T>(props: FormProps<T>): React.ReactNode {
  const [value, setValue] = React.useState<T>(props.default || ({} as T));
  const [errors, setErrors] = React.useState<FormErrors<T>>({});
  const [submitted, setSubmitted] = React.useState<boolean>(false);

  const firstUpdate = useFirstUpdate();

  const validate = React.useMemo(
    () => (props.ajvInstance || ajv).compile(props.validationSchema || { type: "object" }),
    [props.validationSchema, props.ajvInstance],
  );

  const onValidate = async (data: T) => {
    let _data = data;
    let newErrors: FormErrors<T> = {};

    if (props.beforeValidation) _data = await props.beforeValidation(data);
    const isValid = validate(_data);

    if (!isValid) {
      for (const error of validate.errors as ErrorObject[]) {
        const [_, field, _rest] = error.instancePath.split("/");
        if (Object.keys(newErrors).includes(field)) newErrors[field].push(error.message);
        else newErrors[field] = [error.message];
      }
    }

    if (props.afterValidation) newErrors = await props.afterValidation(newErrors);
    setErrors(newErrors);

    return newErrors;
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const errors = await onValidate(value);
    if (Object.values(errors).length > 0) return;
    if (!props.onSubmit || submitted) return;

    setSubmitted(true);
    await props.onSubmit(value);
    if (props.clearAfterSubmit) setValue(props.default || ({} as T));
  };

  const onReset = async (event: React.FormEvent) => {
    event.preventDefault();

    setErrors({});
    setValue(props.default);

    if (props.onReset) await props.onReset();
  };

  // onChange
  React.useEffect(() => {
    if (firstUpdate) return;

    if (props.liveValidation) onValidate(value);
  }, [props.liveValidation, value]);

  return (
    <FormContext.Provider value={{ value, setValue, errors, setErrors, submitted }}>
      <form onSubmit={(e) => onSubmit(e).finally(() => setSubmitted(false))} onReset={onReset}>
        {props.children}
      </form>
    </FormContext.Provider>
  );
}
