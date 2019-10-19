// v1.05
import React from "react"
import Form from "react-jsonschema-form"
import ArrayField from "react-jsonschema-form/lib/components/fields/ArrayField"
import ObjectField from "react-jsonschema-form/lib/components/fields/ObjectField"
import * as Utils from "./Utils"

class FormRule {
	desc: string = ""
	context: string = ""
	if: string = ""
	then: string = ""
	else: string = ""
	active: boolean = true
}

const cloneProps = (exp:string, pattern: RegExp, obj:any) => {
	if (exp.match(pattern) && Utils.isCloneable(obj)) {
		for (let key in obj) {
			obj[key] = Utils.clone(obj[key])
		}
	}
}

class FormRuleEngine {

	evaluate = (exp: string, ctx: any) => {

		// Destructing context to be easily accessible for the expression in its scope
		const {
			formContext,   // "global" Form property, can hold anything
			idSchema,      // id schema of the actually processed node
			schema,        // schema of the actually processed node
			uiSchema,      // ui schema of the actually processed node
			data,          // data of the actually processed node
			arrayUiSchema  // in case of the processed item is an array element, we offer here the array's uiSchema
		} = ctx

		// cloning props of context members, this way change detection will be possible
		cloneProps(exp, /\bschema\b/, schema)
		cloneProps(exp, /\buiSchema\b/, uiSchema)
		cloneProps(exp, /\barrayUiSchema\b/, arrayUiSchema)
		cloneProps(exp, /\bdata\b/, data)

		try {
			// Some think eval() is evil,
			// i think eval() is the strongest solution for some problems, like a rule engine: 
			// why implement an own expression evaluator for a crippled own "language" when you instantly have the power of the full js, in one method.
			// For security creeps: it runs in the browser - anything executed here can also be executed by opening a console by (usually) F12.
			return eval(exp)
		} catch (e) {
			console.error("Error evaluating expression: " + exp)
			throw e
		}
	}

	process(ctx: any) {
		let rules: FormRule[]
		const uiSchema = ctx.uiSchema

		if (uiSchema && uiSchema["ui:options"] && (rules = uiSchema["ui:options"].formRules)) {
			rules.forEach((rule: FormRule) => {
				if (rule.active && (!rule.context || this.evaluate(rule.context, ctx))) {
					if (rule.if && rule.then) {
						if (this.evaluate(rule.if, ctx)) {
							this.evaluate(rule.then, ctx)
						} else if (rule.else) {
							this.evaluate(rule.else, ctx)
						}
					}
				}
			})
		}
	}
}

const formRuleEngine = new FormRuleEngine()

/**
 * Overriding default ArrayField to hook the execution of rules
 * 
 * Very important to clone the uiSchema before it passed to array items,
 * otherwise every array item will share the same references to its uiSchema.
 * 
 * Arrays may have rules in two places: in its root uiSchema["ui:options"] and its items.uiSchema["ui:options"]
 */
class MyArrayField extends ArrayField {

	renderArrayFieldItem(props: any) {

		// This cloning is essential for array items to have their own state, eg. to make disabling SOME of them possible 
		props.itemUiSchema = Utils.clone(props.itemUiSchema)

		formRuleEngine.process({
			schema: props.itemSchema,
			uiSchema: props.itemUiSchema, // that contains the rules to be processed
			arrayUiSchema: this["props"].uiSchema,
			idSchema: props.itemIdSchema,
			data: props.itemData,
			formContext: this["props"].formContext
		})

		return super.renderArrayFieldItem(props)
	}

	/**
	 * Overriding render() in order to process rules
	 */
	render() {
		const props = this["props"]

		formRuleEngine.process({
			schema: props.schema,
			uiSchema: props.uiSchema, // that contains the rules to be processed
			idSchema: props.idSchema,
			data: props.formData,
			formContext: props.formContext
		})

		return super.render()
	}

}

class MyObjectField extends ObjectField {

	/**
	 * Overriding render() in order to process rules
	 */
	render() {
		const props = this["props"]

		formRuleEngine.process({
			schema: props.schema,
			uiSchema: props.uiSchema,
			idSchema: props.idSchema,
			data: props.formData,
			formContext: props.formContext
		})

		return super.render()
	}
}

function RuledJsonSchemaForm(props: any) {

	const fields: any = (props && props.fields) || {}
	fields.ArrayField = MyArrayField
	fields.ObjectField = MyObjectField

	return (
		<Form {...props} fields={fields}></Form>
	)
}

export default RuledJsonSchemaForm
export {
	FormRule
}