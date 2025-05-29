const userModel = require("../models/users");
const bcrypt = require("bcryptjs");

//register user
const SignUp = async (req, res) => {
    const {name,email,password,phone} = req.body;
    
    if(!name || !email || !password || !phone){
        return res.status(400).json({msg : "Please enter all fields"});
    }
    try{
        const existingUser = await userModel.findOne({email});
        if(existingUser){
            return res.status(400).json({msg : "User already exists"});
        }
        else{
            //passeword hashing
            const hashPassword = await bcrypt.hash(password,10);

            //creating new user
            const newUser = new userModel({
                name,
                email,
                password:hashPassword,
                phone
            });

            //saving user
            await newUser.save();
            res.status(201).json(newUser);
        }
    }
    catch(error){
        console.error(error);
    }
}

//login user
const LogIn = async (req, res) => {
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(400).json({msg : "Please enter all fields"});
    }
    else{
        try {
            const user = await userModel.findOne({email});
            if(!user){
                return res.status(400).json({msg : "User does not exist"});
            }
            else{
                const isMatch = await bcrypt.compare(password,user.password);
                if(!isMatch){
                    return res.status(400).json({msg : "Invalid credentials"});
                }
                else{
                    //res.status(200).json({msg : "Login successful"});
                    return res.status(200).json(user);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = {SignUp,LogIn};