import React from 'react'
import _ from 'lodash'
import schema from '../../shared/schema'
import {Select} from '../visual/form'

export default props => (
	<Select value='' {...props}>
		<option disabled value=''>
			{props.placeholder}
		</option>
		{_.map(schema, (type, id) => (
			<option key={id} value={id}>
				{type.name}
			</option>
		))}
	</Select>
)
