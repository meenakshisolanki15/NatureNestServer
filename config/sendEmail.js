import {sendEmail} from "../config/emailService.js";


const sendEmailFun = async(to, subject, text, html )=>{
    const result = await sendEmail(to, subject, text, html);
    if(result.success){
        return true;
        //res.status(200).json({message: 'Email sent successfully', messageId: result.message});
    } else{
        return false;
        //res.status(500).json({message: 'failed to send email', error: result.error});
    }
}

export default sendEmailFun;