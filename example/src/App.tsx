import React, { useState } from 'react'
import { JSONSchema6 } from "json-schema"
import RuledJsonSchemaForm, { FormRule } from 'ruled-jsonschema-form'

// Schema
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
		},
		age: {
			type: "number",
			title: "Age"
		},
		job: {
			type: "string",
			title: "Job"
		},
		hobbies: {
			type: "array",
			title: "",
			items: {
				type: "string"
			}
		}
	}
} as JSONSchema6

// UI Schema
const uiSchema = {
	name: {
		"ui:placeholder": "hint: type 'other' to see other options"
	},
	age: {
		"ui:placeholder": "hint: type at least 18 to show two further fields"
	},
	gender: {
		"ui:widget": "radio",
		"ui:options": {
			inline: true
		}
	},
	job: {
		"ui:widget": "hidden"
	},
	hobbies: {
		"ui:widget": "hidden",
		"ui:title": false,
		"ui:description": "Hobbies",
		"ui:help": "hint: add more than 3 hobbies",
		"ui:options": {
			formRules: [
				{
					desc: "some final actions when 'football' has been typed",
					if: "data && data.some(d => d === 'football')",
					then: "uiSchema['ui:options'].removable = false; uiSchema['ui:description'] = 'Football is amazing! Keep it.'",
					active: true
				} as FormRule
			]
		},
		items: {
			"ui:options": {
				formRules: [
					{
						desc: "disabling input field as 'football' has been written",
						if: "data === 'football'",
						then: "uiSchema['ui:disabled'] = true",
						active: true
					} as FormRule
				]
			}
		}
	},
	"ui:options": {
		formRules: [
			{
				desc: "showing the job and hobbies fields if age >= 18, else resets their data",
				if: "data.age && data.age >= 18",
				then: "delete uiSchema.job['ui:widget']; delete uiSchema.hobbies['ui:widget'];",
				else: "delete data.job; data.hobbies = ['']",
				active: true
			} as FormRule,
			{
				desc: "reseting + disabling job field if number of hobbies > 3",
				if: "data.hobbies && (data.hobbies.length > 3)",
				then: "delete data.job; uiSchema.hobbies['ui:description'] = 'You have a lot of time for hobbies! No way you do have a job:)'; uiSchema.job['ui:disabled'] = true; uiSchema.hobbies['ui:help'] = 'hint: add football'",
				active: true
			} as FormRule,
			{
				desc: "adding 'other' enum option when user name is 'other'",
				if: "data.name && (data.name.toLowerCase() == 'other')",
				then: "schema.properties.gender.enum = ['male', 'female', 'other']",
				else: "schema.properties.gender.enum = ['male', 'female']",
				active: true
			} as FormRule
		]
	}
}

const App: React.FC = () => {

	const [formData, setFormData] = useState({
		name: "",
		hobbies: [""]
	})

	const onChange = (params: any) => {
		setFormData(params.formData)
	}

	return (
		<div className="container">
			<div className="row">
				<div className="col-md-7">
					<RuledJsonSchemaForm
						schema={schema}
						uiSchema={uiSchema}
						onChange={onChange}
						formData={formData}
						autocomplete="off"
					></RuledJsonSchemaForm>
				</div>
				<div className="col-md-5">
					<label>Form data:</label>
					<pre>{JSON.stringify(formData, null, "  ")}</pre>
				</div>
			</div>
			<hr/>
			<div className="row">
				<div className="col-md-12 text-right">
					<a href="https://github.com/nlac/ruled-jsonschema-form" target="_blank" rel="noopener noreferrer">github page</a>
				</div>
			</div>
		</div>
	)
}

export default App
