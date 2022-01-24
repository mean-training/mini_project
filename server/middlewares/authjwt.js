const jwt = require("jsonwebtoken");
const Employee = require('../models').Employee;
require('dotenv').config()

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"] || req.body.token  ;

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY , (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    req.userId = decoded.id;
    next();
  });
};

isAdmin = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
      if(user.user_tpe == 'admin'){
          next();
          return;
        }
        res.status(403).send({message: "You aren't authenticate to perform this action"});
        return;
    });
};

module.exports = {
    verifyToken,
    isAdmin
}