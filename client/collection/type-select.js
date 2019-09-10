import React from 'react'
import _ from 'lodash'
import schema from '../../shared/schema'
import { BonelessSelect } from '../visual/form'

export default props => (
	<BonelessSelect value='' {...props}>
		<option value=''>{props.placeholder}</option>
		<option disabled>─────</option>
		{_.map(schema, (type, id) => (
			<option key={id} value={id}>
				{type.name}
			</option>
		))}
	</BonelessSelect>
)
