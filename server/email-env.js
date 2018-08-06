import url from 'url';

const mailgunConfigured = [
	'MAILGUN_SMTP_SERVER',
	'MAILGUN_SMTP_PORT',
	'MAILGUN_SMTP_LOGIN',
	'MAILGUN_SMTP_PASSWORD',
].every(
	key => !!process.env[key]
);

if(mailgunConfigured) {
	process.env.MAIL_URL = url.format({
		protocol: 'smtp',
		hostname: process.env.MAILGUN_SMTP_SERVER,
		port: process.env.MAILGUN_SMTP_PORT,
		auth: `${process.env.MAILGUN_SMTP_LOGIN}:${process.env.MAILGUN_SMTP_PASSWORD}`,
	});
} else {
	console.log('no mailgun environment variables, falling back to outputting emails to stdout');
}
