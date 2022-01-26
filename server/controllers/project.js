const { default: async } = require('async');

const Project = require('../models').Project;
const Company = require('../models').Company;
const EmployeeProject = require('../models').EmployeeProject;
const Employee = require('../models').Employee;

module.exports = {

    async create(req,res){
        return Project.findOrCreate({
            where: { project_name: req.body.name, company_id: req.employee.company_id},
            defaults: {project_name:req.body.name}
        }).then((project) => {
            console.log(project[0])
            res.status(201).send({error:false,message:"Project created successfully",data:project[0]});
        }).catch((err) => {
            console.log(err)
            res.status(401).send({error:true,message:err.message});
        })
    },

    async list(req,res){
        return Project.findAll({
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
                }
            ]
        })
        .then((project) => {
             if(!project) res.status(400).send({error:true,message:"No project found"});
             res.status(200).send({error:false,message:"Projects found successfully",data:project});
        }).catch((err) => {
             res.status(500).send({error:true,message:err.message})
        });
    },
    
    async retrieve(req,res){
        return Project.findOne({
            where:{id:req.params.projectId},
            include:[{
                model:Company,
                as:'company'
            }]
        }).then((project) => {
            if(!project) res.status(400).send({error:true,message:"No project found"});
            res.status(200).send({error:false,message:"Project details found successfully",data:project});
        }).catch((err) => {
            res.status(500).send({error:true,message:err.message})
        });
    },
 
    async update(req,res){
        let object = {};
        let requestData = req.body;
 
        if(requestData.name) object.project_name = requestData.name

        return  Project.update(object,{
            where: {id:req.params.projectId}
        })
        .then(() => res.status(200).send({error:false,message:"Project details updated successfully"}))
        .catch((err) => res.status(500).send({error:false,message:err.message}));
    },
     
    async delete(req,res){
        return  Project.destroy({
            where: {id:req.params.projectId}
        })
        .then(() => res.status(200).send({error:false,message:"Project deleted successfully"}))
        .catch((err) => res.status(500).send({error:false,message:err.message}));
    },

    async assign(req,res){
        let existing    = [];
        let object      = [];
        let existingOne = req.projectMembers.employees;
        if(existingOne.length != 0){
            existingOne.filter((employee) => {
                if(req.body.employee.includes(employee.id)) existing.push(employee.email)
            });
             if(existing.length != 0) return res.status(409).send({error:true,message:`${existing.toString()} members(s) already assigned to the project`});
        }
        req.body.employee.map((value) => {
            let requestObj = { employee_id:value, project_id:req.params.projectId }
            object.push(requestObj);
        });
        await EmployeeProject.bulkCreate(object).then(() => {
            return res.status(200).send({error:false,message:"Member assigned to project successfully"});
        }).catch((err) => res.status(500).send({error:true,message:err.message}));
    },

    async unassign(req,res){
        try {
            let employeeId = [];
            if(req.projectMembers.employees.length != 0){
                req.projectMembers.employees.filter(member => {
                    if(req.body.employee.includes(member.id)) employeeId.push(member.id)
                });

                if(employeeId.length != 0){
                    return EmployeeProject.destroy({
                        where: {employee_id: employeeId}
                    }).then(() => res.status(200).send({error:false, message: "Employee unassigned successfully"}))
                    .catch((err) => res.status(500).send({error:true,message:err.message}));
                }
            }
            return res.status(404).send({error:true,message:"No project member found"});
        } catch (error) {
            return res.status(500);
        }
    },

    async restore(req,res){
        return EmployeeProject.update({deleted_at: null},{
            paranoid: false,
            where:{
                employee_id: req.params.employeeId,
                project_id: req.params.projectId
            }
        })
        .then(() => res.status(200).send({error:false,message:"Project member restored successfully"}))
        .catch((err) => res.status(500).send({error:true,message:err.message}));
    }

}