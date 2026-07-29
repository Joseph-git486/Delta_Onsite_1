const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const transporter = require('../config/mailer');

async function signup(req, res, next){
    try {
        const Email = req.body.email;
        
        const pw = await bcrypt.hash(req.body.password, 10);   // 2^10 rounds of computation per hash making password guesses computationally costly. The hash: (bcrypt version; 2b in this case)$(salt round)$(salt)$(actual hash)
        const verification = await User.create({
            userName: req.body.userName,
            email: Email,
            password: pw,
            role: 'user'
        })
        res.status(201).json({message: "User has been created."});
        
    } catch(err){
        if(err.code === 11000){
            return res.status(409).json({message:"Email already exists"});
        }
        next(err);
    }
}

async function refresh(req, res, next){
    try {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken){
            return res.status(401).json({message: "No refresh token"});
        }

        const hashedToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
        const user = await User.findOne({'refreshToken': hashedToken});

        if(!user){
            return res.status(403).json({message: "Invalid refresh token"});
        }

        const accessToken = jwt.sign(
            {userId: user._id, role: user.role},
            process.env.JWT_SECRET,
            {expiresIn: '15m'}
        );

        res.status(200).json({accessToken});
    } catch(err){
        next(err);
    }
}

async function login(req, res, next){
    try{
        if(req.body.userName === null && req.body.email === null){
            return res.status(400).json({message: "Username or Email not entered"});
        }
        const query = req.body.userName ? {userName: req.body.userName} : {email : req.body.email};
        const user = await User.findOne(query);
        if(user !== null){
            const pw = req.body.password;
            if(await bcrypt.compare(pw,user.password)){   // Takes the hash, gets the salt rounds value and salt from the string and checks if the typed password hashed with this particular salt produces the actual-hash part stored in the hash
                const accessToken = jwt.sign(
                    {userId: user._id, role:user.role },
                    process.env.JWT_SECRET,
                    { expiresIn: '15m'}
                );
                const refreshToken = crypto.randomBytes(40).toString('hex');
                user.refreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
                await user.save();
                res.cookie('refreshToken',refreshToken,{
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict',
                    maxAge: 7*24*60*60*1000
                })
                res.status(200).json({message: "Logged in", accessToken});
            }
            else{
                res.status(401).json({message: "Invalid credentials"});    // Better than "Incorrect password", because returning "Incorrect password" leaks info to attacker that the Email/userName exists in DB.
            }
        }    
        
        else{
            res.status(401).json({message: "Invalid credentials"});       
        }
    } catch(err){   
        next(err);
    }
}

async function signout(req, res){
    res.status(200).json({message:"Logged out"});
}

async function forgotPassword(req,res){
    const emailReceived = req.body.email;
    const user = await User.findOne({email: emailReceived});
    if(user === null){
        return res.status(200).json({message: "URL has been sent. Please check your Email inbox"});   // No URL would be printed. If it was sent via Email, the attacker won't know which Emails exist in the DB. Limitation: Real attackers can still differentiate based on the time it takes to respond. If Email exists, then it will take a while for the DB to respond. Otherwise, they will get an instant message hinting that the Email doesn't exist.
    }
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 15*60*1000;
    await user.save();
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: req.body.email,
        subject: "DTube Password rest",
        text: `Click the link to reset password: http://localhost:5173/reset-password?token=${resetToken}`
    })
    res.status(200).json({message: "URL has been sent. Please check your Email"});
}

async function resetPassword(req, res,next){       // Don't send via console, anyone knowing the email can change Password. Send it via Email.
    try {
        if( !req.body.password || req.body.password.length < 1){
            return res.status(400).json({message:"Password is required"});
        }
        const user = await User.findOne({   
            resetPasswordToken: req.body.token,
            resetPasswordExpires: { $gt :Date.now()}
        });
        if( user === null){
            return res.status(400).json({message: "Invalid or expired token"});
        }

        user.password = await bcrypt.hash(req.body.password, 10);

        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        res.status(200).json({message:"Password reset successfully"});

    } catch(err){
        next(err);
    }
}
module.exports = {signup, login, signout, forgotPassword, resetPassword,refresh};


