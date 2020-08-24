var express = require('express');
var router = express.Router();
var axios = require('axios');

const clientID = APPCONFIG.clientID;
const clientSecret = APPCONFIG.clientSecret;

router.get('/', function(req, res, next) {
  res.render('index', { clientID: APPCONFIG.clientID });
});

router.get("/home", (req, res) => {

  const cbCode = req.query.code;
  if (!cbCode) return res.render('index');

  axios({
      method: "post",
      url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${cbCode}`,
      headers: {
          accept: "application/json",
      },
  }).then((response) => {

      const accessToken = response.data.access_token;

      axios({
          method: "get",
          url: "https://api.github.com/user",
          headers: {
              accept: "application/json",
              Authorization: "token " + accessToken,
          },
      }).then((userRes) => {
          res.render('home', { name: userRes.data.name, login: userRes.data.login });
      });
  });
});

module.exports = router;
