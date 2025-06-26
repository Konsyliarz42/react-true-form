import type { JSONSchemaType } from "ajv";
import React from "react";
import { Form, type ReactStateSetter, useForm, useFormField } from "../src";
import TextField from "./fields/TextField/index";

interface TestForm {
  textValue: string;
  constValue: string;
}

const DEFAULT_FORM_FIELDS: TestForm = {
  textValue: "",
  constValue: "",
};

const VALIDATION_SCHEMA: JSONSchemaType<TestForm> = {
  type: "object",
  properties: {
    textValue: { type: "string" },
    constValue: { type: "string", const: "testText" },
  },
  required: [],
};

export default function App(): React.ReactNode {
  const [liveValidation, setLiveValidation] = React.useState<boolean>(false);
  const [submittedValue, setSubmittedValue] = React.useState<any>({});

  return (
    <>
      <h1>True React Form</h1>
      <br />
      <h2>Example Form</h2>
      <Form
        defaultValue={DEFAULT_FORM_FIELDS}
        validationSchema={VALIDATION_SCHEMA}
        onSubmit={setSubmittedValue}
        liveValidation={liveValidation}
      >
        <FormFields />
        <br />
        <div style={{ display: "flex", gap: 8 }}>
          <FormOptions liveValidation={liveValidation} setLiveValidation={setLiveValidation} />
          <button type="submit">Submit</button>
          <button type="reset">Reset</button>
        </div>

        <FormState />
      </Form>
      <h2>Last Submitted Value</h2>
      <p style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(submittedValue, undefined, 2)}</p>
    </>
  );
}

interface FormOptionsProps {
  liveValidation: boolean;
  setLiveValidation: ReactStateSetter<boolean>;
}
function FormOptions(props: FormOptionsProps): React.ReactNode {
  return (
    <>
      <label>
        Live validation
        <input
          type="checkbox"
          checked={props.liveValidation}
          onClick={() => props.setLiveValidation((current) => !current)}
        />
      </label>
    </>
  );
}

function FormFields(): React.ReactNode {
  const textField = useFormField<TestForm, "textValue">("textValue");
  const constField = useFormField<TestForm, "constValue">("constValue");

  return (
    <>
      <TextField
        label="Text field 1"
        value={textField.value}
        onChange={textField.setValue}
        placeholder="Example text"
        description="Simplest input."
        errors={textField.errors}
      />
      <TextField
        label="Text field 2"
        value={constField.value}
        onChange={constField.setValue}
        placeholder="Example text"
        description={`Valid value is only '${VALIDATION_SCHEMA.properties.constValue.const}'`}
        errors={constField.errors}
      />
    </>
  );
}

function FormState(): React.ReactNode {
  const form = useForm<TestForm>();
  return <p style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(form, undefined, 2)}</p>;
}
