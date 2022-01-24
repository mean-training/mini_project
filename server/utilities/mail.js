var nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAILER_NAME,
        pass: process.env.MAILER_PASSWORD
    }
});

module.exports = {
    async  sendEmail({from, to, subject, html}) {
        await transporter.sendMail({ from, to, subject, html }, function(error,response){
            if(error){
                console.log(error);
                return;
            }else{
                console.log("response");
                console.log('Email sent successfully');
                transporter.close();
            }
        });
    }
}