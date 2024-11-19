import handlebars from 'handlebars';
import { readFile } from 'fs/promises';
import { createTransport } from 'nodemailer';
import { appEnv } from '../env.js';

const client = createTransport({
  service: 'Gmail',
  auth: {
    user: appEnv.EMAIL_ADDRESS,
    pass: appEnv.EMAIL_API_KEY
  }
});

/**
 * @typedef {Object} ResetPasswordEmailProps
 * @property {string} name
 * @property {string} email
 * @property {string} token
 */

/**
 * @param {ResetPasswordEmailProps} props
 * @returns {Promise<void>}
 */
export async function sendResetPasswordEmail({ name, email, token }) {
  const forgotPasswordRaw = await readFile(
    './src/utils/emails/build/password-reset.html',
    'utf8'
  );

  /**
   * @typedef {Object} ResetPasswordContext
   * @property {string} name
   * @property {string} url
   */

  /** @type {HandlebarsTemplateDelegate<ResetPasswordContext>} */
  const forgotPasswordTemplate = handlebars.compile(forgotPasswordRaw);

  const htmlToSend = forgotPasswordTemplate({
    name: name,
    url: `https://${appEnv.FRONTEND_URL}/password-reset/${token}`
  });

  await client.sendMail({
    from: appEnv.EMAIL_ADDRESS,
    to: email,
    subject: 'Reset password',
    html: htmlToSend
  });
}
