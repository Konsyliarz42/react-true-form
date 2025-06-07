import type { JSONSchemaType } from "ajv";
import React from "react";
import Form from "../components/Form.tsx";
import useFormField from "../hooks/useFormField.ts";
import TextField from "./fields/TextField/index.tsx";

interface TestForm {
  text: string;
}

export default function App(): React.ReactNode {
  const defaultFields: TestForm = {
    text: "",
  };

  const schema: JSONSchemaType<TestForm> = {
    type: "object",
    properties: {
      text: { type: "string", const: "dupa" },
    },
    required: [],
  };

  const onSubmit = React.useCallback((_data: TestForm) => {}, []);

  return (
    <>
      <h1>Example form</h1>
      <Form default={defaultFields} validationSchema={schema} onSubmit={onSubmit} liveValidation>
        <FormFields />
        <br />
        <button type="submit">Submit</button>
        <button type="reset">Reset</button>
      </Form>
    </>
  );
}

function FormFields(): React.ReactNode {
  const textField = useFormField<TestForm, "text">("text");

  return (
    <>
      <TextField
        description="Simplest input."
        value={textField.value}
        errors={textField.errors}
        label="Text"
        placeholder="Example text"
        onChange={textField.setValue}
      />
    </>
  );
}
