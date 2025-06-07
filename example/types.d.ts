import type React from "react";

/**
 * Base props for each field.
 *
 * - `T` - Type of field value.
 * - `E` - HTML element used for handling reference.
 */
export type BaseFieldProps<T = any, E = HTMLElement> = {
  classes?: string[];
  description?: React.ReactNode;
  disabled?: boolean;
  errors?: string[];
  id?: string;
  label?: string;
  name?: string;
  onChange?: (newValue: T) => void | Promise<void>;
  required?: boolean;
  value?: T;
  ref?: React.RefObject<E | null>;
};
