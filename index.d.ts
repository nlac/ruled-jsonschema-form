import * as React from 'react'
import Form from "react-jsonschema-form"
import {FormRule} from './src/RuledJsonSchemaForm'
import * as Utils from './src/Utils'

export default class RuledJsonSchemaForm<T> extends Form<T> {}
export {
	FormRule, Utils
}