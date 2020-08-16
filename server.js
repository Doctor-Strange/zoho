const express = require("express");
const cookieParser = require("cookie-parser");
const Recaptcha = require("express-recaptcha").RecaptchaV3;
const bodyParser = require("body-parser");
const cors = require("cors");

const PORT = process.env.PORT || 8080;
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(cors());
const siteKey = "6LdFeb8ZAAAAAOpCpdBwshpryL2HDeBIPAGRP75J";
const secretKey = "6LdFeb8ZAAAAAHRa0JqLVw1BXIZdfC6aTy2KrAzH";

const recaptcha = new Recaptcha(siteKey, secretKey, { action: "homepage" });

app.post("/verify/", (req, res) => { 
  res.status(200).json({
    success: true,
  });
});

app.get("/recaptcha/", recaptcha.middleware.verify, (req, res) => {
  const botCookie = req.cookies._rbs;
  if (!req.recaptcha.error) {
    const recaptcha = req.recaptcha.data;
    const score = recaptcha.score;
    res.cookie("_rbs", score, { path: "/", maxAge: 30 * 60 * 1000 });
    // Only send response if cookie does not exist or does not match the latest score
    if (botCookie !== score) {
      res.send({ status: "1", recaptcha: req.recaptcha.data });
    }
  } else {
    const score = req.recaptcha.error;
    res.cookie("_rbs", score, { path: "/", maxAge: 30 * 60 * 1000 });
    res.send({ status: "0", recaptcha: { score: score } });
  }
});
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
