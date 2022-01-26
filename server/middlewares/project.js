const Employee = require("../models").Employee;
const Project = require("../models").Project;
const EmployeeProject = require("../models").EmployeeProject;


const getExistingEmployee = async (req,res,next) => {
    let employee = await Project.findOne({
        where: {id:req.params.projectId},
        attributes: ["project_name"],
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

module.exports = {
    getExistingEmployee 
}