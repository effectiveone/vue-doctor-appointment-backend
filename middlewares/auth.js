const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
  console.log("przehodze walidacje verifyToken");

  let token =
    req.body.token ||
    req.query.token ||
    req.headers["authorization"] ||
    req.headers["Authorization"];

  if (!token) {
    console.log("no token");
    return res.status(403).send("A token is required for authentication");
  }

  try {
    token = token.replace(/^Bearer\s+/, "");
    const decode = jwt.verify(token, config.TOKEN_KEY);

    req.user = decode;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }

  return next();
};

module.exports = verifyToken;
