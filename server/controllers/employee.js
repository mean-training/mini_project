const Company  = require('../models').Company;
const Employee = require('../models').Employee;
const crypto   = require('crypto');
const jwt      = require("jsonwebtoken");
const bcrypt   = require('bcrypt');
const async    = require('async');
const mailer   = require('../utilities/mail'); 

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
            where:{email: requestData.email}
        }).then(async (employee) => {
            if(!employee){
                return res.status(400).send({error:true,message:"Employee not found"})
            }

            if(!employee.password || !bcrypt.compareSync(requestData.password,employee.password)){
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!"
                });
            }

            let accessToken = jwt.sign({ id: employee.id }, process.env.JWT_SECRET_KEY , {
                expiresIn: 86400 // 24 hours
            });

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
        await Employee.findAll({
            where:{email:req.body.email}
        }).then(async (employee) => {
            if(Object.entries(employee).length != 0){
                employee.filter((value) => {
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

            return Employee.bulkCreate(object)
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
        });
    }
}