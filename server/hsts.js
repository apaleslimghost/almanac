import { WebApp } from 'meteor/webapp'

const THIRTY_DAYS = 30 * 24 * 60 * 60

if (process.env.NODE_ENV === 'production') {
	WebApp.connectHandlers.use((req, res, next) => {
		res.setHeader(
			'Strict-Transport-Security',
			`max-age=${THIRTY_DAYS}; includeSubDomains`,
		)

		next()
	})
}
