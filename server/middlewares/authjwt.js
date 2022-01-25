const { decode } = require("jsonwebtoken");
const jwt = require("jsonwebtoken");
const { token } = require("morgan");
const Employee = require('../models').Employee;
require('dotenv').config()

verifyToken = (req, res, next) => {

  let token = req.headers["x-access-token"] || req.body.token  || (req.headers.authorization ? req.headers.authorization.split('Bearer ')[1] : null);

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

isAdmin = async (req, res, next) => {
    let accessToken = req.headers["x-access-token"] || req.body.token  || (req.headers.authorization ? req.headers.authorization.split('Bearer ')[1] : null);
    await Employee.findOne({
        where:{access_token:accessToken}
    }).then(employee => {
        if(employee.dataValues.user_type == 'admin'){
            req.employee = employee;
            next();
            return;
        }
        return res.status(403).send({message: "You aren't authenticate to perform this action"});
    });
};

module.exports = {
    verifyToken,
    isAdmin
}