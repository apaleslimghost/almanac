import React from 'react';
import _ from 'lodash';
import schema from '../../../shared/imports/schema';
import {Select} from '../visual/form';

export default props => <Select value='' {...props}>
	<option value='' disabled>{props.placeholder}</option>
	{_.map(
		schema,
		(type, id) => <option key={id} value={id}>{type.name}</option>
	)}
</Select>;
