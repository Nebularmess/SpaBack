const nodemailer = require("nodemailer");
require('dotenv').config();

const gmail = process.env.GMAIL;
const appPass = process.env.GMAIL_APP_PASS;

let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: gmail,
      pass: appPass,
    },
});

const emailSender = async (to, subject, text) => {
  // Create a transporter
  

  // Set up email options
  let mailOptions = {
    from: gmail,
    to: to,
    subject: subject,
    text: text,
  };

  // Send the email
  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

const emailReciverSimulation =async (from, subject, text) => {
    
    let mailOptions ={
        from: from,
        to: gmail,
        subject: subject,
        text: text
    }

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log("Mensaje enviado: " + info.response)
        return info;
    } catch (error) {
        console.error("Falla de envio: ", error)
        throw error;
    }
}

module.exports = {
    emailSender,
    emailReciverSimulation
};