import Ajv, { type ErrorObject, type JSONSchemaType } from "ajv";
import React from "react";
import { useFirstUpdate } from "../hooks/useFirstUpdate";
import type { AnyObject, FormErrors, ReactStateSetter } from "./types";

const ajv = new Ajv();

export type FormContextType<T> = {
  errors: FormErrors<T>;
  setErrors: ReactStateSetter<FormErrors<T>>;
  setValue: ReactStateSetter<T>;
  submitted: boolean;
  value: T;
};
export const FormContext = React.createContext<FormContextType<any> | undefined>(undefined);

export type FormProps<T extends AnyObject> = {
  /** Form fields. */
  children: React.ReactNode | React.ReactNode[];
  /** Default values of form fields. */
  defaultValue: T;

  /** Modify errors after validation. */
  afterValidation?: (errors: FormErrors<T>) => FormErrors<T> | Promise<FormErrors<T>>;
  /** {@link https://ajv.js.org/ | Ajv} instance used to validation. */
  ajvInstance?: Ajv;
  /** Modify data before validation. */
  beforeValidation?: (data: T) => T | Promise<T>;
  /** CSS classes for component. */
  className?: string;
  /** Clear the form after `onSubmit`. */
  clearAfterSubmit?: boolean;
  /** HTML id */
  id?: string;
  /** Validate the form after each change to a form field. */
  liveValidation?: boolean;
  /** This function is called after reset the form. */
  onReset?: () => void | Promise<void>;
  /** This function is called after successful validation. */
  onSubmit?: (data: T) => void | Promise<void>;
  /** CSS style. */
  style?: React.CSSProperties;
  /** JSONSchema used to validate the form. \
   * If `validationSchema` is `undefined`, form validation is disabled.
   */
  validationSchema?: JSONSchemaType<T>;
};
/**
 * True React Form.
 */
export function Form<T extends AnyObject>(props: FormProps<T>): React.ReactNode {
  const [value, setValue] = React.useState<T>(props.defaultValue || ({} as T));
  const [errors, setErrors] = React.useState<FormErrors<T>>({});
  const [submitted, setSubmitted] = React.useState<boolean>(false);

  const firstUpdate = useFirstUpdate();

  const validate = React.useMemo(
    () => (props.ajvInstance || ajv).compile(props.validationSchema || { type: "object" }),
    [props.validationSchema, props.ajvInstance],
  );

  const onValidate = async (data: T) => {
    let _data = data;
    let newErrors: any = {};

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
    if (props.clearAfterSubmit) setValue(props.defaultValue || ({} as T));
  };

  const onReset = async (event: React.FormEvent) => {
    event.preventDefault();

    setErrors({});
    setValue(props.defaultValue);

    if (props.onReset) await props.onReset();
  };

  // onChange
  React.useEffect(() => {
    if (firstUpdate) return;

    if (props.liveValidation) onValidate(value);
  }, [props.liveValidation, value]);

  return (
    <FormContext.Provider value={{ value, setValue, errors, setErrors, submitted }}>
      <form
        className={props.className}
        id={props.id}
        onReset={onReset}
        onSubmit={(e) => onSubmit(e).finally(() => setSubmitted(false))}
        style={props.style}
      >
        {props.children}
      </form>
    </FormContext.Provider>
  );
}
