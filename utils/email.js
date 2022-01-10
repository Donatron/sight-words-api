const nodemailer = require('nodemailer');
const mailjet = require('node-mailjet')
const pug = require('pug');
const htmlToText = require('html-to-text');

mailjet.connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);

module.exports = class Email {
  constructor(user, url,) {
    this.to = user.email;
    this.name = user.name;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Sight Words <${process.env.EMAIL_FROM}>`
  }

  newTransport() {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  mailJetConnection() {
    return mailjet.connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);
  }

  async send(template, subject) {
    const html = pug.renderFile(`${__dirname}/../views/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject
    });

    if (process.env.NODE_ENV === 'production') {
      return await this.mailJetConnection()
        .post("send", { 'version': 'v3.1' })
        .request({
          "Messages": [
            {
              "From": {
                "Email": `${process.env.EMAIL_FROM}`,
                "Name": "Sight Words"
              },
              "To": [
                {
                  "Email": `${this.to}`,
                  "Name": `${this.name}`
                }
              ],
              "Subject": subject,
              "TextPart": htmlToText.fromString(html),
              "HTMLPart": html
            }
          ]
        });
    }

    // Development emails only
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html)
    }

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome To Sight Words');
  }

  async sendConfirmEmail() {
    await this.send('confirmEmail', 'Sight Words - Please Confirm Your Email');
  }

  async sendForgotPassword() {
    await this.send('forgotPassword', 'Sight Words - Password Reset (expires in 10 minutes');
  }
}
