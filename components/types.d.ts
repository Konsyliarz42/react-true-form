import type React from "react";

export type AnyObject<T = any> = { [key: string]: T };
export type ReactStateSetter<T> = React.Dispatch<React.SetStateAction<T>>;
export type FormErrors<T> = { [Key in keyof T]?: string[] };
