import React from "react";
import "./index.css";
import type { BaseFieldProps } from "../../types";
import Description from "../Description";
import ErrorList from "../ErrorList";
import Label from "../Label";

export type TextFieldProps = BaseFieldProps<string, HTMLInputElement> & {
  placeholder?: string;
  styles?: {
    container?: React.CSSProperties;
    description?: React.CSSProperties;
    errorItem?: React.CSSProperties;
    errorList?: React.CSSProperties;
    input?: React.CSSProperties;
    label?: React.CSSProperties;
  };
};
export default function TextField(props: TextFieldProps): React.ReactNode {
  const [value, setValue] = React.useState<string>("");

  const id = React.useMemo(() => props.id || crypto.randomUUID(), [props.id]);

  const className = React.useMemo(() => {
    const classes = ["field"];
    if (props.disabled) classes.push("disabled");
    if (props.errors && props.errors.length > 0) classes.push("error");
    if (props.required) classes.push("required");

    classes.push(...(props.classes || []));

    return classes.join(" ");
  }, [props.classes, props.errors, props.required, props.disabled]);

  const onChangeValue = React.useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.currentTarget.value;
    setValue(newValue);

    if (props.onChange) await props.onChange(newValue);
  }, []);

  // Sync value with props
  React.useEffect(() => setValue(props.value || ""), [props.value]);

  return (
    <div className={className} style={props.styles?.container}>
      <Label label={props.label} id={id} style={props.styles?.label} />
      <input
        className="field-input"
        disabled={props.disabled}
        id={id}
        name={props.name}
        onChange={onChangeValue}
        placeholder={props.placeholder}
        ref={props.ref}
        required={props.required}
        style={props.styles?.input}
        value={value}
      />
      <Description description={props.description} style={props.styles?.description} />
      <ErrorList
        errors={props.errors}
        styles={{ errorItem: props.styles?.errorItem, errorList: props.styles?.errorList }}
      />
    </div>
  );
}
