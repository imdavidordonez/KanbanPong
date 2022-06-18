import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import nodemailer from "nodemailer";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../lib/prisma";
import Handlebars from "handlebars";
import { readFileSync } from "fs";
import path from "path";
import GoogleProvider from 'next-auth/providers/google';


// Create transporter object with configuration SMTP
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: process.env.EMAIL_SERVER_PORT,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
  secure: true,
});

const emailsDir = path.resolve(process.cwd(), "emails");

const sendVerificationRequest = ({ identifier, url }) => {
  const emailFile = readFileSync(path.join(emailsDir, "confirm-email.html"), {
    encoding: "utf8",
  });
  const emailTemplate = Handlebars.compile(emailFile);
  transporter.sendMail({
    from: `"✏️ Kanban Pong" ${process.env.EMAIL_FROM}`,
    to: identifier,
    subject: "Your sign-in link for Kanban Pong",
    html: emailTemplate({
      base_url: process.env.NEXTAUTH_URL,
      signin_url: url,
      email: identifier,
    }),
  });
};

const sendWelcomeEmail = async ({ user }) => {
  const { email } = user;

  try {
    const emailFile = readFileSync(path.join(emailsDir, "welcome.html"), {
      encoding: "utf8",
    });
    const emailTemplate = Handlebars.compile(emailFile);
    await transporter.sendMail({
      from: `✏️ "Kanban Pong" ${process.env.EMAIL_FROM}`,
      to: email,
      subject: "Welcome to Kanban Pong! 🎉",
      html: emailTemplate({
        base_url: process.env.NEXTAUTH_URL,
        support_email: "support@kanbanpong.com",
      }),
    });
  } catch (error) {
    console.log(`❌ Unable to send welcome email to user (${email})`);
  }
};
// Export NextAuth for create and auto manage the API routes for the authentication
export default NextAuth({
  pages: {
    signIn: "/",
    signOut: "/",
    error: "/",
    verifyRequest: "/",
  },

  providers: [
    EmailProvider({
      maxAge: 10 * 60, // Magic links are valid for 10 min only
      sendVerificationRequest,
    }),
    GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  // Adding the adapter to my NextAuth configuration object
  adapter: PrismaAdapter(prisma),
  events: { createUser: sendWelcomeEmail },
});