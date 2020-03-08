import dotenv from "dotenv";
import path from "path";
// need to install dotenv(npm i dotenv)
dotenv.config({ path: path.resolve(__dirname, ".env") });

import sgTransport from "nodemailer-sendgrid-transport";
import nodemailer from "nodemailer";
import { adjectives, nouns } from "./word";

export const generateSecret = () => {
  let randomNumber = Math.floor(Math.random() * adjectives.length);
  let secret = adjectives[randomNumber];
  randomNumber = Math.floor(Math.random() * nouns.length);
  secret += " " + nouns[randomNumber];
  return secret;
};
const sendMail = email => {
  const options = {
    auth: {
      api_user: process.env.SENDGRID_USERNAME,
      api_key: process.env.SENDGRID_PASSWORD
    }
  };
  const client = nodemailer.createTransport(sgTransport(options));
  return client.sendMail(email);
};

export const sendSecretMail = (address, secret) => {
  const email = {
    from: "rlawlgy93@gmail.com",
    to: address,
    subject: "Login Secret🤫",
    html: `Hello! Your login secret is <strong>${secret}</strong>. <br/>Copy and paste on the app/website to log in.`
  };
  return sendMail(email);
};
