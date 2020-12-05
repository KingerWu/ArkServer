const nodemailer = require('nodemailer');
const config = require("../../config");

const transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secureConnection: true,
    auth: {
        user: config.email.user,
        pass: config.email.pass,
    }
});

// let mailOption = {
//     from: '', // sender address
//     to: '', // list of receivers
//     subject: title, // Subject line
//     // 发送text或者html格式
//     // text: 'Hello world?', // plain text body
//     text: content
// };  

class Email {
    constructor(){

    }

    send(option) {
        let defaultOption = {
            from: config.email.user
        };
        option =  Object.assign({}, defaultOption, option);
        return new Promise((resolve, reject) => {
            // send mail with defined transport object
            transporter.sendMail(option, (error, info) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(info);
                }
            });
        });
    }
}


module.exports = new Email();