import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { isProduction } from 'src/utility/env.util';
import hbs from 'nodemailer-express-handlebars';
import { join } from 'path';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter: nodemailer.Transporter;
  emailFrom: string;

  constructor(private readonly configService: ConfigService) {
    this.emailFrom = this.configService.get('EMAIL_FROM') as string;

    this.transporter = nodemailer.createTransport({
      host: this.configService.get('EMAIL_HOST'),
      port: Number(this.configService.get('EMAIL_PORT')),
      secure: isProduction(),
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASS'),
      },
    });

    const templatePath = join(process.cwd(), 'src', 'email', 'templates');
    this.transporter.use(
      'compile',
      hbs({
        viewEngine: {
          extname: '.hbs',
          layoutsDir: join(templatePath, 'layouts'),
          defaultLayout: 'main',
          partialsDir: join(templatePath, 'partials'),
        },
        viewPath: templatePath,
        extName: '.hbs',
      }),
    );
  }

  async sendResetEmail(email: string, name: string, link: string) {
    try {
      const subject = 'Reset your password';
      await this.transporter.sendMail({
        to: email,
        from: this.emailFrom,
        subject: subject,
        template: 'reset-password',
        context: {
          subject: subject,
          name: name,
          link: link,
          year: new Date().getFullYear(),
        },
      });
      this.logger.log(`✅ Reset password email sent to user ${email}`);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
