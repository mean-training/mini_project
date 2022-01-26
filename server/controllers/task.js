const Employee = require('../models').Employee;
const Task = require('../models').Task;
const EmployeeTask = require('../models').EmployeeTask;
const { default: async } = require('async');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {

    async create(req,res){
        let object = {};
        if(req.body.title != null) object.title = req.body.title
        if(req.body.priority != null) object.priority = req.body.priority
        if(req.body.project_id != null) object.project_id = req.body.project_id
        if(req.body.due_date != null) object.due_date = req.body.due_date
        if(req.body.company_id != null) object.company_id = req.body.company_id
        if(req.userId != null) object.created_by = req.userId

        return Task.create(object)
        .then((task) => {
            res.status(201).send({error:false,message:"Task created successfully",data:task})
        }).catch((err) => res.status(500).send({error:true,message:err.message}))
    },

    async assign(req,res){
        let existing    = [];
        let object      = [];
        let existingOne = req.employeeTask.employees;
        if(existingOne.length != 0){
            existingOne.filter((employee) => {
                if(req.body.employee.includes(employee.id)) existing.push(employee.email)
            });
             if(existing.length != 0) return res.status(409).send({error:true,message:`Task has already been assigned to ${existing.toString()} members(s)`});
        }
        req.body.employee.map((value) => {
            let requestObj = { employee_id:value, task_id:req.params.taskId, assigned_by:req.userId}
            object.push(requestObj);
        });
        await EmployeeTask.bulkCreate(object).then(() => {
            return res.status(200).send({error:false,message:"Task assigned to member(s) successfully"});
        }).catch((err) => res.status(500).send({error:true,message:err.message}));
    },

    async unassign(req,res){
        try {
            let employeeId = [];
            if(req.employeeTask.employees.length != 0){
                req.employeeTask.employees.filter(member => {
                    if(req.body.employee.includes(member.id)) employeeId.push(member.id)
                });

                if(employeeId.length != 0){
                    return EmployeeTask.destroy({
                        where: {
                            [Op.and]: [{employee_id: employeeId},{task_id:req.params.taskId}]
                        }
                    }).then(() => res.status(200).send({error:false, message: "Employee unassigned successfully"}))
                    .catch((err) => res.status(500).send({error:true,message:err.message}));
                }
            }
            return res.status(404).send({error:true,message:"No project member found"});
        } catch (error) {
            return res.status(500);
        }
    },

    async restoreTaskMember(req,res){
        await EmployeeTask.update({deleted_at: null},{
            paranoid: false,
            where:{
                [Op.and] : [{employee_id: req.body.employee},{task_id: req.params.taskId}]
            }
        }).then((employeeTask) => {
            if(employeeTask == 0) return res.status(404).send({error:false,message:"No task member found"})
            return res.status(200).send({error:false,message:"Task member restored successfully"})
        }).catch((err) => {
            return res.status(500).send({error:true,message:err.message})
        });
    },

    async update(req,res){
        let object = {};
        if(req.body.title != null) object.title = req.body.title
        if(req.body.priority != null) object.priority = req.body.priority
        if(req.body.due_date != null) object.due_date = req.body.due_date
        
        await Task.update(object,{
            where:{
                [Op.and]: [{id: req.params.taskId},{company_id:req.employee.company_id}]
            }
        }).then((task) => {
            if(task == 0){
                return res.status(404).send({error:true,message:"Task not found"});
            }
            return res.status(200).send({error:false,message: "Task details updated successfully"})
        }).catch((err) => {
            return res.status(500).send({error:true,message:err.message})
        });
    },

    async delete(req,res){
        await Task.destroy({
            where:{
                [Op.and]: [{id: req.params.taskId},{company_id:req.employee.company_id}]
            }
        }).then((task) => {
            if(task == 0){
                return res.status(404).send({error:true,message:"Task not found"});
            }
            return res.status(200).send({error:false,message: "Task deleted successfully"})
        }).catch((err) => {
            return res.status(500).send({error:true,message:err.message})
        });
    },

    async restore(req,res){
        await Task.update({deleted_at:null},{
            paranoid:false,
            where:{
                [Op.and]: [{id: req.params.taskId},{company_id:req.employee.company_id}]
            }
        }).then((task) => {
            if(task == 0){
                return res.status(404).send({error:true,message:"Task not found"});
            }
            return res.status(200).send({error:false,message: "Task restored successfully"})
        }).catch((err) => {
            return res.status(500).send({error:true,message:err.message})
        });
    },

    async list(req,res){
        return Task.findAll({
            where: {company_id: req.params.companyId},
            attributes:["title","priority","due_date"],
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
                }
            ]
        })
        .then((task) => {
            if(!task) res.status(400).send({error:true,message:"No task found"});
            res.status(200).send({error:false,message:"Tasks found successfully",data:task});
        }).catch((err) => {
            res.status(500).send({error:true,message:err.message})
        });
    },

    async listByEmployee(req,res){
        return Task.findAll({
            where: {
              [Op.and]: [{company_id: req.params.companyId},{created_by:req.params.employeeId}] 
            },
            attributes:["title","priority","due_date"],
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
                }
            ]
        })
        .then((task) => {
            if(!task) res.status(400).send({error:true,message:"No task found"});
            res.status(200).send({error:false,message:"Tasks found successfully",data:task});
        }).catch((err) => {
            res.status(500).send({error:true,message:err.message})
        });
    }



}