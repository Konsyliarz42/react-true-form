import type React from "react";
import type { BaseFieldProps } from "../types";

export type ErrorListProps = {
  errors?: BaseFieldProps["errors"];
  styles?: { errorList?: React.CSSProperties; errorItem?: React.CSSProperties };
};
export default function ErrorList(props: ErrorListProps): React.ReactNode {
  if (!props.errors || props.errors.length === 0) return <></>;

  return (
    <ul className="field-errors" style={props.styles?.errorList}>
      {props.errors.map((error) => (
        <li className="field-errors-item" key={error} style={props.styles?.errorItem}>
          {error}
        </li>
      ))}
    </ul>
  );
}
