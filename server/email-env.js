import url from 'url'
import { HTTP } from 'meteor/http'

const missingVars = (...vars) => vars.filter(key => !process.env[key])

const missingMailgunVars = missingVars(
	'MAILGUN_SMTP_SERVER',
	'MAILGUN_SMTP_PORT',
	'MAILGUN_SMTP_LOGIN',
	'MAILGUN_SMTP_PASSWORD',
)

const missingMailtrapVars = missingVars('MAILTRAP_API_TOKEN')

if (missingMailgunVars.length === 0) {
	process.env.MAIL_URL = url.format({
		protocol: 'smtp',
		slashes: true,
		hostname: process.env.MAILGUN_SMTP_SERVER,
		port: process.env.MAILGUN_SMTP_PORT,
		auth: `${process.env.MAILGUN_SMTP_LOGIN}:${process.env.MAILGUN_SMTP_PASSWORD}`,
	})

	console.log(`mailgunning via ${process.env.MAIL_URL}`) // eslint-disable-line no-console
} else if (missingMailtrapVars.length === 0) {
	const mailtrapUrl = url.format({
		protocol: 'https',
		hostname: 'mailtrap.io',
		pathname: '/api/v1/inboxes.json',
		query: { api_token: process.env.MAILTRAP_API_TOKEN },
	})

	const {
		data: [inbox],
	} = HTTP.get(mailtrapUrl)

	process.env.MAIL_URL = url.format({
		protocol: 'smtp',
		slashes: true,
		hostname: inbox.domain,
		port: inbox.smtp_ports[0],
		auth: `${inbox.username}:${inbox.password}`,
	})
} else {
	// eslint-disable-next-line no-console
	console.log(
		`email environment variables ${missingMailgunVars.concat(
			missingMailtrapVars,
		)} missing, falling back to outputting emails to stdout`,
	)
}
