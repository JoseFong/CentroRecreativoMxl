import { obtenerNEEs } from "@/Controllers/neeController";
import { NextRequest, NextResponse } from "next/server";

/**
 * Handler get para neurodivergencias
 * @author Fong
 * @param request 
 * @returns 
 */
export async function GET(request:NextRequest){
    try{
        const nees = await obtenerNEEs()
        if(!nees){
            return NextResponse.json({message:"Error al obtener las neurodivergencias."},{status:404})
        }
        return NextResponse.json(nees)
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}