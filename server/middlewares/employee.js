const Employee = require("../models").Employee;

const getEmployeeDetail = async (req, res, next) => {
    let employee = await Employee.findOne({
        where: {email: req.params.email}
    }).then((employee) => {
        if(employee){
            req.employee = employee;
            return next();
        }
        res.status(400).send({error: true,message:"No employee found"})
    }).catch((err) => {
       res.status(500).send({error:true,message:err.message})
    }) 
}

const getExistingEmployee = async (req,res,next) => {
    let employee = await Employee.findAll({
        where: {email:req.body.email}
    }).then((employee) => {
        if(employee){
            req.existingEmployee = employee;
            return next();
        }
        res.status(400).send({error: true,message:"No employee found"})
    }).catch((err) => {
       res.status(500).send({error:true,message:err.message})
    }) 
}

module.exports = {
    getEmployeeDetail,
    getExistingEmployee 
}