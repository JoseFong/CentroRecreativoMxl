import { NextResponse } from "next/server";
import {prisma} from "@/utils/prisma"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers";

export async function POST(req:Request){
    try{
        const data = await req.json()

        const user = await prisma.user.findFirst({
            where: {
                username: data.username
            }
        })
        if(!user) return NextResponse.json({message:"Credenciales incorrectas."},{status:400})

        const valid = await bcrypt.compare(data.password,user.password)
        if(!valid) return NextResponse.json({message:"Credenciales incorrectas."},{status:400})

        const token = jwt.sign({id:user.id,username:user.username},process.env.JWT_SECRET!)

        const cookieStore = cookies()
        cookieStore.set({name:"centroDeAtencionMultipleUser",value:token,path:"/",httpOnly:true})

        return NextResponse.json({status:200})
    }catch(e:any){
        return NextResponse.json({message:"Error 500: "+e.message},{status:500})
    }
}

export async function GET(req:Request){
    try{
        const cookieStore = cookies()
        cookieStore.delete("centroDeAtencionMultipleUser")
        return NextResponse.json({status:200})
    }catch(e:any){
        return NextResponse.json({message:"Error 500: "+e.message},{status:500})
    }
}