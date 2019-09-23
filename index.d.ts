import * as React from 'react'
import Form, {FormProps} from 'react-jsonschema-form'
import {FormRule} from './src/RuledJsonSchemaForm'
import * as Utils from './src/Utils'

export default class RuledJsonSchemaForm<T> extends React.Component<FormProps<T>> {}
export {
	FormRule, Utils
}
