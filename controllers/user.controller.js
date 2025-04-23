import UserModel from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sendEmailFun from "../config/sendEmail.js";
import VerificationEmail from "../utils/verifyEmailTemplate.js";
import generatedAccessToken from "../utils/generatedAccessToken.js";
import generatedRefreshToken from "../utils/generatedRefreshToken.js";

import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';


cloudinary.config({
    cloud_name : process.env.cloudinary_Config_Cloud_Name,
    api_key: process.env.cloudinary_Config_api_key,
    api_secret : process.env.cloudinary_Config_api_secret,
    secure : true
})

export async function registerUserController(request, response) {

    try{
        let user;
        const { name, email, password } = request.body;
        if(!name || !email || !password){
            return response.status(400).json({
                message : "provide email, name, password",
                error : true,
                success : false
            })
        }

        user = await UserModel.findOne({email: email});

        if(user){
            return response.json({
                message : "User already register  with this email",
                error : true,
                success : false
            })
        }

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(password, salt);


        user = new UserModel({
            email : email,
            password : hashPassword, 
            name : name,
            otp: verifyCode,
            otpExpires: Date.now() + 600000
        });

        await user.save();
        // const VerifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save?._id}`

        //send verification email
        await sendEmailFun(
            email,
            "Verify email from Ecommerce App",
            "",
            VerificationEmail(name, verifyCode) 
        );


        // create a JMT token for verification purpose

        const token = jwt.sign(
            { email: user.email, id: user._id },
            process.env.JSON_WEB_TOKEN_SECRET_KEY
        );

        return response.status(200).json({
            success: true,
            error: false,
            message: "User registered successfully! Please verify your email.",
            token: token, // Optional 
        });

    } catch (error){
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
    
}

export async function verifyEmailController(request, response) {
    try{
        const { email, otp} = request.body;
        const user = await UserModel.findOne({email: email});
        if(!user){
            return response.status(400).json({error: true, success: false, message: "User Not found"});
        }

        const isCodeValid = user.otp === otp;
        const isNotExpired = user.otpExpires > Date.now();

        if(isCodeValid && isNotExpired){
            user.verify_email = true;
            user.otp = null;
            user.otpExpires = null;
            await user.save();
            return response.status(200).json({error: false, success: true, message: "Email Verified successfully"});
        } else if(!isCodeValid){
            return response.status(400).json({error:true, success: false, message: "Invalid OTP"});
        } else {
            return response.status(400).json({error: true, success: false, message: "OTP expired"});
        }
    }catch (error){
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
    
}


export async function loginUserController(request, response) {
    try{
        const {email, password} = request.body;

    const user = await UserModel.findOne({email: email});

    if(!user){
        return response.status(400).json({
            message: "User Not Registered",
            error: true,
            success: false
        })
    }

    if(user.status !== "Active"){
        return response.status(400).json({
            message: "Contact to admin",
            error: true,
            success: false
        })
    }

    const checkPassword = await bcryptjs.compare(password, user.password);

    if(!checkPassword){
        return response.status(400).json({
            message: "Check your password",
            error: true,
            success: false
        })
    }

    const accesstoken = await generatedAccessToken(user._id);
    const refreshtoken = await generatedRefreshToken(user._id);

    const updateUser = await UserModel.findByIdAndUpdate(user?._id,{
        last_login_date : new Date()
    })

    const cookiesOption = {
        httpOnly : true,
        secure : true,
        sameSite : "None"
    }
    response.cookie('accessToken', accesstoken, cookiesOption)
    response.cookie('refreshToken', refreshtoken, cookiesOption)

    return response.json({
        message : "Login Successfully",
        error: false,
        success: true,
        data : {
            accesstoken,
            refreshtoken
        }
    })

    }catch(error){
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })


    }
    
}



// logout controller

export async function logoutController(request, response){
    try{
        const userid = request.userId // auth middleware
        const cookiesOption = {
            httpOnly : true,
            secure: true,
            sameSite : "None"
        }

        response.clearCookie("accessToken", cookiesOption)
        response.clearCookie("refreshToken", cookiesOption)

        const removeRefreshToken = await UserModel.findByIdAndUpdate(userid, {
            refresh_token : ""
        })

        return response.json({
            message : "Logout Successfully",
            error: false,
            success: true
        })
    } catch(error){
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
    
}



//image uplaod
var imagesArr = [];
export async function userAvatarController(request, response) {
    try{
        imagesArr = [];
        
        const userId = request.userId;
        const image = request.file;

        const options = {
            use_filename : true,
            unique_filename : false,
            overwrite: false,
        };

        for(let i=0; i<image?.length; i++){
            const img = await cloudinary.uploader.upload(
                image[i].path,
                options,
                function (error, result){
                    console.log(result)
                    imagesArr.push(result.secure_url);
                    fs.unlinkSync(`uploads/${request.files[i].filename}`);
                    console.log(request.files[i].filename)
                }
            );
        }

        return response.status(200).json({
            _id: userId,
            avatar : imagesArr[0]
        });

    } catch(error){
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
    
}