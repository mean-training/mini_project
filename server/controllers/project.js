const Project = require('../models').Project;
const Company = require('../models').Company;

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
        return Project.findAll()
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
}