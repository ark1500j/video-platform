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
  });
  // .then(async () => {
  //   await transporter.sendMail({
  //     from: '"NewTube" <blinder1500j@gmail.com>',
  //     to: email,
  //     subject: "NewTube OTP for login",
  //     html: `${otp}`,
  //   });
  // });

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
  });
  // .then(async () => {
  //   await transporter.sendMail({
  //     from: '"NewTube" <blinder1500j@gmail.com>',
  //     to: email,
  //     subject: "NewTube OTP for login",
  //     html: `${otp}`,
  //   });
  // });
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
  });
  // .then(async () => {
  //   await transporter.sendMail({
  //     from: '"NewTube" <blinder1500j@gmail.com>',
  //     to: email,
  //     subject: "NewTube OTP for login",
  //     html: `${otp}`,
  //   });
  // });
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
    console.log(data);
    
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
      return { message: 'valid' };
    }
    return {message:'invalid'}
  } catch (error) {
    console.log(error);
  } 
    
}
