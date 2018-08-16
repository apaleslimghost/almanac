import {Random} from 'meteor/random';
import paramCase from 'param-case';

export default (...data) => Object.assign(...data, {
	_id: `${paramCase(data.title)}-${Random.id(8)}`,
});
