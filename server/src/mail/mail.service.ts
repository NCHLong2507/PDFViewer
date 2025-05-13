import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(params: {
    subject: string;
    template: string;
    email: string;
    context: {name: string, verificationLink: string}
  }) {
    try {

      const sendMailParams = {
        to: params.email,
        from: '"Node Reply" long.nguyendt04@hcmut.edu.vn',
        subject: params.subject,
        template: params.template,
        context: params.context
      };
      console.log("Wait to send email successfully")
      await this.mailerService.sendMail(sendMailParams);
      console.log("Send email successfully")
    } catch (error) {
      console.log(error)
    }
  }
}