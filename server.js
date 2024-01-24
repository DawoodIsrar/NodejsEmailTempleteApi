const express = require("express");
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

const app = express();
const port = 5000;

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "awtrawalpindi@gmail.com", // replace with your Gmail email
    pass: "aijgtkinvcikihod", // replace with your Gmail password
  },
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Use EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.post("/send-email", async (req, res) => {
  try {
    // Ensure that the request body has the expected properties
    if (!req.body || !req.body.name || !req.body.email) {
      return res
        .status(400)
        .send("Bad Request: Missing name or email in the request body");
    }

    // Render the EJS template with dynamic data
    const html = await ejs.renderFile(
      path.join(__dirname, "views", "email_template.ejs"),
      {
        name: req.body.name,
        title: req.body.title,
        date: req.body.date,
        emailTitle: req.body.emailTitle,
        buttonLink: req.body.buttonLink,
        buttonText: req.body.buttonText,
        emailContent: req.body.emailContent,
      }
    );

    // Email options
    const mailOptions = {
      from: "engrdawoodisrar.dev@gmail.com", // replace with your Gmail email
      to: req.body.email,
      subject: "Test Email",
      html: html,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(200).send("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log("Server is running on port:", port);
});
