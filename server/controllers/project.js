const Project = require('../models').Project;
const Company = require('../models').Company;

module.exports = {

    async list(req,res){
        return await Project.findAll({
            include:[{
                model:Company,
                as:'companies'
             }]
        }).then((project) => {
             if(!project) res.status(400).send({error:true,message:"No project found"});
             res.status(200).send({error:false,message:"Projects found successfully",data:project});
         }).catch((err) => {
             res.status(500).send({error:true,message:err.message})
         });
     },
 
     async retrieve(req,res){
         return await Project.findOne({
             where:{id:req.params.projectId},
             include:[{
                 model:Company,
                 as:'companies'
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
 
         if(requestData.project_name) object.name = requestData.project_name

         return await project.update(object,{
             where: {id:req.params.projectId}
         })
         .then(() => res.status(200).send({error:false,message:"Project details updated successfully"}))
         .catch((err) => res.status(500).send({error:false,message:err.message}));
     },
 
     async delete(req,res){
         return await Project.destroy({
             where: {id:req.params.projectId}
         })
         .then(() => res.status(200).send({error:false,message:"Project deleted successfully"}))
         .catch((err) => res.status(500).send({error:false,message:err.message}));
     },
}