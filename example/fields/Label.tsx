import type React from "react";
import type { BaseFieldProps } from "../types.d.ts";

export type LabelProps = {
  id: string;

  label?: BaseFieldProps["label"];
  style?: React.CSSProperties;
};
export default function Label(props: LabelProps): React.ReactNode {
  if (!props.label) return <></>;

  return (
    <label className="field-label" htmlFor={props.id} style={props.style}>
      {props.label}
    </label>
  );
}
