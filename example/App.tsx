import type { JSONSchemaType } from "ajv";
import React from "react";
import TextField from "./fields/TextField/index";
import { Form, useFormField } from "../src";

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
      text: { type: "string", const: "testText" },
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
        label="Text"
        value={textField.value}
        onChange={textField.setValue}
        placeholder="Example text"
        description="Simplest input."
        errors={textField.errors}
      />
    </>
  );
}
