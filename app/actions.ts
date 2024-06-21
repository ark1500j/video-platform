"use server";

import { prisma } from "@/utils/dbclient";
import { GenerateNumericOTP } from "@/utils/generateopt";
import { hashPassword } from "@/utils/hash";
import { transporter, utapi } from "@/utils/transporter";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { compare } from "bcrypt";
import { redirect } from "next/dist/server/api-utils";
import { revalidatePath } from "next/cache";

//sever actions, which are essentially POST requests, i.e functions that run on the server
export async function signInAction(prev: any, formdata: FormData) {
  const email = formdata.get("email") as string;
  const password = formdata.get("password") as string;
  const user = await prisma.users.findUnique({ where: { email: email } });
  if (!user) return { message: "invalid" };

  const passwordMatch = await compare(password, user.password);

  if (!passwordMatch) return { message: "invalid" };

  const otp = GenerateNumericOTP();
  await prisma.users.update({
    where: { email: email },
    data: {
      otp: otp,
    },
  }).then(async () => {
    await transporter.sendMail({
      from: '"NewTube" <blinder1500j@gmail.com>',
      to: email,
      subject: "NewTube OTP for login",
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>OTP Verification</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
                  text-align: center;
              }
              .container {
                  width: 100%;
                  padding: 20px;
              }
              .content {
                  background-color: #ffffff;
                  border-radius: 10px;
                  padding: 20px;
                  margin: 0 auto;
                  max-width: 500px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
              h1 {
                  color: #333333;
              }
              p {
                  color: #666666;
                  line-height: 1.5;
              }
              .otp {
                  font-size: 24px;
                  font-weight: bold;
                  color: #333333;
              }
              .footer {
                  margin-top: 20px;
                  font-size: 12px;
                  color: #999999;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="content">
                  <h1>OTP Verification</h1>
                  <p>Hello,</p>
                  <p>Your One-Time Password (OTP) for verification is:</p>
                  <p class="otp">${otp}</p>
                  <p>Please use this OTP to complete your verification. This OTP is valid for a limited time and should not be shared with anyone.</p>
                  <p>Thank you,</p>
                  <p>The NewTube Team</p>
              </div>
              <div class="footer">
                  <p>If you did not request this OTP, please ignore this email or contact support.</p>
              </div>
          </div>
      </body>
      </html>
    `,
    });
  });

  return { message: "valid" };
}

//sever action to signup user and verify account
export async function signupAction(prev: any, formdata: FormData) {
  const email = formdata.get("email") as string;
  const password = await hashPassword(formdata.get("password") as string);
  const username = formdata.get("username") as string;

  const user = await prisma.users.findUnique({ where: { email: email } });

  if (user) return { message: "exist" };

  const otp = GenerateNumericOTP();
  await prisma.users.create({
    data: {
      email: email,
      password: password,
      username: username,
      otp: otp,
    },
  }).then(async () => {
    await transporter.sendMail({
      from: '"NewTube" <blinder1500j@gmail.com>',
      to: email,
      subject: "NewTube OTP for sign up",
      html:`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>OTP Verification</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
                  text-align: center;
              }
              .container {
                  width: 100%;
                  padding: 20px;
              }
              .content {
                  background-color: #ffffff;
                  border-radius: 10px;
                  padding: 20px;
                  margin: 0 auto;
                  max-width: 500px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
              h1 {
                  color: #333333;
              }
              p {
                  color: #666666;
                  line-height: 1.5;
              }
              .otp {
                  font-size: 24px;
                  font-weight: bold;
                  color: #333333;
              }
              .footer {
                  margin-top: 20px;
                  font-size: 12px;
                  color: #999999;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="content">
                  <h1>OTP Verification</h1>
                  <p>Hello,</p>
                  <p>Your One-Time Password (OTP) for verification is:</p>
                  <p class="otp">${otp}</p>
                  <p>Please use this OTP to complete your verification. This OTP is valid for a limited time and should not be shared with anyone.</p>
                  <p>Thank you,</p>
                  <p>The NewTube Team</p>
              </div>
              <div class="footer">
                  <p>If you did not request this OTP, please ignore this email or contact support.</p>
              </div>
          </div>
      </body>
      </html>
    `,
    });
  });
  return { message: "valid" };
}

export async function otpVerifyAction(otp: string, email: string) {
  const user = await prisma.users.findUnique({
    where: { email: email, otp: otp },
  });

  if (!user) return { message: "invalid" };
  const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);

  const token = await new SignJWT({ ...user, role: "user" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1 day")
    .sign(secretKey);

  cookies().set({
    name: "token",
    value: token,
    secure: true,
    httpOnly: true,
  });
  return { message: "valid" };
}

/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////Adimin Actions
export async function adminSignIn(prev: any, formdata: FormData) {
  const email = formdata.get("email") as string;
  const password = formdata.get("password") as string;

  const admin = await prisma.admin.findUnique({
    where: { email: email },
  });
  if (!admin) return { message: "invalid" };

  const passwordMatch = await compare(password, admin.password);
  if (!passwordMatch) {
    return { message: "invalid" };
  }
  const otp = GenerateNumericOTP();
  await prisma.admin.update({
    where: { email: email },
    data: {
      otp: otp,
    },
  }).then(async () => {
    await transporter.sendMail({
      from: '"NewTube" <blinder1500j@gmail.com>',
      to: email,
      subject: "NewTube OTP for login",
      html:`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>OTP Verification</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
                  text-align: center;
              }
              .container {
                  width: 100%;
                  padding: 20px;
              }
              .content {
                  background-color: #ffffff;
                  border-radius: 10px;
                  padding: 20px;
                  margin: 0 auto;
                  max-width: 500px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
              h1 {
                  color: #333333;
              }
              p {
                  color: #666666;
                  line-height: 1.5;
              }
              .otp {
                  font-size: 24px;
                  font-weight: bold;
                  color: #333333;
              }
              .footer {
                  margin-top: 20px;
                  font-size: 12px;
                  color: #999999;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="content">
                  <h1>OTP Verification</h1>
                  <p>Hello,</p>
                  <p>Your One-Time Password (OTP) for verification is:</p>
                  <p class="otp">${otp}</p>
                  <p>Please use this OTP to complete your verification. This OTP is valid for a limited time and should not be shared with anyone.</p>
                  <p>Thank you,</p>
                  <p>The NewTube Team</p>
              </div>
              <div class="footer">
                  <p>If you did not request this OTP, please ignore this email or contact support.</p>
              </div>
          </div>
      </body>
      </html>
    `,
    });
  });
  return { message: "valid" };
}

export async function OtpAdmin(otp: string, email: string) {
  const admin = await prisma.admin.findUnique({
    where: { email: email, otp: otp },
  });

  if (!admin) return { message: "invalid" };

  const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
  const token = await new SignJWT({ ...admin, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1 day")
    .sign(secretKey);
  cookies().set({
    name: "token",
    value: token,
    secure: true,
    httpOnly: true,
  });

  return { message: "valid" };
}

export async function uploadVideoAction(formdata: FormData) {
  const file = formdata.get("media") as File;
  const title = formdata.get("title") as string;
  const description = formdata.get("description") as string;

  try {
    const data = await utapi.uploadFiles(file);

    const res = await prisma.video.create({
      data: {
        title: title,
        description: description,
        name: data.data?.name as string,
        key: data.data?.key as string,
        url: data.data?.url as string,
        type: data.data?.type as string,
        admin: {
          connect: {
            username: "admin",
          },
        },
      },
    });

    if (res) {
      return { message: "valid" };
    }
    return { message: "invalid" };
  } catch (error) { }
}

export async function verifyAction(email: string, role: string) {
  try {
    if (role === "admin") {
      const admin = await prisma.admin.findUnique({
        where: { email: email },
      });

      if (admin) {
        const otp = GenerateNumericOTP();
        await prisma.admin.update({
          where: { email: email },
          data: { otp: otp },
        });
        await transporter.sendMail({
          from: '"NewTube" <blinder1500j@gmail.com>',
          to: email,
          subject: "NewTube OTP for Reset Password",
          html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>OTP Verification</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
                  text-align: center;
              }
              .container {
                  width: 100%;
                  padding: 20px;
              }
              .content {
                  background-color: #ffffff;
                  border-radius: 10px;
                  padding: 20px;
                  margin: 0 auto;
                  max-width: 500px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
              h1 {
                  color: #333333;
              }
              p {
                  color: #666666;
                  line-height: 1.5;
              }
              .otp {
                  font-size: 24px;
                  font-weight: bold;
                  color: #333333;
              }
              .footer {
                  margin-top: 20px;
                  font-size: 12px;
                  color: #999999;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="content">
                  <h1>OTP Verification</h1>
                  <p>Hello,</p>
                  <p>Your One-Time Password (OTP) for verification is:</p>
                  <p class="otp">${otp}</p>
                  <p>Please use this OTP to complete your verification. This OTP is valid for a limited time and should not be shared with anyone.</p>
                  <p>Thank you,</p>
                  <p>The NewTube Team</p>
              </div>
              <div class="footer">
                  <p>If you did not request this OTP, please ignore this email or contact support.</p>
              </div>
          </div>
      </body>
      </html>
    `,
        });

        return { message: "valid" };
      } else {
        return { message: "invalid" };
      }
    } else if (role === "user") {
      const user = await prisma.users.findUnique({
        where: { email: email },
      });

      if (user) {
        const otp = GenerateNumericOTP();
        await prisma.users.update({
          where: { email: email },
          data: { otp: otp },
        });
        await transporter.sendMail({
          from: '"NewTube" <blinder1500j@gmail.com>',
          to: email,
          subject: "NewTube OTP for Reset Password",
          html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>OTP Verification</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
                  text-align: center;
              }
              .container {
                  width: 100%;
                  padding: 20px;
              }
              .content {
                  background-color: #ffffff;
                  border-radius: 10px;
                  padding: 20px;
                  margin: 0 auto;
                  max-width: 500px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
              h1 {
                  color: #333333;
              }
              p {
                  color: #666666;
                  line-height: 1.5;
              }
              .otp {
                  font-size: 24px;
                  font-weight: bold;
                  color: #333333;
              }
              .footer {
                  margin-top: 20px;
                  font-size: 12px;
                  color: #999999;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="content">
                  <h1>OTP Verification</h1>
                  <p>Hello,</p>
                  <p>Your One-Time Password (OTP) for verification is:</p>
                  <p class="otp">${otp}</p>
                  <p>Please use this OTP to complete your verification. This OTP is valid for a limited time and should not be shared with anyone.</p>
                  <p>Thank you,</p>
                  <p>The NewTube Team</p>
              </div>
              <div class="footer">
                  <p>If you did not request this OTP, please ignore this email or contact support.</p>
              </div>
          </div>
      </body>
      </html>
    `,
        }).catch(()=>{
          return {message:'invalid'}
        });

        return { message: "valid" };
      } else {
        return { message: "invalid" };
      }
    } else {
      return { message: "invalid role" };
    }
  } catch (error) {
    console.error("Error verifying action:", error);
    return { message: "invalid" };
  }
}

export async function resetOtpVerify(email: string, otp: string, role: string) {
  try {
    if (role === "admin") {
      const admin = await prisma.admin.findUnique({ where: { email } });

      if (admin && admin.otp === otp) {
        return { message: "valid" };
      } else {
        return { message: "invalid" };
      }

    } else if (role === "user") {

      const user = await prisma.users.findUnique({ where: { email } });

      if (user && user.otp === otp) {
        return { message: "valid" };
      } else {
        return { message: "invalid" };
      }

    } else {
      return { message: "invalid" };
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return { message: "Failed to verify OTP" };
  }
}

export async function changePasswordAction(
  email: string,
  newPassword: string,
  otp: string,
  role: string
) {
  try {
    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    if (role === "admin") {
      const admin = await prisma.admin.findUnique({ where: { email, otp } });

      if (!admin) {
        return { message: "invalid" };
      }

      await prisma.admin.update({
        where: { email },
        data: { password: hashedPassword },
      });

      return { message: "valid" };
    } else if (role === "user") {
      const user = await prisma.users.findUnique({ where: { email, otp } });

      if (!user) {
        return { message: "invalid" };
      }

      await prisma.users.update({
        where: { email },
        data: { password: hashedPassword },
      });

      return { message: "valid" };
    } else {
      return { message: "invalid" };
    }
  } catch (error) {
    console.error("Error updating password:", error);
    return { message: "Failed to update password" };
  }
}
