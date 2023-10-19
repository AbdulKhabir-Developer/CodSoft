import userModel from "../models/userModel.js";

export const registerController = async (req, res, next) => {
    
        const {name, email, password, lastName} = req.body
        //validate
        if(!name){
            next('Please provide Name');    
        }
        if(!email){
            next('Please provide email'); 
        }
        if(!password){
            next('Please provide password and must be atleast 6 characters'); 
        }

        const existingUser = await userModel.findOne({email})
        if(existingUser){
            next('Email Already Register plz Login'); 
        }

        const user = await userModel.create({name, email, password, lastName});
        //token
        const token = user.createJWT();
        res.status(201).send({
            success:true,
            message:"User Created Successfully",
            user:{
                name:user.name,
                lastName:user.lastName,
                email:user.email,
                location:user.location

            },
            token
        });   
  
};

export const loginController = async (req, res) => {
    const {email, password} = req.body
    //validation
    if(!email || !password){
        next('plz Provide All Feilds')
    }

    //find user by email
    const user = await userModel.findOne({email}).select("+password")
    if(!user){
        next('Invalid Username or Password')
    }
    //compare pass..
    const isMatch = await user.comparePassword(password)
    if(!isMatch){
        next('Invalid Username or Password')
    }
    user.password = undefined;
    const token = user.createJWT()
    res.status(200).json({
        success:true,
        message:'Login Successfully',
        user,
        token
    })
};