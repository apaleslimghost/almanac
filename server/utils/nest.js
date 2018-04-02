const nest = fn => (obj, path = []) => Object.keys(obj).forEach(key => {
	const nextPath = path.concat(key);
	if(typeof obj[key] === 'function') {
		fn(nextPath.join('.'), function(...args) {
			return obj[key](Object.assign({}, this, {args}));
		});
	} else {
		nest(obj[key], nextPath);
	}
});

export default nest;
