const Employee = require("../models").Employee;
const Project = require("../models").Project;
const EmployeeProject = require("../models").EmployeeProject;


const getExistingEmployee = async (req,res,next) => {
    let employee = await Project.findOne({
        where: {id:req.params.projectId},
        attributes: ["project_name","company_id"],
        include: [
            {
              model: Employee,
              as: "employees",
              attributes: ["id", "first_name","last_name","email"],
              through: {
                model: EmployeeProject,
                as: "employeeProjects",
                attributes: [],
              }
            }],
    }).then((project) => {
        if(!project) return res.status(404).send({error:true,message:"No project found"});
        req.projectMembers = project 
        return next();
    }).catch((err) => {
       res.status(500).send({error:true,message:err.message})
    }) 
}

const canAccessProject = async (req,res,next) => {
  let adminCompany   = req.employee.company_id;
  let projectCompany = req.projectMembers ? req.projectMembers.company_id : req.body.company_id ? req.body.company_id : req.params.companyId

  if(adminCompany == projectCompany){
    return next();
  }

  return res.status(403).send({error:true,message:"Sorry, you are unauthenticated to perform this action"})
}

module.exports = {
    getExistingEmployee,
    canAccessProject
}