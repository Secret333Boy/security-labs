const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const port = 3000;
const { auth } = require("express-openid-connect");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  auth({
    clientID: "YLPZLglTAXNugVMYHdylzjIR4KUtIKGR",
    clientSecret:
      "PPy_eRcX9BqP5dx3tqRB9jMcewyhJcCFwsAN3TAKfK7_Ssh1qkAbr0ntz5S5LUZx",
    baseURL: "http://localhost:3000",
    issuerBaseURL: "https://dev-yztnj-5z.eu.auth0.com/",
    secret: "asfasfas",
    idpLogout: true,
    authorizationParams: {
      response_type: "code", // This requires you to provide a client secret
      audience: "https://dev-yztnj-5z.eu.auth0.com/api/v2/",
      scope: "openid offline_access",
    },
  })
);

app.get("/", async (req, res) => {
  let { token_type, access_token, isExpired, refresh } = req.oidc.accessToken;

  if (isExpired()) {
    ({ access_token } = await refresh());
  }

  if (req.oidc?.user?.sub) {
    return res.json({
      sub: req.oidc.user.sub,
      logout: "http://localhost:3000/logout",
    });
  }
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
