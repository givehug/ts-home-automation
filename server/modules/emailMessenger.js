const nodemailer = require('nodemailer');
const config = require('../../config');

const smtpConfig = {
	service: 'gmail',
	auth: {
		user: config.SMTP_USER,
		pass: config.SMTP_KEY,
	},
};

const mailOptions = {
	from: config.SMTP_USER,
	to: 'empty@email.com',
	subject: 'Home Automation Notification',
	text: 'Message text not specified',
	// html: '<p>some html<p>
};

const transporter = nodemailer.createTransport(smtpConfig);

const sendEmail = ({to, subject, text}) => {
	transporter.sendMail(
		{
			from: mailOptions.from,
			to: to || mailOptions.to,
			subject: subject || mailOptions.subject,
			html: text || mailOptions.text,
		},
		(error) => {
			if (error) {
				console.error('Nodemailer error:', error);
			}
			// transporter.close();
		}
	);
};

module.exports = {sendEmail};
