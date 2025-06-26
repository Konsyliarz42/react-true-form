[![Checked with Biome](https://img.shields.io/badge/Checked_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev)
[![Build with TypeScript](https://img.shields.io/badge/Build%20with%20-%20TypeScript%20-%20%233178c6?logo=typescript)
](https://www.typescriptlang.org/)

# React True Form

Form component to manage and validate data based on [Ajv JSON schema validator](https://ajv.js.org/).

## Usage

1. Define interface of your form fields

   ```ts
   interface TestForm {
     field1: string;
     field2: number;
     field3: boolean;
   }
   ```

2. Define default values

   ```ts
   const DEFAULT_FORM_FIELDS: TestForm = {
     field1: "",
     field2: 0,
     field3: false,
   };
   ```

3. _[OPTIONAL]_ Define validation schema

   ```ts
   import type { JSONSchemaType } from "ajv";

   //...

   const VALIDATION_SCHEMA: JSONSchemaType<TestForm> = {
     type: "object",
     properties: {
       field1: { type: "string" },
       field2: { type: "number" },
       field3: { type: "boolean" },
     },
     required: [],
   };
   ```

4. Prepare form fields as separate component

   ```tsx
   import { TextField, NumberField, CheckBox } from "my/custom/components";

   //...

   function FormFields(): React.ReactNode {
     const textField = useFormField<TestForm, "field1">("field1");
     const numberField = useFormField<TestForm, "field2">("field2");
     const checkBox = useFormField<TestForm, "field3">("field3");

     return (
       <>
         <TextField
           label="Text field"
           value={textField.value}
           onChange={textField.setValue}
           errors={textField.errors}
         />
         <NumberField
           label="Number field"
           value={numberField.value}
           onChange={numberField.setValue}
           errors={numberField.errors}
         />
         <CheckBox
           label="Boolean field"
           value={checkBox.value}
           onChange={checkBox.setValue}
           errors={checkBox.errors}
         />
       </>
     );
   }
   ```

5. Add Form component to your code

   ```tsx
   import { Form } from "react-true-form";

   //...

   <Form
     defaultValue={DEFAULT_FORM_FIELDS}
     validationSchema={VALIDATION_SCHEMA}
   >
     <FormFields />
     <br />
     <button type="submit">Submit</button>
     <button type="reset">Reset</button>
   </Form>;
   ```

## Form props

Check [FormProps type](src\components\Form.tsx) for full list of props.
