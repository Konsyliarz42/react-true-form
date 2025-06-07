import type React from "react";
import type { BaseFieldProps } from "../types.d.ts";

export type DescriptionProps = {
  description?: BaseFieldProps["description"];
  style?: React.CSSProperties;
};
export default function Description(props: DescriptionProps): React.ReactNode {
  if (!props.description) return <></>;

  return (
    <div className="field-description" style={props.style}>
      {props.description}
    </div>
  );
}
