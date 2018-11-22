import url from 'url'

const missingMailgunVars = [
	'MAILGUN_SMTP_SERVER',
	'MAILGUN_SMTP_PORT',
	'MAILGUN_SMTP_LOGIN',
	'MAILGUN_SMTP_PASSWORD'
].filter(key => !process.env[key])

if (missingMailgunVars.length === 0) {
	process.env.MAIL_URL = url.format({
		protocol: 'smtp',
		slashes: true,
		hostname: process.env.MAILGUN_SMTP_SERVER,
		port: process.env.MAILGUN_SMTP_PORT,
		auth: `${process.env.MAILGUN_SMTP_LOGIN}:${
			process.env.MAILGUN_SMTP_PASSWORD
		}`
	})

	console.log(`mailgunning via ${process.env.MAIL_URL}`)
} else {
	console.log(
		`mailgun environment variables ${missingMailgunVars} missing, falling back to outputting emails to stdout`
	)
}
