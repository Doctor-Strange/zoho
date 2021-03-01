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
const siteKey = "6Ler8sIZAAAAAP_s64xgDM2HCm03wCuARkotJani";
const secretKey = "6Ler8sIZAAAAAELzya7DeKADYfk_R8IPfRHHhMJR";

const recaptcha = new Recaptcha(siteKey, secretKey, { action: "homepage" });

app.post("/verify/", (req, res) => {
  res.status(200).json({
    success: true,
  });
});

async function getUsers() {
  const got = require("got");

  let url = "https://accounts.zoho.eu/oauth/v2/token";

  let parameters = {
    grant_type: "authorization_code",
    client_id: "1000.2QNXOALFG34X4YSDIAM8O74PEY950Q",
    client_secret: "2f721edc36392a77871f2f0a4c29b829aa0b551567",
    redirect_uri: "https://sepris.com/",
    code:
      "1000.3bc193b2906692a1036885db41b7eeb3.df5427079c1eb92e3b02133106a7fbac",
  };

  let requestDetails = {
    method: "GET",
    searchParams: parameters,
    throwHttpErrors: false,
  };

  let response = await got(url, requestDetails);

  if (response != null) {
    console.log(response.body);
  }
}
getUsers();

// app.get("/recaptcha/", recaptcha.middleware.verify, (req, res) => {
//   const botCookie = req.cookies._rbs;
//   if (!req.recaptcha.error) {
//     const recaptcha = req.recaptcha.data;
//     const score = recaptcha.score;
//     res.cookie("_rbs", score, { path: "/", maxAge: 30 * 60 * 1000 });
//     // Only send response if cookie does not exist or does not match the latest score
//     if (botCookie !== score) {
//       res.send({ status: "1", recaptcha: req.recaptcha.data });
//     }
//   } else {
//     const score = req.recaptcha.error;
//     res.cookie("_rbs", score, { path: "/", maxAge: 30 * 60 * 1000 });
//     res.send({ status: "0", recaptcha: { score: score } });
//   }
// });
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
