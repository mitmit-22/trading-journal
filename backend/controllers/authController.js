import bcrypt from "bcryptjs"
import prisma from "../lib/prisma.js"

import { generateToken } from "../lib/auth.js"


export const register = async (req,res) =>{
    const {name , email, password } = req.body;

    try{
        const existingUser = await prisma.user.findUnique({where:{email}})

        if(existingUser){
            return res.status(400).json({message:"email already used"});

        }

        const hashedPassword = await bcrypt.hash(password, 10)
        
        const user = await prisma.user.create({
            data : {name , email, password:hashedPassword},

        })
        const token = generateToken(user.id)
        res.status(201).json ({
            token,
            user:{id:user.id,name:user.name,email:user.email},
            
       })
    } catch(error){
        console.error("REGISTER ERROR:", error)
        res.status(500).json({ message: "Server error", error: error.message });
    }

} 

export const login = async (req,res) =>{
    const {email,password} = req.body;

    try{
        const user = await prisma.user.findUnique({where:{email}})

        if(!user){
           return res.status(400).json({message:"invalid credentials"})
        }

        const isMatch = await bcrypt.compare(password,user.password)

        if(!isMatch){
            return res.status(400).json({ message: "Invalid credentials" })
        }
        const token = generateToken(user.id)
        
            res.status(200).json({
                token,
                user:{id:user.id,name:user.name,email:user.email},
            })
    }catch(error){
        res.status(500).json({ message: "Server error", error: error.message })

    }
}

 
