import type React from "react";

export type AnyObject = { [key: string]: any };
export type FormErrors<T> = { [Key in keyof T]?: string[] };
export type ReactStateSetter<T> = React.Dispatch<React.SetStateAction<T>>;
