const express = require("express");
const cookieParser = require("cookie-parser");
const Recaptcha = require("express-recaptcha").RecaptchaV3;

const PORT = process.env.PORT;
const app = express();
app.use(cookieParser());

const siteKey = "6LcJG78ZAAAAAD3u-1dQGeApdBcQeMoTe9ju17SJ";
const secretKey = "6Lc_F78ZAAAAAIGTMwU_oUDHL6kNFD5k6q2hXZvw";

const recaptcha = new Recaptcha(siteKey, secretKey, { action: "homepage" });

app.get("/recaptcha/", recaptcha.middleware.verify, (req, res) => {
  const botCookie = req.cookies._rbs;
  res.header("Access-Control-Allow-Origin", "*"); // Set this to the actual domain that will be sending the requests
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
