import path from 'path';
import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import mailConfig from '../config/mail.json';

const { host, port, user, pass } = mailConfig;

var transport = nodemailer.createTransport({
  host,
  port,
  auth: {
    user,
    pass,
  },
});

transport.use(
  'compile',
  hbs({
    viewEngine: {
      defaultLayout: undefined,
      partialsDir: path.resolve('./src/app/resources/mail/'),
    },
    viewPath: path.resolve('./src/app/resources/mail/'),
    extName: '.html',
  })
);

export default transport;
