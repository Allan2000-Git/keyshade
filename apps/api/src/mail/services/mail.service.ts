import {
  Injectable,
  InternalServerErrorException,
  Logger
} from '@nestjs/common'
import { IMailService } from './interface.service'
import { Transporter, createTransport } from 'nodemailer'

@Injectable()
export class MailService implements IMailService {
  private readonly transporter: Transporter
  private readonly log = new Logger(MailService.name)

  constructor() {
    this.transporter = createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_EMAIL_ADDRESS,
        pass: process.env.SMTP_PASSWORD
      }
    })
  }
  async workspaceInvitationMailForUsers(
    email: string,
    workspace: string,
    actionUrl: string,
    invitee: string,
    forRegisteredUser: boolean
  ): Promise<void> {
    const subject = `You have been invited to a ${workspace}`
    const intro = forRegisteredUser
      ? `Hello again! You've been invited to join a new workspace.`
      : `Hello there! We're excited to welcome you to Keyshade.`
    const body = `<!DOCTYPE html>
        <html>
        <head>
           <title>Workspace Invitation</title>
        </head>
        <body>
           <h1>Welcome to keyshade!</h1>
           <p>${intro}</p>
           <p>You have been invited to join the workspace <strong>${workspace}</strong> by <strong>${invitee}</strong>.</p>
           <p>Please click on the link below to accept the invitation.</p>
           <p><a href="${actionUrl}">Accept Invitation</a></p>
           <p>Thank you for choosing us.</p>
           <p>Best Regards,</p>
           <p>keyshade Team</p>
        </body>
        </html>`
    await this.sendEmail(email, subject, body)
  }

  async sendOtp(email: string, otp: string): Promise<void> {
    const subject = 'Your Login OTP'
    const body = `<!DOCTYPE html>
        <html>
        <head>
           <title>OTP Verification</title>
        </head>
        <body>
           <h1>Welcome to keyshade!</h1>
           <p>Hello there!</p>
           <p>We have sent you this email to verify your account.</p>
           <p>Your One Time Password (OTP) is: <strong>${otp}</strong></p>
           <p>This OTP will expire in <strong>5 minutes</strong>.</p>
           <p>Please enter this OTP in the application to verify your account.</p>
           <p>Thank you for choosing us.</p>
           <p>Best Regards,</p>
           <p>keyshade Team</p>
        </body>
        </html>
        `
    await this.sendEmail(email, subject, body)
  }
  async sendEmailChangedOtp(email: string, otp: string): Promise<void> {
    const subject = 'Your OTP for Email Change'
    const body = `<!DOCTYPE html>
        <html>
        <head>
           <title>OTP Verification</title>
        </head>
        <body>
           <h1>Are you trying to change your email?</h1>
           <p>Hello there!</p>
           <p>We have sent you this email to verify your new email.</p>
           <p>Your One Time Password (OTP) is: <strong>${otp}</strong></p>
           <p>This OTP will expire in <strong>5 minutes</strong>.</p>
           <p>Please enter this OTP in the application to verify your new email.</p>
           <p>Thank you.</p>
           <p>Best Regards,</p>
           <p>keyshade Team</p>
        </body>
        </html>
        `
    await this.sendEmail(email, subject, body)
  }
  async accountLoginEmail(email: string): Promise<void> {
    const subject = 'LogIn Invitation Accepted'
    const body = `<!DOCTYPE html>
        <html>
        <head>
           <title>LogIn Invitaion</title>
        </head>
        <body>
           <h1>Welcome to keyshade!</h1>
           <p>Hello there!</p>
           <p>Your account has been setup. Please login to your account for further process.</p>
           <p>Thank you for choosing us.</p>
           <p>Best Regards,</p>
           <p>keyshade Team</p>
        </body>
        </html>
        `
    await this.sendEmail(email, subject, body)
  }

  async adminUserCreateEmail(email: string): Promise<void> {
    const subject = 'Admin User Created!!'
    const body = `<!DOCTYPE html>
        <html>
        <head>
           <title>Admin User Was Created!</title>
        </head>
        <body>
           <h1>Welcome to keyshade!</h1>
           <p>Hello there!</p>
           <p>Your admin account has been setup. Please login to your account for further process.</p>
           <p>Your email is: <strong>${email}</strong></p>
           <p>Thank you for choosing us.</p>
           <p>Best Regards,</p>
           <p>keyshade Team</p>
        </body>
        `
    await this.sendEmail(process.env.ADMIN_EMAIL, subject, body)
  }

  async feedbackEmail(email: string, feedback: string): Promise<void> {
    const subject = 'New Feedback Received !'
    const body = `<!DOCTYPE html>
    <html>
    <head>
       <title>New Feedback Received !</title>
    </head>
    <body>
       <h1>New Feedback Received</h1>
       <p>Hello,</p>
       <p>We have received new feedback from a user:</p>
       <blockquote>${feedback}</blockquote>
       <p>Please review this feedback as soon as possible.</p>
       <p>Thank you.</p>
       <p>Best Regards,</p>
       <p>Keyshade Team</p>
    </body>
    </html>
    `
    await this.sendEmail(email, subject, body)
  }

  async userInvitation(
    email: string,
    projectName: string,
    projectUrl: string,
    invitedBy: string,
    invitedOn: string,
    invitationRole: string
  ): Promise<void> {
    const subject = `You're Invited to Join ${projectName} on Keyshade`
    const body = `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Project Invitation</title>
          <style>
              body {
                  font-family: 'Segoe UI', 'Roboto', sans-serif;
                  line-height: 1.6;
                  color: #04050a;
                  background-color: #fafafa;
                  margin: 0;
                  padding: 20px;
              }

              .email-wrapper {
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #fff;
                  border-radius: 5px;
                  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                  border-spacing: 0;
                  width: 100%;
              }

              .header {
                background-color: #04050a;
                padding: 12px 24px;
              }

              h1 {
                  color: #000;
                  margin-bottom: 20px;
                  font-size: 24px;
                  font-weight: 600;
              }

              p {
                  margin-bottom: 15px;
                  color: #666;
              }

              .p-40 {
                  padding: 20px 40px;
              }

              .project-details {
                  border: 0;
                  width: 100%;
                  background-color: #fafafa;
                  border-radius: 5px;
                  margin-bottom: 20px;
                  padding: 18px;
              }

              .project-details tr td:first-child {
                  color: #000;
                  font-weight: bold;
                  padding-right: 10px;
              }

              .project-details tr td:last-child {
                  color: #666;
              }

              .cta-button {
                  display: inline-block;
                  background-color: #04050a;
                  color: #ffffff;
                  text-decoration: none;
                  padding: 12px 24px;
                  border-radius: 5px;
                  font-weight: 600;
                  margin-top: 20px;
                  width: 100px;
                  text-align: center;
              }

              hr {
                  border: none;
                  border-top: 1px solid #eaeaea;
                  margin: 20px 0;
              }

              .footer-text {
                  font-size: 12px;
                  color: #999;
                  text-align: center;
              }
          </style>
      </head>
      <body>
          <table class="email-wrapper" cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td>
                  <div class="header">
                    <svg width="189" height="68" viewBox="0 0 189 68" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g filter="url(#filter0_d_731_4623)">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M17.2173 16.9268C16.3113 16.9268 15.5651 17.6852 15.5651 18.606V25.7192C15.5651 25.9054 15.4746 26.0783 15.3231 26.1828C15.1715 26.2872 14.9802 26.3084 14.81 26.2395L9.23379 23.8912C9.02458 23.8031 8.80623 23.7633 8.59159 23.7656C7.94787 23.7723 7.33494 24.1629 7.07482 24.8009L4.12444 32.0407C3.77779 32.8914 4.18072 33.8842 5.01841 34.2351L11.7815 37.0688C11.9366 37.1342 12.0532 37.2668 12.0999 37.4308C12.1466 37.5947 12.1171 37.7692 12.0202 37.9085L7.59287 43.6035C7.0414 44.3339 7.1786 45.398 7.89726 45.9584L14.0147 50.7296C14.7333 51.2902 15.7803 51.1497 16.3317 50.419L20.6366 44.8804C20.741 44.742 20.9016 44.6617 21.0733 44.6617C21.2448 44.6617 21.4054 44.742 21.5098 44.8804L25.8148 50.419C26.3662 51.1495 27.4129 51.2902 28.1318 50.7296L34.2491 45.9584C34.9679 45.3979 35.105 44.3341 34.5535 43.6035L30.1262 37.9085C30.0293 37.7693 30.0001 37.5947 30.0465 37.4308C30.0933 37.2668 30.2098 37.1342 30.3649 37.0688L37.128 34.2351C37.9657 33.8842 38.3687 32.8917 38.022 32.0407L35.0713 24.8009C34.8112 24.1629 34.1983 23.7723 33.5546 23.7656C33.3399 23.7633 33.1216 23.8033 32.9124 23.8912L27.3361 26.2395C27.166 26.3086 26.9747 26.2872 26.823 26.1828C26.6708 26.0783 26.5803 25.9054 26.5803 25.7192V18.606C26.5803 17.6852 25.8342 16.9268 24.9282 16.9268H17.2173Z" fill="#CAECF1"/>
                    <mask id="mask0_731_4623" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="4" y="16" width="35" height="36">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M17.2173 16.9268C16.3113 16.9268 15.5651 17.6852 15.5651 18.606V25.7192C15.5651 25.9054 15.4746 26.0783 15.3231 26.1828C15.1715 26.2872 14.9802 26.3084 14.81 26.2395L9.23379 23.8912C9.02458 23.8031 8.80623 23.7633 8.59159 23.7656C7.94787 23.7723 7.33494 24.1629 7.07482 24.8009L4.12444 32.0407C3.77779 32.8914 4.18072 33.8842 5.01841 34.2351L11.7815 37.0688C11.9366 37.1342 12.0532 37.2668 12.0999 37.4308C12.1466 37.5947 12.1171 37.7692 12.0202 37.9085L7.59287 43.6035C7.0414 44.3339 7.1786 45.398 7.89726 45.9584L14.0147 50.7296C14.7333 51.2902 15.7803 51.1497 16.3317 50.419L20.6366 44.8804C20.741 44.742 20.9016 44.6617 21.0733 44.6617C21.2448 44.6617 21.4054 44.742 21.5098 44.8804L25.8148 50.419C26.3662 51.1495 27.4129 51.2902 28.1318 50.7296L34.2491 45.9584C34.9679 45.3979 35.105 44.3341 34.5535 43.6035L30.1262 37.9085C30.0293 37.7693 30.0001 37.5947 30.0465 37.4308C30.0933 37.2668 30.2098 37.1342 30.3649 37.0688L37.128 34.2351C37.9657 33.8842 38.3687 32.8917 38.022 32.0407L35.0713 24.8009C34.8112 24.1629 34.1983 23.7723 33.5546 23.7656C33.3399 23.7633 33.1216 23.8033 32.9124 23.8912L27.3361 26.2395C27.166 26.3086 26.9747 26.2872 26.823 26.1828C26.6708 26.0783 26.5803 25.9054 26.5803 25.7192V18.606C26.5803 17.6852 25.8342 16.9268 24.9282 16.9268H17.2173Z" fill="url(#paint0_linear_731_4623)"/>
                    </mask>
                    <g mask="url(#mask0_731_4623)">
                    <path d="M15.3235 26.1829L15.8423 26.9362L15.8428 26.9358L15.3235 26.1829ZM14.8104 26.2396L14.4554 27.0826L14.4613 27.0851L14.4672 27.0874L14.8104 26.2396ZM11.7819 37.0689L12.1366 36.2259L12.1354 36.2254L11.7819 37.0689ZM12.0206 37.9086L12.7427 38.47L12.7577 38.4507L12.7716 38.4307L12.0206 37.9086ZM7.59326 43.6035L6.87118 43.0422L6.86722 43.0473L6.86332 43.0524L7.59326 43.6035ZM16.3321 50.4191L15.6099 49.8578L15.6059 49.863L15.602 49.8682L16.3321 50.4191ZM20.637 44.8805L21.3592 45.4418L21.3631 45.4366L21.3671 45.4314L20.637 44.8805ZM21.5102 44.8805L20.7801 45.4314L20.784 45.4366L20.7881 45.4418L21.5102 44.8805ZM25.8152 50.4191L26.5451 49.868L26.5413 49.8629L26.5373 49.8578L25.8152 50.4191ZM34.5539 43.6035L35.2839 43.0525L35.28 43.0473L35.276 43.0422L34.5539 43.6035ZM30.1266 37.9086L29.3761 38.4313L29.3898 38.451L29.4045 38.47L30.1266 37.9086ZM30.0469 37.4309L29.1673 37.1802L29.1669 37.1815L30.0469 37.4309ZM30.3653 37.0689L30.0118 36.2254L30.0105 36.2259L30.3653 37.0689ZM27.3365 26.2396L27.6804 27.0872L27.6859 27.0849L27.6915 27.0826L27.3365 26.2396ZM26.8234 26.1829L27.3422 25.4296L27.3409 25.4287L26.8234 26.1829ZM17.2177 16.0122C15.7926 16.0122 14.6509 17.1942 14.6509 18.6061H16.4801C16.4801 18.1764 16.8307 17.8415 17.2177 17.8415V16.0122ZM14.6509 18.6061V25.7193H16.4801V18.6061H14.6509ZM14.6509 25.7193C14.6509 25.6078 14.7057 25.4979 14.8043 25.4299L15.8428 26.9358C16.2443 26.6589 16.4801 26.2032 16.4801 25.7193H14.6509ZM14.8043 25.4299C14.9046 25.3608 15.0376 25.3449 15.1536 25.3918L14.4672 27.0874C14.9237 27.2722 15.4386 27.2142 15.8423 26.9362L14.8043 25.4299ZM15.1654 25.3967L9.58918 23.0484L8.87888 24.7341L14.4554 27.0826L15.1654 25.3967ZM9.58918 23.0484C9.25961 22.9095 8.91686 22.8475 8.58235 22.8511L8.60156 24.6802C8.69631 24.6793 8.78997 24.6966 8.87888 24.7341L9.58918 23.0484ZM8.58235 22.8511C7.58076 22.8616 6.63137 23.4671 6.22826 24.4557L7.92217 25.1463C8.03936 24.8589 8.31576 24.6832 8.60156 24.6802L8.58235 22.8511ZM6.22826 24.4557L3.27782 31.6956L4.97185 32.386L7.92217 25.1463L6.22826 24.4557ZM3.27782 31.6956C2.74647 32.9995 3.35379 34.5294 4.66544 35.0788L5.37228 33.3916C5.00856 33.2393 4.80984 32.7835 4.97185 32.386L3.27782 31.6956ZM4.66544 35.0788L11.4284 37.9125L12.1354 36.2254L5.37228 33.3916L4.66544 35.0788ZM11.4271 37.912C11.3219 37.8677 11.2486 37.7796 11.2206 37.6814L12.9799 37.1803C12.8585 36.7542 12.5521 36.4008 12.1366 36.2259L11.4271 37.912ZM11.2206 37.6814C11.1918 37.5803 11.2106 37.4714 11.2696 37.3866L12.7716 38.4307C13.0243 38.0671 13.1022 37.6093 12.9799 37.1803L11.2206 37.6814ZM11.2985 37.3472L6.87118 43.0422L8.3154 44.1649L12.7427 38.47L11.2985 37.3472ZM6.86332 43.0524C6.01338 44.1782 6.21929 45.8095 7.33521 46.6798L8.46015 45.2373C8.13881 44.9867 8.07021 44.4898 8.32326 44.1546L6.86332 43.0524ZM7.33521 46.6798L13.4526 51.451L14.5776 50.0086L8.46015 45.2373L7.33521 46.6798ZM13.4526 51.451C14.5772 52.3282 16.2055 52.1053 17.0621 50.9701L15.602 49.8682C15.3559 50.1943 14.8902 50.2523 14.5776 50.0086L13.4526 51.451ZM17.0542 50.9804L21.3592 45.4418L19.9148 44.3192L15.6099 49.8578L17.0542 50.9804ZM21.3671 45.4314C21.3001 45.5201 21.1914 45.5765 21.0737 45.5765V43.7472C20.6126 43.7472 20.1827 43.9641 19.9069 44.3296L21.3671 45.4314ZM21.0737 45.5765C20.9557 45.5765 20.847 45.52 20.7801 45.4314L22.2403 44.3296C21.9646 43.9642 21.5347 43.7472 21.0737 43.7472V45.5765ZM20.7881 45.4418L25.093 50.9804L26.5373 49.8578L22.2324 44.3192L20.7881 45.4418ZM25.0852 50.9702C25.9419 52.1049 27.5697 52.3282 28.6946 51.451L27.5697 50.0084C27.257 50.2523 26.7914 50.1943 26.5451 49.868L25.0852 50.9702ZM28.6946 51.451L34.812 46.6797L33.687 45.2373L27.5697 50.0084L28.6946 51.451ZM34.812 46.6797C35.9279 45.8094 36.1339 44.1785 35.2839 43.0525L33.8239 44.1546C34.077 44.4899 34.0085 44.9865 33.687 45.2373L34.812 46.6797ZM35.276 43.0422L30.8487 37.3472L29.4045 38.47L33.8318 44.1649L35.276 43.0422ZM30.8772 37.3859C30.9374 37.4724 30.9549 37.5812 30.9269 37.6802L29.1669 37.1815C29.046 37.6083 29.122 38.0665 29.3761 38.4313L30.8772 37.3859ZM30.9265 37.6816C30.8986 37.7796 30.8252 37.8677 30.7201 37.9119L30.0105 36.2259C29.5951 36.4008 29.2887 36.7542 29.1673 37.1802L30.9265 37.6816ZM30.7188 37.9125L37.4819 35.0788L36.7751 33.3915L30.0118 36.2254L30.7188 37.9125ZM37.4819 35.0788C38.7936 34.5294 39.4007 32.9998 38.8695 31.6957L37.1753 32.3859C37.3374 32.7837 37.1388 33.2392 36.7751 33.3915L37.4819 35.0788ZM38.8695 31.6957L35.9187 24.4558L34.2247 25.1462L37.1753 32.3859L38.8695 31.6957ZM35.9187 24.4558C35.5156 23.4672 34.5661 22.8616 33.5646 22.8511L33.5453 24.6802C33.8312 24.6832 34.1075 24.8588 34.2247 25.1462L35.9187 24.4558ZM33.5646 22.8511C33.2295 22.8475 32.8868 22.9101 32.5584 23.0481L33.2672 24.7345C33.3573 24.6966 33.4512 24.6793 33.5453 24.6802L33.5646 22.8511ZM32.5584 23.0481L26.9816 25.3967L27.6915 27.0826L33.2672 24.7345L32.5584 23.0481ZM26.9927 25.3921C27.1096 25.3446 27.2421 25.3607 27.3422 25.4296L26.3046 26.9362C26.708 27.214 27.2232 27.2726 27.6804 27.0872L26.9927 25.3921ZM27.3409 25.4287C27.44 25.4967 27.4954 25.6074 27.4954 25.7193H25.6661C25.6661 26.2036 25.9024 26.6601 26.3059 26.9371L27.3409 25.4287ZM27.4954 25.7193V18.6061H25.6661V25.7193H27.4954ZM27.4954 18.6061C27.4954 17.1942 26.3537 16.0122 24.9286 16.0122V17.8415C25.3154 17.8415 25.6661 18.1762 25.6661 18.6061H27.4954ZM24.9286 16.0122H17.2177V17.8415H24.9286V16.0122Z" fill="url(#paint1_linear_731_4623)"/>
                    </g>
                    </g>
                    <path d="M64.2444 47L58.1324 37.048L55.0604 40.408V47H50.2284V24.6H55.0604V33.944L63.5084 24.6H69.4924L61.4284 33.464L70.2924 47H64.2444ZM81.7207 41.528H86.0727C85.4327 45.016 82.3607 47.256 78.3927 47.256C72.9207 47.256 70.1047 42.968 70.1047 38.904C70.1047 34.808 72.6007 30.616 78.0727 30.616C83.7687 30.616 86.0407 34.808 86.0407 38.488C86.0407 39.096 86.0087 39.576 85.9767 39.928H74.3927C74.7127 42.2 76.1527 43.608 78.3927 43.608C80.1847 43.608 81.3687 42.904 81.7207 41.528ZM78.0727 33.88C76.0567 33.88 74.8407 34.872 74.4567 37.112H81.5927C81.4647 35.32 80.2167 33.88 78.0727 33.88ZM102.181 30.872L96.3252 46.936L94.0532 53.528H89.7972L92.1652 46.872L86.3092 30.872H90.8532L94.2452 41.272L97.6052 30.872H102.181ZM109.418 47.256C105.482 47.256 102.794 45.048 102.634 41.56H106.474C106.634 43 107.754 43.896 109.418 43.896C110.794 43.896 111.754 43.224 111.754 42.328C111.754 39.032 103.082 42.264 103.082 35.48C103.082 32.632 105.546 30.616 108.842 30.616C112.714 30.616 115.338 32.696 115.498 35.864H111.626C111.434 34.488 110.186 33.752 108.97 33.752C107.722 33.752 106.858 34.296 106.858 35.32C106.858 38.616 115.69 34.872 115.69 42.168C115.69 45.24 113.194 47.256 109.418 47.256ZM118.443 47V23.864H122.891V33.112C123.819 31.544 125.579 30.616 127.819 30.616C131.435 30.616 133.803 33.24 133.803 36.952V47H129.355V37.944C129.355 35.992 128.075 34.584 126.219 34.584C124.267 34.584 122.891 36.088 122.891 38.168V47H118.443ZM143.656 30.616C147.72 30.616 150.696 32.984 150.696 36.632V47H146.28V44.76C145.736 46.264 143.944 47.256 141.736 47.256C138.6 47.256 136.456 45.176 136.456 42.424C136.456 39.256 138.824 37.336 142.344 37.336H145.064C145.864 37.336 146.28 36.824 146.28 36.152C146.28 34.808 145.224 33.88 143.4 33.88C141.448 33.88 140.456 35.096 140.392 36.44H136.424C136.616 33.208 139.24 30.616 143.656 30.616ZM142.856 44.024C145.032 44.024 146.28 42.424 146.28 40.376V40.152H143.016C141.672 40.152 140.712 40.984 140.712 42.232C140.712 43.288 141.608 44.024 142.856 44.024ZM160.533 47.256C155.797 47.256 152.917 43.96 152.917 38.936C152.917 33.912 155.797 30.616 160.469 30.616C162.485 30.616 164.053 31.384 164.949 32.568V23.864H169.397V47H164.949V45.24C164.053 46.488 162.389 47.256 160.533 47.256ZM161.269 43.416C163.637 43.416 165.205 41.624 165.205 38.936C165.205 36.216 163.637 34.424 161.269 34.424C158.901 34.424 157.333 36.216 157.333 38.936C157.333 41.624 158.901 43.416 161.269 43.416ZM183.689 41.528H188.041C187.401 45.016 184.329 47.256 180.361 47.256C174.889 47.256 172.073 42.968 172.073 38.904C172.073 34.808 174.569 30.616 180.041 30.616C185.737 30.616 188.009 34.808 188.009 38.488C188.009 39.096 187.977 39.576 187.945 39.928H176.361C176.681 42.2 178.121 43.608 180.361 43.608C182.153 43.608 183.337 42.904 183.689 41.528ZM180.041 33.88C178.025 33.88 176.809 34.872 176.425 37.112H183.561C183.433 35.32 182.185 33.88 180.041 33.88Z" fill="#CAECF1"/>
                    <defs>
                    <filter id="filter0_d_731_4623" x="0" y="16.9268" width="42.1484" height="42.1465" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                    <feOffset dy="4"/>
                    <feGaussianBlur stdDeviation="2"/>
                    <feComposite in2="hardAlpha" operator="out"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.13 0"/>
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_731_4623"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_731_4623" result="shape"/>
                    </filter>
                    <linearGradient id="paint0_linear_731_4623" x1="21.0732" y1="16.9268" x2="21.0732" y2="51.0732" gradientUnits="userSpaceOnUse">
                    <stop stop-color="white"/>
                    <stop offset="1" stop-color="white" stop-opacity="0"/>
                    </linearGradient>
                    <linearGradient id="paint1_linear_731_4623" x1="28.3388" y1="15.1106" x2="11.9921" y2="53.6161" gradientUnits="userSpaceOnUse">
                    <stop stop-color="white"/>
                    <stop offset="1" stop-color="white"/>
                    </linearGradient>
                    </defs>
                    </svg>
                  </div>
                </td>
              </tr>
              <tr>
                  <td class="p-40">
                      <h1>You've Been Invited to a Project!</h1>
                      <p>Dear User,</p>
                      <p>We're excited to inform you that you've been invited to join a project on Keyshade. Here are the details of your invitation:</p>
                      <table class="project-details">
                          <tr>
                              <td>Project Name:</td>
                              <td>${projectName}</td>
                          </tr>
                          <tr>
                              <td>Invited By:</td>
                              <td>${invitedBy}</td>
                          </tr>
                          <tr>
                              <td>Invited On:</td>
                              <td>${invitedOn}</td>
                          </tr>
                          <tr>
                              <td>Your Role:</td>
                              <td>${invitationRole}</td>
                          </tr>
                      </table>
                      <p>To accept this invitation and join the project, please click the button below:</p>
                      <a href=${projectUrl} class="cta-button">Join Project</a>
                      <p>If you have any questions about this invitation or need assistance, please don't hesitate to contact our support team.</p>
                      <p>We look forward to your contributions to the project!</p>
                      <p>Cheers,<br>Team Keyshade</p>
                      <hr />
                      <p class="footer-text">This is an automated message. Please do not reply to this email.</p>
                      <p class="footer-text">
                          Read our <a href="https://www.keyshade.xyz/privacy">Privacy Policy</a> and <a href="https://www.keyshade.xyz/terms_and_condition">Terms and Conditions</a> for more information on how we manage your data and services.
                      </p>
                  </td>
              </tr>
          </table>
      </body>
      </html>
      `

    await this.sendEmail(email, subject, body)
  }

  private async sendEmail(
    email: string,
    subject: string,
    body: string
  ): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.FROM_EMAIL,
        to: email,
        subject: subject,
        html: body
      })
      this.log.log(`Email sent to ${email}`)
    } catch (error) {
      this.log.error(`Error sending email to ${email}: ${error.message}`)
      throw new InternalServerErrorException(
        `Error sending email to ${email}: ${error.message}`
      )
    }
  }
}
