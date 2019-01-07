const match = matches => value =>
	value in matches ? matches[value] : matches.default

export default match
