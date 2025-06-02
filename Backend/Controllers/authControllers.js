import User from "../Models/User.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import transporter from '../Config/nodemailer.js'
import { signupValidation, loginValidation } from "../Middleware/Validation.js";


//API for User Registration
export const register = async(req, res) => {

    const {error} = signupValidation(req.body)
    if(error) return res.status(400).json({ error: error.details[0].message })

    try {

        const {name, email, password} = req.body

        const existingUser = await User.findOne({email})

        if(existingUser){
            res.status(400).json({
                message: "User with this Email already Exist",
            })
        }
        
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = new User({
            name, 
            email,
            password: hashedPassword,
        })

        await user.save()

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
            expiresIn: '7d',
        })

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15*24*60*60*1000,           //15 days
        })

        //sending welcome email
        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: `Welcome to our Website ${name}`,
            text: `Welcome to our Website. Your account has been created with Email ID : ${email}`
        }

        await transporter.sendMail(mailOption)

        res.status(201).json({
            message: "User Registered",
            success: true,
            name: user.name,
            token: token,
        })

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        })
    }
}



//API for User Login
export const login = async(req, res) => {

    const {error} = loginValidation(req.body)
    if(error) return res.status(400).json({ error: error.details[0].message })

    try {

        const {email, password} = req.body

        const user = await User.findOne({email})

        if(!user){
            res.status(400).json({
                message: "No User exists with this Email.",
            })
        }
        
        const comparePassword = await bcrypt.compare(password, user.password)

        if(!comparePassword){
            res.status(400).json({
                message: "Invalid Password",
            })
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
            expiresIn: '7d',
        })

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15*24*60*60*1000,
        })

        res.status(200).json({
            message: "Logged In Successfully",
            success: true,
            name: user.name,
            token: token
        })


    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        })
    }
}



//API for User Logout
export const logout = async(req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        })

        res.status(200).json({
            message: "Logged Out Successfully",
            success: true,
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        })
    }
}




//API for sending OTP to reset the User's Password
export const sendResetOtp = async(req, res) => {
    const {email} = req.body;

    if(!email){
        res.status(404).json({
            message: "Email is Required",
        })
    }

    try{
        const user = await User.findOne({email})

        if(!user){
            res.status(404).json({
                message: "User not Found",
            })
        }

        const otp = String(Math.floor(100000 + Math.random()*900000))

        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15*60*1000   //15 minutes

        await user.save()

        const mailOption = {
            from : process.env.SENDER_EMAIL,
            to : user.email,
            Subject : "OTP for Password Reset",
            text: `Your One Time Password (OTP) for changing your Password is ${otp}`
        }

        await transporter.sendMail(mailOption)

        res.status(200).json({
            message: "OTP sent to your Email",
            success: true,
        })
    }
    catch(error){
        res.status(500).json({
            message: "Internal Server Problem",
            error: error.message
        })
    }
}



//API for changing the User's Password
export const resetPassword = async(req, res) => {
    const {email, otp, newPassword} = req.body

    if(!email || !otp || !newPassword){
        res.json({
            message: "All fields are Mandatory",
        })
    }

    try {
        const user = await User.findOne({email})

        if(!user){
            res.status(400).json({
                message: "User Not Found",
            })
        }

        if(user.verifyOtp == '' || user.resetOtp !== otp){
            res.status(400).json({
                message: "Invalid OTP",
            })
        }

        if(user.resetOtpExpireAt < Date.now()){
            res.status(400).json({
                message: "Expired OTP",
            })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        user.password = hashedPassword,
        user.resetOtp = '',
        user.resetOtpExpireAt = 0

        await user.save()

        res.status(200).json({
            message : "Password Changed Successfully",
            success: true,
        })

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        })
    }
}



//API for fetching the User data
export const getUserData = async(req, res) => {
    try{
        const {email} = req.body

        const user = await User.findOne({email})

        if(!user){
            res.status(404).json({
                message: "User Not Found",
            })
        }

        res.status(200).json({
            success: true,
            userData : {
                name: user.name,
            }
        })

    }
    catch(error){
        res.status(500).json({
            message: "Inernal Server Error",
            error: error.message
        })
    }
}