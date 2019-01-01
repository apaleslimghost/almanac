if (process.env.NODE_ENV !== 'production') {
	Object.assign(process.env, require('../.env.json'))
}
