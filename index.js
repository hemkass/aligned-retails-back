const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(formidable());

/* MAILGUN CONFIGURATION */
const api_key = process.env.api_key;
const domain = process.env.domain;

app.get("/", (req, res) => {
  res.json({ message: "Welcome on my portfolio app" });
});

const mailgun = require("mailgun-js")({ apiKey: api_key, domain: domain });

app.post("/form", (req, res) => {
  console.log("Route /form");

  const { firstname, lastname, email, message, telephone } = req.fields;
  /* CREATION DE L'OBJET DATA */
  const data = {
    from: `${firstname} ${lastname} ${telephone} <${email}>`,
    to: "heimkass64@gmail.com",
    subject: "Formulaire rempli",
    text: `${message}`,
  };
  console.log(data);
  mailgun.messages().send(data, (error, body) => {
    console.log(body);
    console.log(error);

    if (!error || error === undefined) {
      res.json({ message: "Données du form bien reçues, mail envoyé." });
    } else {
      res.json(error);
    }
  });
});

app.all("*", (req, res) => {
  res.json("All routes");
});

app.listen(process.env.PORT, () => {
  console.log("server started");
});
