 const Company = require('../models').Company;
 const Employee = require('../models').Employee;
 const mailer  = require('../utilities/mail');
 const crypto  = require('crypto');
 const mail = require('../utilities/mail');
 require('dotenv').config();

module.exports = {
    async signUp(req,res){
        try {
            let object = {
                name: (req.body.email) ? `${req.body.email.split('@')[0]}` : null ,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                token: crypto.randomBytes(30).toString('hex'),
            }
            await Company.findOrCreate({
                where:{ name: object.name},
                defaults:{timezone: object.timezone, token: object.token}
            });
            let activationLink = `${process.env.BASE_URL}/setUp/${req.body.email}/${object.token}`
            let mailObj = {from: process.env.MAILER_NAME, to: req.body.email, subject: "Complete your sign up",
                html: `<p>To activate your account, please click the link: <a href="${activationLink}">${activationLink}</a></p>`
            }
            mailer.sendEmail(mailObj);
            return res.status(201).send({error:false,message:"Please verify your email for account setup."});
        } catch (error) {
            return res.status(500).send({error:true,message:"Something went wrong"});
        }
    },

    async list(req,res){
       return await Company.findAll({
           include:[{
               model:Employee,
               as:'employees'
            }]
       }).then((companies) => {
            if(!companies) res.status(400).send({error:true,message:"No company found"});
            res.status(200).send({error:false,message:"Companies found successfully",data:companies});
        }).catch((err) => {
            res.status(500).send({error:true,message:err.message})
        });
    },

    async retrieve(req,res){
        return await Company.findOne({
            where:{id:req.params.companyId},
            include:[{
                model:Employee,
                as:'employees'
             }]
        }).then((company) => {
             if(!company) res.status(400).send({error:true,message:"No company found"});
             res.status(200).send({error:false,message:"Company details found successfully",data:company});
         }).catch((err) => {
             res.status(500).send({error:true,message:err.message})
         });
    },

    async update(req,res){
        let object = {};
        let requestData = req.body;

        if(requestData.name) object.name = requestData.name
        if(requestData.domain) object.domain = requestData.domain
        if(requestData.is_active) object.is_active = requestData.is_active
        if(requestData.timezone) object.timezone = requestData.timezone
        if(requestData.owner_id) object.owner_id = requestData.owner_id
        if(requestData.deleted_at) object.deleted_at = requestData.deleted_at

        return await Company.update(object,{
            where: {id:req.params.companyId}
        })
        .then(() => res.status(200).send({error:false,message:"Company details updated successfully"}))
        .catch((err) => res.status(500).send({error:false,message:err.message}));
    },

    async delete(req,res){
        return await Company.destroy({
            where: {id:req.params.companyId}
        })
        .then(() => res.status(200).send({error:false,message:"Company deleted successfully"}))
        .catch((err) => res.status(500).send({error:false,message:err.message}));
    },
    
}