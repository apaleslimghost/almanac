export default matches => props => matches[
	Object.keys(matches).find(
		match => props[match]
	) || 'default'
];
