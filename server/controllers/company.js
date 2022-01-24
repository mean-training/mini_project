 const Company = require('../models').Company;
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
    }
}