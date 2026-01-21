const nodemailer = require("nodemailer");
const fs = require("node:fs");
const path = require("node:path");

function replaceTemplateVars(template, variables = {}) {
  let output = template;
  for (const key in variables) {
    const regex = new RegExp(String.raw`{{\s*${key}\s*}}`, "g");
    output = output.replace(regex, variables[key]);
  }
  return output;
}

async function sendEmail(to, subject, template, variables = {}) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    //  CORRECT PATH
    const templatePath = path.join(
      __dirname,        // src/services
      "..",             // src
      "views",          // src/views
      `${template}.html`
    );

    console.log("Template Path:", templatePath);

    const htmlTemplate = fs.readFileSync(templatePath, "utf8");

    const html = replaceTemplateVars(htmlTemplate, {
      ...variables,
      year: new Date().getFullYear(),
    });

    await transporter.sendMail({
      from: `Ecom <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error(" Email sending failed:", error.message);
    throw error;
  }
}

module.exports = { sendEmail };
