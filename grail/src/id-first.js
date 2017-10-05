export default (arr, id) => arr.reduce(
	(out, x) => x._id === id
		? [x].concat(out)
		: out.concat(x),
	[]
);
