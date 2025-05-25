const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  let token = req.cookies.token;
  if (token === "") {
    return res(500).send("You must be logged In !");
  } else {
    let data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = data;
    next();
  }
};

module.exports = auth;
