# ruled-jsonschema-form
Simple, flexible rule engine for the amazing [react-jsonschema-form](https://github.com/rjsf-team/react-jsonschema-form)

If you are familiar with [react-jsonschema-form](https://github.com/rjsf-team/react-jsonschema-form) and interested in adding some dynamism to the forms, for example, hiding/disabling parts of the form, adding extra options to select, radio buttons, changing data and many more, it's worth a try.

Example:

```typescript
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
}

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

```

![](https://nlacsoft.net/public/ruledjsonform/other.gif)
