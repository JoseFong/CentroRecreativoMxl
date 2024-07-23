import { asignarActAGrupo } from "@/Controllers/grupoController";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try{
        const data = await req.json()
        const response = await asignarActAGrupo(data)
        if(!response) return NextResponse.json({message:"Error al asignar al grupo."},{status:404})
        return NextResponse.json({message:"Éxito"},{status:200})
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}