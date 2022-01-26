const Employee = require("../models").Employee;
const Task = require("../models").Task;
const EmployeeTask = require("../models").EmployeeTask;


const getExistingEmployee = async (req,res,next) => {
    await Task.findOne({
        where: {id:req.params.taskId},
        attributes: ["title","company_id"],
        include: [
            {
              model: Employee,
              as: "employees",
              attributes: ["id", "first_name","last_name","email"],
              through: {
                model: EmployeeTask,
                as: "employeeTasks",
                attributes: [],
              }
            }],
    }).then((task) => {
        if(!task) return res.status(404).send({error:true,message:"No task found"});
        req.employeeTask = task 
        return next();
    }).catch((err) => {
       res.status(500).send({error:true,message:err.message})
    }) 
}

const canAccessTask = async (req,res,next) => {
    let adminCompany = req.employee.company_id;
    let taskCompany  = req.employeeTask ? req.employeeTask.company_id : req.body.company_id ? req.body.company_id : req.params.companyId

    if(adminCompany == taskCompany){
        return next();
    }

    return res.status(403).send({error:true,message:"Sorry, you are unauthenticated to perform this action"})
}

module.exports = {
    getExistingEmployee,
    canAccessTask
}