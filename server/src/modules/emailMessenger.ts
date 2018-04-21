import * as nodemailer from 'nodemailer';
import config from '../../../config';

const smtpConfig = {
  auth: {
    pass: config.SMTP_KEY,
    user: config.SMTP_USER,
  },
  service: 'gmail',
};

const mailOptions = {
  from: config.SMTP_USER,
  subject: 'Home Automation Notification',
  text: 'Message text not specified',
  to: 'empty@email.com',
  // html: '<p>some html<p>
};

const transporter = nodemailer.createTransport(smtpConfig);

export const sendEmail = ({to, subject, text}) => {
  transporter.sendMail(
    {
      from: mailOptions.from,
      html: text || mailOptions.text,
      subject: subject || mailOptions.subject,
      to: to || mailOptions.to,
    },
    (error) => {
      if (error) {
        console.error('Nodemailer error:', error);
      }
      // transporter.close();
    },
  );
};
