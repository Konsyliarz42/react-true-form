import type React from "react";

export type ReactStateSetter<T> = React.Dispatch<React.SetStateAction<T>>;
export type FormErrors<T> = { [Key in keyof T]?: string[] };
