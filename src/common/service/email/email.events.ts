
import { EventEmitter } from "events";
import { sendEmail } from "./sendEmail";
import { emailTemplate } from "./emailTemplate";
import { otpTypeEnum } from "src/common/enums";


export const eventEmitter = new EventEmitter();

eventEmitter.on(otpTypeEnum.CONFIRM_EMAIL, async (data) => {
  const { email, otp } = data;


  await sendEmail({
    to: email,
    subject: otpTypeEnum.CONFIRM_EMAIL,
    html: emailTemplate(otp as unknown as string, otpTypeEnum.CONFIRM_EMAIL),

  })

})

eventEmitter.on(otpTypeEnum.FORGET_PASSWORD, async (data) => {
  const { email, otp } = data;

  await sendEmail({
    to: email,
    subject: otpTypeEnum.FORGET_PASSWORD,
    html: emailTemplate(otp as unknown as string, otpTypeEnum.FORGET_PASSWORD),

  })

})




