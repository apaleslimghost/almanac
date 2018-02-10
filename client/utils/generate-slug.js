import shortId from '@quarterto/short-id';
import paramCase from 'param-case';

export default data => Object.assign(data, {
	_id: `${paramCase(data.title)}-${shortId()}`,
});
