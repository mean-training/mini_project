const Company  = require('../models').Company;
const Employee = require('../models').Employee;
const crypto   = require('crypto');
const jwt      = require("jsonwebtoken");
const bcrypt   = require('bcrypt');
const async    = require('async');
const mailer   = require('../utilities/mail'); 
const { validationResult } = require('express-validator/check');

module.exports = {

    async setUp(req,res){
        let accessToken = req.params.token;
        await Company.findOne({
            where:{token:accessToken}
        }).then( async (company) => {
            let object = {
                first_name:req.body.first_name,
                last_name:req.body.last_name,
                email:req.params.email,
                is_active:true,
                password:req.body.password,
                company_id:company.id,
                user_type:'admin'
            }
            await Employee.findOrCreate({
                where:{email: object.email},
                defaults:object
            }).then(async (employee) => {
                if(!employee) return res.status(404).send({error:true,message:"Employee not found"});
                await Company.update({owner_id:employee[0].dataValues.id,is_active:true},{
                    where:{token: req.params.token}
                }).then(() => {
                    return res.status(201).send({error:false, message: "User registered successfully" });
                }).catch((err) => {
                    return res.status(500).send({error:true,message:err.message});
                })
            }).catch((err) => {
                return res.status(500).send({error:true,message:err.message});
            })
        }).catch(() => {
            return res.status(400).send({error:true,message:"No company found"});
        });   
    },

    async login(req,res){
        let requestData = req.body;
        await Employee.findOne({
            where:{email: req.body.email}
        }).then(async (employee) => {
            if(!employee){
                return res.status(400).send({error:true,message:"Employee not found"})
            }

            if(!employee.password || !bcrypt.compareSync(req.body.password,employee.password)){
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!"
                });
            }

            let accessToken = jwt.sign({ id: employee.id }, process.env.JWT_SECRET_KEY , { expiresIn: 86400 });

            await Employee.update({access_token:accessToken},{
                where:{email:requestData.email}
            });

            res.status(200).send({
                error:false,
                message:"User logged in successfully",
                data:{
                    id:employee.id,
                    firstName: employee.first_name,
                    lastName : employee.last_name,
                    email:employee.email,
                    accessToken: accessToken
                }
            });
        }).catch(err => {
            return res.status(500).send({error:true,message:err.message});
        }) 
    },

    async inviteMember(req,res){
        let object      = [];
        let existingOne = [];

        if(Object.entries(req.existingEmployee).length != 0){
            req.existingEmployee.filter((value) => {
                if(req.body.email.includes(value.email)){
                    existingOne.push(value.email)
                }
            });
        }
        if(existingOne.length != 0){
            return res.status(409).send({error:true,message: `${existingOne.toString()} email(s) already exists.`})
        }

        req.body.email.map(value => {
            let empObj = {email:value, company_id: req.employee.company_id, api_token: crypto.randomBytes(30).toString('hex')}
            object.push(empObj);
        }); 

        Employee.bulkCreate(object)
        .then(() =>  {
            async.each(object, (member) => {
                let activationLink = `${process.env.BASE_URL}/employee/setUp/${member.email}/${member.api_token}`
                let mailObj = { from: process.env.MAILER_NAME, to: member.email, subject: "Complete your account setup",
                                html: `<p>To activate your account, please click the link: <a href="${activationLink}">${activationLink}</a></p>`
                            }
                mailer.sendEmail(mailObj);
            });
            res.status(200).send({error:false,message:"An invitation email has been sent to the members"})
        }).catch((err) => {
            res.status(500).send({error:true, message: err.message});
        });
    },

    async accountSetup(req,res){
        let object = {};
        const errors = validationResult(req);
        console.log(errors);
        if(!errors.isEmpty()){
            res.status(422).json({errors:errors.array()});  
        } 
        if(req.body.first_name != null) object.first_name = req.body.first_name;
        if(req.body.last_name != null) object.last_name = req.body.last_name  
        if(req.body.password != null) object.password = req.body.password  
        object.is_active   = true;
        object.api_token   = null;
        object.access_token = jwt.sign({ id: req.employee.id }, process.env.JWT_SECRET_KEY , {expiresIn: 86400});

        await Employee.update(object, {
            where: {email:req.params.email},individualHooks: true 
        }).then(() => {
            res.status(200).send({
                error:false,
                message:"User logged in successfully",
                data:{
                    id:req.employee.id,
                    firstName: object.first_name,
                    lastName: object.last_name,
                    email:object.email,
                    accessToken: object.access_token
                }
            });
        }).catch((err) => {res.status(500).send({error:true, message: err.message})});
    },

    async update(req,res){
        let object = {};
        try{
            if(req.body.first_name) object.first_name = req.body.first_name
            if(req.body.last_name)  object.last_name  = req.body.last_name
            if(req.body.password)   object.password   = req.body.password
            if(req.body.user_type)  object.user_type  = req.body.user_type
            if(req.body.is_active)  object.is_active  = req.body.is_active

            return Employee.update(object,{
                where:{id : req.params.id},individualHooks: true 
            }).then(() => res.status(200).send({error:false,message: "Employee updated successfully"}))
              .catch((err) => res.status(500).send({error:true,message:console.error.message}))
        }catch(error){
            return res.status(500).send({error:true,message:error.message})
        }
    },

    async delete(req,res){
        return  Employee.destroy({
            where: {id:req.params.id}
        })
        .then(() => res.status(200).send({error:false,message:"Employee deleted successfully"}))
        .catch((err) => res.status(500).send({error:false,message:err.message}));
    },

    async list(req,res){
        return await Employee.findAll({
            where:{company_id: req.params.companyId}
        }).then((employee) => {
             if(!employee) res.status(400).send({error:true,message:"No employee found"});
             res.status(200).send({error:false,message:"Employees found successfully",data:employee});
         }).catch((err) => {
             res.status(500).send({error:true,message:err.message})
         });
     }

}