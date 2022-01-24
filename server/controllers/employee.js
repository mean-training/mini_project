const Company  = require('../models').Company;
const Employee = require('../models').Employee;
const jwt = require("jsonwebtoken");
const bcrypt   = require('bcrypt');
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
        })
        // .catch(err => {
        //     return res.status(500).send({error:true,message:err.message});
        // })
        
    }
}