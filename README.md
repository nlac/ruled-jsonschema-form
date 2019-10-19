# ruled-jsonschema-form
Simple, flexible rule engine for the amazing [react-jsonschema-form](https://github.com/rjsf-team/react-jsonschema-form)

If you are familiar with [react-jsonschema-form](https://github.com/rjsf-team/react-jsonschema-form) and interested in adding some dynamism to the forms, for example, hiding/disabling parts of the form, adding extra options to select, radio buttons, changing data and many more, it's worth a try.

[npmjs package](https://www.npmjs.com/package/ruled-jsonschema-form)

[online demo](https://ruled-jsonschema-form-demo.herokuapp.com)

[ffmpegui](https://ffmpegui.herokuapp.com) - experimental project based on ruled-jsonschema-form

Example + some documentation:

```typescript
import React, { useState } from 'react'
import { JSONSchema6 } from "json-schema"
import RuledJsonSchemaForm, { FormRule } from 'ruled-jsonschema-form' 

/**
 * Defining schema
 */
const schema = {
  type: "object",
  title: "Personal details",
  properties: {
    name: {
      type: "string",
      title: "Name"
    },
    gender: {
      type: "string",
      title: "Gender",
      enum: ["male", "female"]
    }
  }
} as JSONSchema6

/**
 * Defining ui schema with form rules
 * 
 * 
 * A form rule is an object containing the following properties:
 * - desc (string, optional): short description of the rule
 * - if (string): expression must be evaluated to boolean
 * - then (string): expression, runs when the above is true
 * - else (string, optional): expression, runs otherwise
 * - active (boolean): flags the rule as active or inactive
 * 
 * 
 * The following values can be used in the scope of the expressions (if, then, else) - check the doc of react-jsonschema-form for the details
 * - formContext (object): "global" form property can hold anything
 * - schema (object): schema of the actually processed node
 * - uiSchema (object): ui schema of the actually processed node
 * - idSchema (object): id schema of the actually processed node
 * - data (object): form data of the actually processed node
 * - arrayUiSchema (object) - in case of the processed item is an array element, the array's uiSchema is offered here
 */ 
const uiSchema = {
  name: {
    "ui:placeholder": "hint: type 'other' to see other options"
  },
  age: {
  },
  "ui:options": {
    formRules: [
      {
        if: "data && data.name && (data.name.toLowerCase() == 'other')",
        then: "schema.properties.gender.enum = ['male', 'female', 'other']",
        else: "schema.properties.gender.enum = ['male', 'female']",
        active: true
      }
    ]
  }
}

/**
 * Setup the form as a usual react-jsonschema-form
 */
const App: React.FC = () => {

	const [formData, setFormData] = useState({
		name: "",
		hobbies: [""]
	})

	const onChange = (params: any) => {
		setFormData(params.formData)
	}

	return ( 
      <RuledJsonSchemaForm
        schema={schema}
        uiSchema={uiSchema}
        onChange={onChange}
        formData={formData}
        autocomplete="off"
      ></RuledJsonSchemaForm> 
  )

```

![](https://nlacsoft.net/public/ruledjsonform/other.gif)

Check the [source](https://github.com/nlac/ruled-jsonschema-form) or the [online demo](https://ruled-jsonschema-form-demo.herokuapp.com) for more details